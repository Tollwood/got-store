import WesterosCardRules from '../../src/logic/cards/westerosCardRules';
import WesterosCard from '../../src/model/cards/westerosCard';
import {GamePhase} from '../../src/model/gamePhase';
import {gameStore} from '../../src/reducer';
import {loadGame, playWesterosCard} from '../../src/actions';


describe('PlayWesterosCardAction', () => {

    describe('getNextCard', () => {
        it('should play westerosCards1 if cardTpye is 1', () => {
            const expectedCard = new WesterosCard(1, '', '', '', GamePhase.WESTEROS1, 1, []);
            const secondCard = new WesterosCard(2, '', '', '', GamePhase.WESTEROS1, 2, []);
            const westerosCards: Map<GamePhase, WesterosCard[]> = new Map();
            westerosCards.set(GamePhase.WESTEROS1, [expectedCard, secondCard]);
            const gameState = {
                gamePhase: GamePhase.WESTEROS1,
                westerosCards,
                currentWesterosCard: null
            };
            gameStore.dispatch(loadGame(gameState));

            // when
            gameStore.dispatch(playWesterosCard());

            const newState = gameStore.getState();
            const card: WesterosCard = newState.currentWesterosCard;
            expect(card).toEqual(expectedCard);
            expect(secondCard).toEqual(newState.westerosCards.get(GamePhase.WESTEROS1)[0]);
        });
    });


});
