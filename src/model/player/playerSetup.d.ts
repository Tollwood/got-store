import { House } from './house';
export default class PlayerSetup {
    private _house;
    private _name;
    private _ai;
    constructor(house: House, ai: boolean, name?: string);
    readonly ai: boolean;
    readonly name: string;
    readonly house: House;
}
