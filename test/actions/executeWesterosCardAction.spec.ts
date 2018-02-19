import {gameStore} from '../../src/reducer';
import {executeWesterosCard, loadGame} from '../../src/actions';
import {GamePhase} from '../../src/model/gamePhase';
import CardAbilities from '../../src/logic/cards/cardAbilities';
import {WesterosCard} from '../../src/model/cards/westerosCard';
import WesterosCardBuilder from '../westerosCardBuilder';
import CardFunction from '../../src/model/cards/cardFunction';
import {GameStoreState} from '../../src/gameStoreState';


describe('executeWesterosCardAction', () => {

    it('should increase wildlingCount', () => {
        // given
        const currentWildingCount: number = 3;
      var cardFunction: CardFunction  = new CardFunction('shuffleCards', 'description');
      const card: WesterosCard = new WesterosCardBuilder()
            .gamePhase(GamePhase.WESTEROS1)
            .selectedFunction(cardFunction)
            .wildling(4)
            .build();

        const state: GameStoreState = {wildlingsCount: currentWildingCount};

        gameStore.dispatch(loadGame(state));

        spyOn(CardAbilities, 'shuffleCards').and.returnValue(state);

        // when
        gameStore.dispatch(executeWesterosCard(card));

        // then
        const newState = gameStore.getState();

        expect(newState.wildlingsCount).toBe(currentWildingCount + card.wildling);
        expect(CardAbilities.shuffleCards).toHaveBeenCalledWith(state);
    });

});

