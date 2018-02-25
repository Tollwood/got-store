import { ExecuteRaidOrderAction, ExecuteWesterosCardAction, LoadGameAction, MoveUnitsAction, NewGameAction, PlaceOrderAction, PlayWesterosCardAction, RecruitUnitsAction, ResolveFightAction, SkipOrderAction } from './actions';
import { GameStoreState } from './gameStoreState';
import Unit from './model/units/units';
import WesterosCard from './model/cards/westerosCard';
import { AreaKey } from './model/area/areaKey';
import { OrderToken } from './model/orderToken/orderToken';
import PlayerSetup from './model/player/playerSetup';
import { UnitType } from './model/units/unitType';
import CombatResult from './model/combatResult';
export declare class ActionFactory {
    static playWesterosCard(): PlayWesterosCardAction;
    static executeWesterosCard(card: WesterosCard): ExecuteWesterosCardAction;
    static resolveFight(combatResult: CombatResult): ResolveFightAction;
    static executeRaidOrder(sourceAreaKey: AreaKey, targetAreaKey: AreaKey): ExecuteRaidOrderAction;
    static skipOrder(areaKey: AreaKey): SkipOrderAction;
    static placeOrder(areaKey: AreaKey, orderToken: OrderToken): PlaceOrderAction;
    static moveUnits(source: AreaKey, target: AreaKey, units?: Unit[], completeOrder?: boolean, establishControl?: boolean): MoveUnitsAction;
    static recruitUnits(areaKey: AreaKey, units?: UnitType[]): RecruitUnitsAction;
    static newGame(playerSetup: PlayerSetup[]): NewGameAction;
    static loadGame(state: GameStoreState): LoadGameAction;
}
