import { Store } from 'redux';
import { GameStoreState } from './gameStoreState';
declare class GameStoreFactory {
    static create(): Store<GameStoreState>;
}
export { GameStoreFactory };
