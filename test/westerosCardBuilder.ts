import {WesterosCard} from '../src/model/cards/westerosCard';
import {GamePhase} from '../src/model/gamePhase';
import {CardFunction} from '../src/model/cards/cardFunction';

class WesterosCardBuilder {
    private _gamePhase: GamePhase;
    private _wildling: number;
    private _selectedFunction: CardFunction;

    public gamePhase(gamePhase: GamePhase): WesterosCardBuilder {
        this._gamePhase = gamePhase;
        return this;
    }

    public selectedFunction(selectedFunction: CardFunction): WesterosCardBuilder {
        this._selectedFunction = selectedFunction;
        return this;
    }

    public wildling(wildling: number): WesterosCardBuilder {
        this._wildling = wildling;
        return this;
    }

    public build(): WesterosCard {
        const card: WesterosCard = new WesterosCard(null, null, null, null, this._gamePhase, this._wildling, null);
        card.selectedFunction = this._selectedFunction;
        return card;

    }
}

export {WesterosCardBuilder}