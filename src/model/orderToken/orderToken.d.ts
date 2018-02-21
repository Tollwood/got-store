import { House } from '../player/house';
import { OrderTokenType } from './orderTokenType';
export declare class OrderToken {
    private house;
    private type;
    private _value;
    constructor(house: House, type: OrderTokenType);
    getHouse(): House;
    getType(): OrderTokenType;
    readonly value: number;
    isMoveToken(): boolean;
    isConsolidatePowerToken(): boolean;
    isRaidToken(): boolean;
    isDefendToken(): boolean;
    private static getValue(type);
}
