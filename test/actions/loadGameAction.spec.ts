import {ActionFactory} from '../../src/actionFactory';
import {GameFactory} from '../../src/gameFactory';
import {GamePhase} from '../../src/model/gamePhase';


describe('loadGameAction', () => {

    it('should preserve isDegugEnabeled value', () => {

        const isDegugEnabeled: boolean = true;
        const game = GameFactory.create([],isDegugEnabeled);

        const loadState = {
            gamePhase: GamePhase.PLANNING,
            gameRound: 0
        };
        game.execute(ActionFactory.loadGame(loadState));

        const state = game.getState();
        expect(state.gameRound).toBe(0);
        expect(state.gamePhase).toBe(GamePhase.PLANNING);
        expect(state.isDebugEnabled).toBe(true);
    });
});

