import { House } from './house';
export default class Player {
    private _house;
    private _powerToken;
    constructor(house: House, powerToken: number);
    powerToken: number;
    readonly house: House;
    copy(): Player;
}
