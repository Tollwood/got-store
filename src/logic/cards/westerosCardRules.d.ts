import WesterosCard from '../../model/cards/westerosCard';
import { GameStoreState } from '../../gameStoreState';
import { GamePhase } from '../../model/gamePhase';
export default class WesterosCardRules {
    static getNextCard(westerosCards: Map<GamePhase, WesterosCard[]>, gamePhase: GamePhase): WesterosCard;
    static shiftCardOnCurrentStack(state: GameStoreState): Map<GamePhase, WesterosCard[]>;
}
