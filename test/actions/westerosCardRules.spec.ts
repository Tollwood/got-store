import WesterosCardRules from '../../src/logic/cards/westerosCardRules';
import {WesterosCard} from '../../src/model/cards/westerosCard';
import {GamePhase} from '../../src/model/gamePhase';


describe('WesterosCardRules', () => {

    describe('getNextCard', () => {
        it('should play westerosCards1 if cardTpye is 1', () => {
            const expectedCard = new WesterosCard(1, '', '', '', GamePhase.WESTEROS1, 1, []);
            const westerosCards: Map<GamePhase, WesterosCard[]> = new Map();
            westerosCards.set(GamePhase.WESTEROS1, [expectedCard]);
            const gameState = {
                gamePhase: GamePhase.WESTEROS1,
                westerosCards
            };
            const card: WesterosCard = WesterosCardRules.getNextCard(gameState);
            expect(card).toEqual(expectedCard);
        });
    });


});
