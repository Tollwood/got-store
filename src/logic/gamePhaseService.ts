import {ALL_PHASES, GamePhase} from '../model/gamePhase';
import {House} from '../model/player/house';
import {AreaKey} from '../model/area/areaKey';
import Area from '../model/area/area';
import {GameStoreState} from '../state';
import VictoryRules from './victoryRules';
import PlayerStateModificationService from './gameState/playerStateModificationService';
import AreaModificationService from './gameState/areaStateModificationService';
import GameStateModificationService from './gameState/gameStateModificationService';
import StateSelectorService from '../selector/stateSelectorService';

export default class GamePhaseService {

    public static getNextPhase(state: GameStoreState, updatedAreas: Area[]): GamePhase {
        return this.getNextGamePhaseWithPendingActions(updatedAreas, state.gamePhase);
    }

    public static getNextHouse(state: GameStoreState, nextGamePhase: GamePhase) {
        if (state.gamePhase === nextGamePhase) {
            return this.getNextHouseWithPendingActions(state.ironThroneSuccession,
                Array.from(state.areas.values()),
                nextGamePhase,
                this.nextHouse(state.ironThroneSuccession, state.currentHouse));
        }
        return state.ironThroneSuccession[0];
    }

    public static cleanupBoard(state: GameStoreState) {
        if (state.gamePhase === GamePhase.ACTION_CLEANUP) {
            const winningHouse = VictoryRules.getWinningHouse(state);
            return {
                ...state,
                areas: AreaModificationService.removeAllRemainingTokens(Array.from(state.areas.values())),
                players: PlayerStateModificationService.executeAllConsolidatePowerOrders(state.players, Array.from(state.areas.values())),
                gamePhase: GamePhase.PLANNING,
                gameRound: state.gameRound + 1,
                winningHouse: winningHouse,
                currentHouse: StateSelectorService.getFirstFromIronThroneSuccession(state),
                currentlyAllowedTokenTypes: GameStateModificationService.INITIALLY_ALLOWED_ORDER_TOKEN_TYPES,
            };
        }
        return state;
    }

    // TODO should be integrated in the other two methods getNextPhase and getNextHouse
    public static updateGamePhaseAfterRecruiting(state: GameStoreState, areaKey?: AreaKey) {
        const nextHouseToRecruit = this.getNextHouseToRecruit(state, areaKey);
        return {
            currentHouse: nextHouseToRecruit !== null ? nextHouseToRecruit : state.ironThroneSuccession[0],
            gamePhase: nextHouseToRecruit !== null ? state.gamePhase : this.getNextGamePhase(state.gamePhase),
        };
    }

    public static getNextGamePhase(currentGamePhase: GamePhase): GamePhase {
        const currentIndex = ALL_PHASES.lastIndexOf(currentGamePhase);
        return ALL_PHASES.length === currentIndex ? ALL_PHASES[0] : ALL_PHASES[currentIndex + 1];
    }

    private static isStillIn(areas: Area[], gamePhase: GamePhase, house?: House) {
        switch (gamePhase) {
            case GamePhase.PLANNING:
                return !this.isPlanningPhaseComplete(areas);
            case GamePhase.ACTION_RAID:
                return !this.allRaidOrdersRevealed(areas, house);
            case GamePhase.ACTION_MARCH:
                return !this.allMarchOrdersRevealed(areas, house);
            case GamePhase.ACTION_CLEANUP:
                return areas.filter((area) => {
                    return area.orderToken;
                }).length > 0;
        }
    }

    private static allMarchOrdersRevealed(areas: Area[], house?: House): boolean {
        return areas.filter((area) => {
            return area.orderToken && area.orderToken.isMoveToken() && (house === undefined || house === area.controllingHouse);
        }).length === 0;
    }

    private static nextHouse(ironThroneSuccession: House[], house: House): House {
        const currrentIndex = ironThroneSuccession.indexOf(house);
        const nextIndex = ironThroneSuccession.length > currrentIndex + 1 ? currrentIndex + 1 : 0;
        return ironThroneSuccession[nextIndex];
    }

    private static allRaidOrdersRevealed(areas: Area[], house?: House): boolean {
        return areas.filter((area) => {
            return area.orderToken && area.orderToken.isRaidToken() && (house === undefined || house === area.controllingHouse);
        }).length === 0;
    }

    private static isAreaWithUnitsAndToken(area): boolean {
        return area.units.length > 0 && area.orderToken != null;
    }

    private static isAreaWithoutUnits(area): boolean {
        return area.units.length === 0;
    }

    private static getNextHouseToRecruit(state: GameStoreState, areaKey: AreaKey) {
        let possibleNextHouse = this.nextHouse(state.ironThroneSuccession, state.currentHouse);
        while (possibleNextHouse !== state.currentHouse) {
            if (this.isAllowedToRecruit(state, possibleNextHouse)) {
                return possibleNextHouse;
            } else {
                possibleNextHouse = this.nextHouse(state.ironThroneSuccession, possibleNextHouse);
            }
        }
        if (this.isAllowedToRecruit(state, state.currentHouse, areaKey)) {
            return state.currentHouse;
        }
        return null;
    }

    private static isAllowedToRecruit(state: GameStoreState, house: House, areaKey?: AreaKey) {
        const areasAllowedToRecruit = StateSelectorService.getAreasAllowedToRecruit(state, house).map(area => {
            return area.key;
        });
        const lastIndex = areasAllowedToRecruit.lastIndexOf(areaKey);
        if (lastIndex > 0) {
            areasAllowedToRecruit.slice(lastIndex, 1);
        }
        return areasAllowedToRecruit.length > 0;
    }

    private static isPlanningPhaseComplete(areas: Area[]) {
        const completedAreas = areas.filter((area) => {
            const isAreaWithUnitsAndToken = this.isAreaWithUnitsAndToken(area);
            const isAreaWithoutUnits = this.isAreaWithoutUnits(area);
            return isAreaWithUnitsAndToken || isAreaWithoutUnits;
        }).length;
        return completedAreas === areas.length;

    }

    private static getNextGamePhaseWithPendingActions(areas: Area[], gamePhase: GamePhase): GamePhase {
        const isStillIn = this.isStillIn(areas, gamePhase);
        if (isStillIn) {
            return gamePhase;
        }
        return this.getNextGamePhaseWithPendingActions(areas, this.getNextGamePhase(gamePhase));
    }

    private static getNextHouseWithPendingActions(ironThroneSuccession: House[], areas: Area[],
                                                  gamePhase: GamePhase, house: House) {
        if (this.isStillIn(areas, gamePhase, house)) {
            return house;
        }
        const nextHouse = this.nextHouse(ironThroneSuccession, house);
        return this.getNextHouseWithPendingActions(ironThroneSuccession, areas, gamePhase, nextHouse);
    }
}
