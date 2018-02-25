import {WesterosCard} from '../../src/model/cards/westerosCard';
import {WesterosCardBuilder} from '../westerosCardBuilder';
import {CardFunction} from '../../src/model/cards/cardFunction';
import {State} from '../../src/state';
import {GameLogicFactory} from '../../src/gameLogicFactory';
import {ActionFactory} from '../../src/actionFactory';
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

        const state: State = {wildlingsCount: currentWildingCount};
        const game = GameLogicFactory.create([]);
        game.execute(ActionFactory.loadGame(state));

        spyOn(CardAbilities, 'shuffleCards').and.returnValue(state);

        // when
        game.execute(ActionFactory.executeWesterosCard(card));

        // then
        const newState = game.getState();

        expect(newState.wildlingsCount).toBe(currentWildingCount + card.wildling);
        expect(CardAbilities.shuffleCards).toHaveBeenCalledWith(state);
    });

});

