import PossibleMove from './possibleMove';
import {Store} from 'redux';
import {GameStoreState} from '../state';
import {House} from '../model/player/house';
import {GamePhase} from '../model/gamePhase';
import {ActionFactory} from '../ActionFactory';
import Area from '../model/area/area';
import {AreaStatsService} from '../logic/area/areaStatsService';
import {OrderTokenType} from '../model/orderToken/orderTokenType';
import {AreaKey} from '../model/area/areaKey';
import {OrderToken} from '../model/orderToken/orderToken';
import StateSelectorService from '../selector/stateSelectorService';

export default class AiCalculator {

    public static executeOrder(store: Store<GameStoreState>, house: House) {
        const state = store.getState();
        const shouldDoSomething = state.currentHouse === house && (state.gamePhase === GamePhase.ACTION_RAID || state.gamePhase === GamePhase.ACTION_MARCH);
        if (!shouldDoSomething) {
            return
        }
        if (state.gamePhase === GamePhase.ACTION_MARCH) {
            let areasWithMoveToken = this.getAreasForHouseWithToken(Array.from(state.areas.values()), house, StateSelectorService.MARCH_ORDER_TOKENS);
            if (areasWithMoveToken.length > 0) {
                let sourceArea = areasWithMoveToken[0];
                let bestMove = AiCalculator.getBestMove(state, house, sourceArea, [sourceArea.orderToken.getType()]);
                const targetArea = state.areas.get(bestMove.targetAreaKey);
                if (bestMove === null) {
                    store.dispatch(ActionFactory.skipOrder(sourceArea.key));
                    return;
                }
                if (targetArea && targetArea.units.length > 0 && targetArea.controllingHouse !== sourceArea.controllingHouse) {
                    store.dispatch(ActionFactory.resolveFight(sourceArea.key, targetArea.key));
                    return;
                }
                store.dispatch(ActionFactory.moveUnits(sourceArea.key, bestMove.targetAreaKey, sourceArea.units, true, AiCalculator.shouldEstablishControl(sourceArea)));
                return;
            }
        }

        if (state.gamePhase === GamePhase.ACTION_RAID) {
            let areasWithRaidToken = this.getAreasForHouseWithToken(Array.from(state.areas.values()), house, StateSelectorService.RAID_ORDER_TOKENS);
            if (areasWithRaidToken.length > 0) {
                store.dispatch(ActionFactory.skipOrder(areasWithRaidToken[0].key));
            }
        }

    }

    public static recruit(store: Store<GameStoreState>, house: House): Area {

        const state = store.getState();
        const shouldDoSomething = state.areasAllowedToRecruit.length > 0
            && state.currentHouse === house
            && StateSelectorService.getAreasAllowedToRecruit(store.getState(), house).length > 0;
        if (!shouldDoSomething) {
            return;
        }
        const areas = StateSelectorService.getAreasAllowedToRecruit(store.getState(), house);
        const possibleAreasToRecruit = areas.filter((a) => {
            return house === a.controllingHouse;
        });
        if (possibleAreasToRecruit.length > 0) {
            store.dispatch(ActionFactory.recruitUnits(possibleAreasToRecruit[0].key));
        }
        return null;
    }

    public static placeAllOrderTokens(store: Store<GameStoreState>, house: House) {
        const shouldDoSomething = store.getState().gamePhase === GamePhase.PLANNING;
        if (!shouldDoSomething) {
            return;
        }
        const state = store.getState();
        let availableOrderToken = StateSelectorService.getPlacableOrderTokenTypes(state, house);
        let areasToPlaceAToken = Array.from(state.areas.values()).filter((area: Area) => {
            return StateSelectorService.isAllowedToPlaceOrderToken(state, house, area.key);
        });
        let bestMovesForAllPlaceableToken = areasToPlaceAToken.map((area) => {
            return this.getBestMove(state, house, area, availableOrderToken);
        });

        for (let bestMove of bestMovesForAllPlaceableToken) {
            store.dispatch(ActionFactory.placeOrder(bestMove.sourceAreaKey, new OrderToken(house, bestMove.orderTokenType)));
        }
    }

    private static controlledByOtherPlayerWithEnemyUnits(area: Area, house: House) {
        return area !== undefined && area.controllingHouse !== house && area.units.length > 0;
    }

    private static getBestMove(state: GameStoreState, currentHouse: House, area: Area, availableOrderToken: OrderTokenType[]): PossibleMove {
        let allPossibleMoves = this.getAllPossibleMoves(state, currentHouse, area, availableOrderToken);
        if (allPossibleMoves.length === 0) {
            return null;
        }
        return allPossibleMoves.sort((a, b) => {
            return b.value - a.value;
        })[0];
    }

    private static getAreasForHouseWithToken(areas: Area[], house: House, orderTokens: Array<OrderTokenType>): Array<Area> {
        return areas.filter((area) => {
            return area.orderToken
                && area.orderToken.getHouse() === house
                && orderTokens.indexOf(area.orderToken.getType()) > -1;
        });
    }

