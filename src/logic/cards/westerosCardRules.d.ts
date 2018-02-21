import WesterosCard from '../../model/cards/westerosCard';
import { GameStoreState } from '../../gameStoreState';
import { GamePhase } from '../../model/gamePhase';
export default class WesterosCardRules {
    static getNextCard(state: GameStoreState): GameStoreState;
    static shiftCardOnCurrentStack(state: GameStoreState): Map<GamePhase, WesterosCard[]>;
}
