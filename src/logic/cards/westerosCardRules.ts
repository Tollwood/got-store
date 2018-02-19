import {WesterosCard} from '../../model/cards/westerosCard';
import {gameStore} from '../../reducer';
import {playWesterosCard} from '../../actions';
import {GameStoreState} from '../../gameStoreState';


export default class WesterosCardRules {

    public static getNextCard(state: GameStoreState): WesterosCard {
        const cards: WesterosCard[] = state.westerosCards.get(state.gamePhase);
        const cardToPlay = this.moveCardToEndOfTheStack(cards);
        gameStore.dispatch(playWesterosCard(cardToPlay));
        return cardToPlay;
    }

    public static moveCardToEndOfTheStack(westerosCards: Array<WesterosCard>): WesterosCard {
        // FIXME state change outside reducer
        let cardToPlay: WesterosCard = westerosCards.shift();
        westerosCards.push(cardToPlay);
        return cardToPlay;
    }
}
