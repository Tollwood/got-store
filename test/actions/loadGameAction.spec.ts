import {ActionFactory} from '../../src/ActionFactory';
import PlayerSetup from '../../src/model/player/playerSetup';
import {House} from '../../src/model/player/house';
import {GameStoreFactory} from '../../src/reducer';
import {GamePhase} from '../../src/model/gamePhase';


describe('loadGameAction', () => {

    it('should preserve isDegugEnabeled value', () => {

        const isDegugEnabeled: boolean = true;
        const store = GameStoreFactory.create(isDegugEnabeled);

        const loadState = {
            gamePhase: GamePhase.PLANNING,
            gameRound: 0
        };
        store.dispatch(ActionFactory.loadGame(loadState));

        const state = store.getState();
        expect(state.gameRound).toBe(0);
        expect(state.gamePhase).toBe(GamePhase.PLANNING);
        expect(state.isDegugEnabled).toBe(true);
    });
});

