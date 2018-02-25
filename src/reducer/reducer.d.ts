import { Store } from 'redux';
import { GameStoreState } from '../state';
declare class GameStoreFactory {
    static create(): Store<GameStoreState>;
}
export { GameStoreFactory };
