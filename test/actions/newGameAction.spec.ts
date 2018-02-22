import {ActionFactory} from '../../src/ActionFactory';
import PlayerSetup from '../../src/model/player/playerSetup';
import {House} from '../../src/model/player/house';
import {GameStoreFactory} from '../../src/reducer';
import {GamePhase} from '../../src/model/gamePhase';


describe('newGameAction', () => {

    it('should remove orderToken and switch to Next Player', () => {

        const playerSetup = [new PlayerSetup(House.stark, false), new PlayerSetup(House.lannister, true), new PlayerSetup(House.baratheon, true), new PlayerSetup(House.greyjoy, true), new PlayerSetup(House.tyrell, true), new PlayerSetup(House.martell, true)];
        const store = GameStoreFactory.create();
        store.dispatch(ActionFactory.newGame(playerSetup));

        const state = store.getState();
        expect(state.areas.size).toEqual(18);
        expect(state.gameRound).toEqual(1);
        expect(state.gamePhase).toEqual(GamePhase.WESTEROS1);
        expect(state.winningHouse).toBeNull();
        expect(state.currentWesterosCard).not.toBeNull();
        expect(state.wildlingsCount).toBe(0);
    });
});

