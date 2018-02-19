import {WesterosCard} from '../../model/cards/westerosCard';
import {GameStoreState} from '../../gameStoreState';
import {GamePhase} from '../../model/gamePhase';


export default class WesterosCardRules {

    public static getNextCard(state: GameStoreState): GameStoreState {
        return state.westerosCards.get(state.gamePhase)[0];
    }

    public static shiftCardOnCurrentStack(state: GameStoreState): Map<GamePhase, WesterosCard[]> {
        const westerosCards = state.westerosCards.get(state.gamePhase);
        let cardToPlay: WesterosCard = westerosCards.shift();
        westerosCards.push(cardToPlay);
        const newStack: Map<GamePhase, WesterosCard[]> = new Map();
        state.westerosCards.forEach((value: WesterosCard[], key: GamePhase) => newStack.set(key, value));
        return newStack;
    }
}
