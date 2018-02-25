import PlayerSetup from './model/player/playerSetup';
import {GameStoreState} from './state';
import AiCalculator from './ai/aiCalculator';
import {ActionFactory} from './ActionFactory';
import {createStore, Store} from 'redux';
import {gameStateReducer} from './reducer/reducer';

export default class GameStoreFactory {
    static create( playerSetup: PlayerSetup[], isDebugEnabled?:boolean): Store<GameStoreState> {
        const store =  createStore(gameStateReducer,{isDebugEnabled});
        playerSetup.forEach((playerSetup) => {
            if (playerSetup.ai) {
                store.subscribe(() => {
                    AiCalculator.recruit(store, playerSetup.house);
                    AiCalculator.placeAllOrderTokens(store, playerSetup.house);
                    AiCalculator.executeOrder(store, playerSetup.house);
                });
            }
        });

        store.dispatch(ActionFactory.newGame(playerSetup));
        return store;
    }
}