    private static getAllPossibleMoves(state: GameStoreState, currentHouse: House, area: Area, availableOrderToken: Array<OrderTokenType>): PossibleMove[] {
        let possibleMoves = [];
        availableOrderToken.forEach((orderTokenType) => {
            switch (orderTokenType) {
                case OrderTokenType.consolidatePower_0:
                case OrderTokenType.consolidatePower_1:
                case OrderTokenType.consolidatePower_special:
                    possibleMoves.push(new PossibleMove(orderTokenType, area.key, this.calculateValueForConsolidatePowerOrder()));
                    break;
                case OrderTokenType.defend_0:
                case OrderTokenType.defend_1:
                case OrderTokenType.defend_special:
                    possibleMoves.push(new PossibleMove(orderTokenType, area.key, this.calculateValueForDefendingOrders(state, area, currentHouse, 0.1)));
                    break;

                case OrderTokenType.support_0:
                case OrderTokenType.support_1:
                case OrderTokenType.support_special:
                    possibleMoves.push(new PossibleMove(orderTokenType, area.key, this.calculateValueForSupportOrder()));
                    break;

                case OrderTokenType.raid_0:
                case OrderTokenType.raid_1:
                case OrderTokenType.raid_special:
                    possibleMoves.push(new PossibleMove(orderTokenType, area.key, this.calculateValueForRaidOrders(state, area, currentHouse, 0.1)));
                    break;

                case OrderTokenType.march_zero:
                case OrderTokenType.march_minusOne:
                case OrderTokenType.march_special:
                    StateSelectorService.getAllAreasAllowedToMarchTo(state, area).forEach((possibleAreaKey) => {
                        possibleMoves.push(new PossibleMove(orderTokenType, area.key, this.calculateValueForMarchOrders(state, area.key, possibleAreaKey, currentHouse), possibleAreaKey));
                    });
                    break;
            }

        });
        return possibleMoves;
    }

    private static unOccupiedOrNoEnemies(area: Area, house: House) {
        return area === undefined || (area.controllingHouse !== null && area.controllingHouse !== house) && area.units.length === 0;
    }

    private static calculateValueForDefendingOrders(state: GameStoreState, area: Area, currentHouse: House, factor: number): number {
        let value = 0;
        AreaStatsService.getInstance().areaStats.get(area.key).borders
            .forEach((borderAreaKey) => {
                const borderArea = state.areas.get(borderAreaKey);
                let controlledByOtherPlayerWithEnemyUnits = borderArea !== undefined && borderArea.controllingHouse !== null && borderArea.controllingHouse !== currentHouse && borderArea.units.length > 0;
                if (controlledByOtherPlayerWithEnemyUnits) {
                    value += factor;
                }
            });
        return value;
    }

    private static calculateValueForConsolidatePowerOrder(): number {
        return 0.1;
    }

    private static calculateValueForSupportOrder(): number {
        return 0;
    }

    private static calculateValueForRaidOrders(state: GameStoreState, area: Area, currentHouse: House, factor: number) {

        let value = 0;
        AreaStatsService.getInstance().areaStats.get(area.key).borders
            .forEach((borderAreaKey) => {
                let controlledByOtherPlayerWithEnemyUnits = AiCalculator.controlledByOtherPlayerWithEnemyUnits(state.areas.get(borderAreaKey), currentHouse);
                if (controlledByOtherPlayerWithEnemyUnits) {
                    value += factor;
                }
            });
        return value;
    }

    private static calculateValueForMarchOrders(state: GameStoreState, sourceAreaKey: AreaKey, targetAreaKey: AreaKey, currentHouse: House) {
        let value = 0;
        const sourceAreaStats = AreaStatsService.getInstance().areaStats.get(sourceAreaKey);
        let numberOfEnemiesAtBorder = sourceAreaStats.borders
            .filter((borderAreaKey) => {
                return AiCalculator.controlledByOtherPlayerWithEnemyUnits(state.areas.get(borderAreaKey), currentHouse);
            }).length;

        const targetArea = state.areas.get(targetAreaKey);
        let unOccupiedOrNoEnemies = this.unOccupiedOrNoEnemies(targetArea, currentHouse);
        const targetAreaStats = AreaStatsService.getInstance().areaStats.get(targetAreaKey);

        if (targetAreaStats.hasCastleOrStronghold() && unOccupiedOrNoEnemies) {
            value += 0.9;
        }
        if (targetAreaStats.supply > 0 && unOccupiedOrNoEnemies) {
            value += (0.1 * targetAreaStats.supply);
        }
        if (targetAreaStats.consolidatePower > 0 && unOccupiedOrNoEnemies) {
            value += (0.1 * targetAreaStats.consolidatePower);
        }
        value -= (numberOfEnemiesAtBorder * 0.1);

        return value;
    }

    private static shouldEstablishControl(sourceArea: Area): boolean {
        const sourceAreaStats = AreaStatsService.getInstance().areaStats.get(sourceArea.key);
        return (sourceArea.units.length === 0 && (sourceAreaStats.hasCastleOrStronghold() || sourceAreaStats.supply > 0 || sourceAreaStats.consolidatePower > 0));
    }

}
