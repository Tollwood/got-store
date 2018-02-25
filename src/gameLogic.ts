import {Store} from 'redux';
import {State} from './state';
import {ActionTypes} from './actions/actions';

class GameLogic {
    private store: Store<State>;

    constructor(store: Store<State>) {
        this.store = store;
    }

    public execute(action: ActionTypes) {
        this.store.dispatch(action);
    }

    public getState(): State {
        return this.store.getState();
    }

    public subscribe(listener) {
        this.store.subscribe(listener)
    }
}

export {GameLogic}