import {ActionFactory} from '../../src/ActionFactory';
import GameStoreFactory from '../../src/gameStoreFactory';
import {GamePhase} from '../../src/model/gamePhase';


describe('loadGameAction', () => {

    it('should preserve isDegugEnabeled value', () => {

        const isDegugEnabeled: boolean = true;
        const store = GameStoreFactory.create([],isDegugEnabeled);

        const loadState = {
            gamePhase: GamePhase.PLANNING,
            gameRound: 0
        };
        store.dispatch(ActionFactory.loadGame(loadState));

        const state = store.getState();
        expect(state.gameRound).toBe(0);
        expect(state.gamePhase).toBe(GamePhase.PLANNING);
        expect(state.isDebugEnabled).toBe(true);
    });
});

