import {
    ExecuteRaidOrderAction, ExecuteWesterosCardAction, LoadGameAction, MoveUnitsAction, NewGameAction, OtherAction,
    PlaceOrderAction,
    PlayWesterosCardAction,
    RecruitUnitsAction,
    ResolveFightAction, SkipOrderAction
} from './actions';

export type ActionTypes =
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