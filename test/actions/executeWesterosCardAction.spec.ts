import {GamePhase} from '../../src/model/gamePhase';
import WesterosCard from '../../src/model/cards/westerosCard';
import WesterosCardBuilder from '../westerosCardBuilder';
import CardFunction from '../../src/model/cards/cardFunction';
import {GameStoreState} from '../../src/gameStoreState';
import {GameStoreFactory} from '../../src/reducer';
import {ActionFactory} from '../../src/ActionFactory';
import {CardAbilities} from '../../src/logic/cards/cardAbilities';


xdescribe('executeWesterosCardAction', () => {

    it('should increase wildlingCount', () => {
        // given
        const currentWildingCount: number = 3;
      var cardFunction: CardFunction  = new CardFunction('shuffleCards', 'description');
      const card: WesterosCard = new WesterosCardBuilder()
            //.gamePhase(GamePhase.WESTEROS1)
            .selectedFunction(cardFunction)
            .wildling(4)
            .build();

        const state: GameStoreState = {wildlingsCount: currentWildingCount};
        const store = GameStoreFactory.create();
        store.dispatch(ActionFactory.loadGame(state));

        spyOn(CardAbilities, 'shuffleCards').and.returnValue(state);

        // when
        store.dispatch(ActionFactory.executeWesterosCard(card));

        // then
        const newState = store.getState();

        expect(newState.wildlingsCount).toBe(currentWildingCount + card.wildling);
        expect(CardAbilities.shuffleCards).toHaveBeenCalledWith(state);
    });

});

