import {
    ExecuteRaidOrderAction, ExecuteWesterosCardAction, LoadGameAction, MoveUnitsAction, NewGameAction, PlaceOrderAction,
    PlayWesterosCardAction, RecruitUnitsAction, ResolveFightAction,
    SkipOrderAction, TypeKeys
} from './actions/actions';
import {State} from './state';
import {Unit} from './model/units/units';
import {WesterosCard} from './model/cards/westerosCard';
import {AreaKey} from './model/area/areaKey';
import {OrderToken} from './model/orderToken/orderToken';
import {PlayerSetup} from './model/player/playerSetup';
import {UnitType} from './model/units/unitType';

class ActionFactory {

    static playWesterosCard(): PlayWesterosCardAction {
        return {
            type: TypeKeys.PLAY_WESTEROS_CARD
        };
    }

    static executeWesterosCard(card: WesterosCard): ExecuteWesterosCardAction {
        return {
            type: TypeKeys.EXECUTE_WESTEROS_CARD,
            card
        }
    }

    static resolveFight(sourceAreaKey: AreaKey, targetAreaKey: AreaKey): ResolveFightAction {
        return {
            type: TypeKeys.RESOLVE_FIGHT,
            sourceAreaKey: sourceAreaKey,
            targetAreaKey: targetAreaKey
        }
    }

    static executeRaidOrder(sourceAreaKey: AreaKey, targetAreaKey: AreaKey): ExecuteRaidOrderAction {
        return {
            type: TypeKeys.EXECUTE_RAID_ORDER,
            sourceAreaKey,
            targetAreaKey
        }
    }

    static skipOrder(areaKey: AreaKey): SkipOrderAction {
        return {
            type: TypeKeys.SKIP_ORDER,
            areaKey
        }
    }

    static placeOrder(areaKey: AreaKey, orderToken: OrderToken): PlaceOrderAction {
        return {
            type: TypeKeys.PLACE_ORDER,
            areaKey,
            orderToken
        }
    }

    static moveUnits(source: AreaKey,
              target: AreaKey,
              units: Unit[] = [],
              completeOrder: boolean = true,
              establishControl: boolean = false): MoveUnitsAction {
        return {
            type: TypeKeys.MOVE_UNITS,
            source,
            target,
            units,
            completeOrder,
            establishControl
        }
    }

    static recruitUnits(areaKey: AreaKey, units: UnitType[] = []): RecruitUnitsAction {
        return {
            type: TypeKeys.RECRUIT_UNITS,
            areaKey,
            units
        }
    }

    static newGame(playerSetup: PlayerSetup[]): NewGameAction {
        return {
            type: TypeKeys.NEW_GAME,
            playerSetup

        }
    }

    static loadGame(state: State): LoadGameAction {
        return {
            type: TypeKeys.LOAD_GAME,
            state: state
        }
    }
}

export {ActionFactory}