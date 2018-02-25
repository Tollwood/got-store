import {PlayerSetup} from '../model/player/playerSetup';
import {UnitType} from '../model/units/unitType';
import {Unit} from '../model/units/units';
import {AreaKey} from '../model/area/areaKey';
import {OrderToken} from '../model/orderToken/orderToken';
import { WesterosCard} from '../model/cards/westerosCard';
import {State} from '../state';

export enum TypeKeys {
    LOAD_GAME = 'LOAD_GAME',
    NEW_GAME = 'NEW_GAME',

    PLAY_WESTEROS_CARD = 'PLAY_WESTEROS_CARD',
    EXECUTE_WESTEROS_CARD = 'EXECUTE_WESTEROS_CARD',

    RECRUIT_UNITS = 'RECRUIT_UNITS',

    PLACE_ORDER = 'PLACE_ORDER',
    SKIP_ORDER = 'SKIP_ORDER',
    EXECUTE_RAID_ORDER = 'EXECUTE_RAID_ORDER',
    MOVE_UNITS = 'MOVE_UNITS',
    RESOLVE_FIGHT = 'RESOLVE_FIGHT',

    OTHER_ACTION = '__any_other_action_type__'
}

export interface PlayWesterosCardAction {
    type: TypeKeys.PLAY_WESTEROS_CARD;
}

export interface ExecuteWesterosCardAction {
    type: TypeKeys.EXECUTE_WESTEROS_CARD;
    card: WesterosCard;
}

export interface ResolveFightAction {
    type: TypeKeys.RESOLVE_FIGHT;
    sourceAreaKey: AreaKey;
    targetAreaKey: AreaKey;
}

export interface ExecuteRaidOrderAction {
    type: TypeKeys.EXECUTE_RAID_ORDER;
    sourceAreaKey: AreaKey;
    targetAreaKey: AreaKey;
}

export interface SkipOrderAction {
    type: TypeKeys.SKIP_ORDER;
    areaKey: AreaKey;
}

export interface PlaceOrderAction {
    type: TypeKeys.PLACE_ORDER;
    areaKey: AreaKey;
    orderToken: OrderToken;
}

export interface RecruitUnitsAction {
    type: TypeKeys.RECRUIT_UNITS;
    areaKey: AreaKey;
    units: UnitType[];
}

export interface MoveUnitsAction {
    type: TypeKeys.MOVE_UNITS;
    source: AreaKey;
    target: AreaKey;
    units: Unit[];
    completeOrder: boolean;
    establishControl: boolean;
}

export interface NewGameAction {
    type: TypeKeys.NEW_GAME;
    playerSetup: Array<PlayerSetup>;
}

export interface LoadGameAction {
    type: TypeKeys.LOAD_GAME;
    state: State;
}

export interface OtherAction {
    type: TypeKeys.OTHER_ACTION;
}

type ActionTypes =
    | NewGameAction
    | LoadGameAction
    | RecruitUnitsAction
    | MoveUnitsAction
    | ResolveFightAction
    | PlaceOrderAction
    | SkipOrderAction
    | ExecuteRaidOrderAction
    | ExecuteWesterosCardAction
    | PlayWesterosCardAction
    | OtherAction;


export { ActionTypes}