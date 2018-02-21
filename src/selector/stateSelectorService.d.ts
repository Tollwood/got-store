import Area from '../model/area/area';
import { AreaKey } from '../model/area/areaKey';
import Player from '../model/player/player';
import { House } from '../model/player/house';
import { GameStoreState } from '../gameStoreState';
import { OrderTokenType } from '../model/orderToken/orderTokenType';
export default class StateSelectorService {
    private static SUPPLY_VS_ARMY_SIZE;
    static RAID_ORDER_TOKENS: OrderTokenType[];
    static MARCH_ORDER_TOKENS: OrderTokenType[];
    static DEFEND_ORDER_TOKENS: OrderTokenType[];
    static SUPPORT_ORDER_TOKENS: OrderTokenType[];
    static CONSOLIDATE_POWER_ORDER_TOKENS: OrderTokenType[];
    static getFirstFromIronThroneSuccession(state: GameStoreState): House;
    static getAreaByKey(state: GameStoreState, areaKey: AreaKey): Area;
    static getPlayerByHouse(state: GameStoreState, house: House): Player;
    static getAllAreasAllowedToMarchTo(state: GameStoreState, sourceArea: Area): AreaKey[];
    static calculateAllowedMaxSizeBasedOnSupply(state: GameStoreState, house: House): number;
    static enoughSupplyForArmySize(state: GameStoreState, source: Area, target: Area): boolean;
    static getAreasAllowedToRecruit(state: GameStoreState, house: House): Array<Area>;
    private static getValidAreas(state, sourceArea, areasToCheck);
    static calculateArmiesBySizeForHouse(areas: Area[], house: House): Array<number>;
    private static isAllowedToMove(state, source, targetKey);
    static isAllowedToPlaceOrderToken(state: GameStoreState, house: House, areaKey: AreaKey): boolean;
    static getPlacableOrderTokenTypes(state: GameStoreState, house: House): Array<OrderTokenType>;
    static isAllowedToRaid(sourceArea: Area, targetArea: Area): boolean;
    static isConnectedArea(source: Area, target: Area): boolean;
}
