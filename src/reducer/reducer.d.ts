import { Store } from 'redux';
import { State } from '../state';
declare class GameFactory {
    static create(): Store<State>;
}
export { GameFactory };
