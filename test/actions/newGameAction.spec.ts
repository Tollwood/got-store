import {PlayerSetup} from '../../src/model/player/playerSetup';
import {House} from '../../src/model/player/house';
import {GameLogicFactory} from '../../src/gameLogicFactory';
import {GamePhase} from '../../src/model/gamePhase';
import {GameLogic} from '../../src/gameLogic';


describe('newGameAction', () => {

    it('should remove orderToken and switch to Next Player', () => {

        const playerSetup = [new PlayerSetup(House.stark, false), new PlayerSetup(House.lannister, true), new PlayerSetup(House.baratheon, true), new PlayerSetup(House.greyjoy, true), new PlayerSetup(House.tyrell, true), new PlayerSetup(House.martell, true)];
        const isDebugEnabled: boolean = false;
        const game: GameLogic = GameLogicFactory.create(playerSetup,isDebugEnabled);

        const state = game.getState();
        expect(state.areas.size).toEqual(18);
        expect(state.gameRound).toEqual(1);
        expect(state.gamePhase).toEqual(GamePhase.PLANNING);
        expect(state.winningHouse).toBeNull();
        //expect(state.currentWesterosCard).not.toBeNull();
        expect(state.wildlingsCount).toBe(0);
        //expect(state.currentWesterosCardExecuted.length).toBe(0);
    });

    it('should set isDegugEnabeled to true', () => {

        const isDebugEnabled: boolean = true;
        const store = GameLogicFactory.create([],isDebugEnabled);

        const state = store.getState();
        expect(state.isDebugEnabled).toBe(true);
    });
});

