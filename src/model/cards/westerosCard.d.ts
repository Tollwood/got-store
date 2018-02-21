import { GamePhase } from '../gamePhase';
import CardFunction from './cardFunction';
export default class WesterosCard {
    private _id;
    private _title;
    private _description;
    private _artwork;
    constructor(id: number, title: string, description: string, artwork: string, gamePhase: GamePhase, wildling: number, options: Array<CardFunction>);
    private _wildling;
    private _options;
    private _selectedFunction;
    private _gamePhase;
    readonly options: Array<CardFunction>;
    readonly wildling: number;
    readonly gamePhase: GamePhase;
    readonly artwork: string;
    readonly description: string;
    readonly title: string;
    readonly id: number;
    selectedFunction: CardFunction;
}
