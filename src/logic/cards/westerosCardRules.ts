import WesterosCard from '../../model/cards/westerosCard';
import {GameStoreState} from '../../state';
import {GamePhase} from '../../model/gamePhase';


export default class WesterosCardRules {

    public static getNextCard(westerosCards: Map<GamePhase, WesterosCard[]>, gamePhase: GamePhase): WesterosCard {
        /*if(WESTEROS_PHASES.indexOf(gamePhase) > -1){
            return westerosCards.get(gamePhase)[0];
        }
        else {
            return null;
        }*/
        return null;
    }

   /* public static shiftCardOnCurrentStack(state: GameStoreState): Map<GamePhase, WesterosCard[]> {
        const westerosCards = state.westerosCards.get(state.gamePhase);
        let cardToPlay: WesterosCard = westerosCards.shift();
        westerosCards.push(cardToPlay);
        const newStack: Map<GamePhase, WesterosCard[]> = new Map();
        state.westerosCards.forEach((value: WesterosCard[], key: GamePhase) => newStack.set(key, value));
        return newStack;
    }*/
}
