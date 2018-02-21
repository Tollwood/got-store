import Area from '../model/area/area';
import {AreaKey} from '../model/area/areaKey';
import Player from '../model/player/player';
import {House} from '../model/player/house';
import {GameStoreState} from '../gameStoreState';
import {AreaStatsService} from '../logic/area/areaStatsService';
import {OrderTokenType} from '../model/orderToken/orderTokenType';

export default class StateSelectorService {

  private static SUPPLY_VS_ARMY_SIZE = [[2, 2], [3, 2], [3, 2, 2], [3, 2, 2, 2], [3, 3, 2, 2], [4, 3, 2, 2], [4, 3, 2, 2, 2]];
  public static RAID_ORDER_TOKENS = [OrderTokenType.raid_0, OrderTokenType.raid_1, OrderTokenType.raid_special];
  public static MARCH_ORDER_TOKENS = [OrderTokenType.march_minusOne, OrderTokenType.march_zero, OrderTokenType.march_special];
  public static DEFEND_ORDER_TOKENS = [OrderTokenType.defend_0, OrderTokenType.defend_1, OrderTokenType.defend_special];
  public static SUPPORT_ORDER_TOKENS = [OrderTokenType.support_0, OrderTokenType.support_1, OrderTokenType.support_special];
  public static CONSOLIDATE_POWER_ORDER_TOKENS = [OrderTokenType.consolidatePower_0, OrderTokenType.consolidatePower_1, OrderTokenType.consolidatePower_special];



  public static getFirstFromIronThroneSuccession(state: GameStoreState): House {
    return state.ironThroneSuccession[0];
  }

  public static getAreaByKey(state: GameStoreState, areaKey: AreaKey): Area {
    const area = state.areas.get(areaKey);
    return area ? area : null;
  }

  public static getPlayerByHouse(state: GameStoreState,house: House): Player {
    return state.players.find(player => player.house === house);
  }

  // move related

  public static getAllAreasAllowedToMarchTo(state: GameStoreState, sourceArea: Area): AreaKey[] {
    if (sourceArea.units.length === 0) {
      return [];
    }
    const sourceAreaStats = AreaStatsService.getInstance().areaStats.get(sourceArea.key);
    return this.getValidAreas(state, sourceArea, sourceAreaStats.borders);
  }

  public static calculateAllowedMaxSizeBasedOnSupply(state: GameStoreState, house: House): number {
    const areas: Area[] = Array.from(state.areas.values());
    const supplyScore = state.currentlyAllowedSupply.get(house);
    const armiesForHouse: Array<number> = this.calculateArmiesBySizeForHouse(areas, house);
    const maxSize = 0;
    const allowedArmies = this.SUPPLY_VS_ARMY_SIZE[supplyScore];
    let index = 0;

    for (const largestPossibleSize of allowedArmies) {
      const armySize: number = armiesForHouse[index];
      if (armySize === undefined || armySize < largestPossibleSize) {
        return largestPossibleSize;
      }
      index++;
    }
    return maxSize;
  }

  public static enoughSupplyForArmySize(state: GameStoreState, source: Area, target: Area): boolean {
    const targetArmySize = target === undefined ? 0 : target.units.length;
    const oneUnitCanMove = targetArmySize + 1 <= this.calculateAllowedMaxSizeBasedOnSupply(state, state.currentHouse);
    return target === undefined
      || target.controllingHouse !== source.controllingHouse
      || (target.controllingHouse === source.controllingHouse && oneUnitCanMove);
  }


  // recruiting related

  public static getAreasAllowedToRecruit(state: GameStoreState, house: House): Array<Area> {
    return state.areasAllowedToRecruit.filter((areaKey: AreaKey) => {
      const area = state.areas.get(areaKey);
      if (area.controllingHouse !== house) {
        return false;
      }

      const maxArmySize = StateSelectorService.calculateAllowedMaxSizeBasedOnSupply(state, house);
      return area.units.length < maxArmySize;
    }).map(areaKey => state.areas.get(areaKey));
  }

  // Supply related

  private static getValidAreas(state: GameStoreState, sourceArea: Area, areasToCheck: AreaKey[]) {
    let validAreas: AreaKey[] = [];
    areasToCheck
      .forEach((areaKey) => {
        if (this.isAllowedToMove(state, sourceArea, areaKey)) {
          validAreas.push(areaKey);
        }
        const sourceAreaStats = AreaStatsService.getInstance().areaStats.get(sourceArea.key);
        const areaStats = AreaStatsService.getInstance().areaStats.get(areaKey);
        const area = state.areas.get(areaKey);
        if (sourceAreaStats.isLandArea
          && !areaStats.isLandArea
          && (area !== undefined && (area.units.length > 0 && area.controllingHouse === sourceArea.controllingHouse))) {
          validAreas = validAreas.concat(this.getValidAreas(state, sourceArea, areaStats.borders));
        }
      });
    // TODO Filter duplicates
    return validAreas;
  }

  public static calculateArmiesBySizeForHouse(areas: Area[], house: House): Array<number> {
    return areas.filter((area) => {
      // an army of one unit does not count as an army
      return area.controllingHouse === house && area.units.length > 1;
    }).map((area) => {
      return area.units.length;
    }).sort((a, b) => {
      return b - a;
    });
  }

  private static isAllowedToMove(state: GameStoreState, source: Area, targetKey: AreaKey): boolean {
    const sourceAreaStats = AreaStatsService.getInstance().areaStats.get(source.key);
    const targetAreaStats = AreaStatsService.getInstance().areaStats.get(targetKey);
    const landToLandMove = sourceAreaStats.isLandArea && targetAreaStats.isLandArea;
    const seaToSeaMove = !sourceAreaStats.isLandArea && !targetAreaStats.isLandArea;
    const enoughSupplyForArmySize = this.enoughSupplyForArmySize(state, source, state.areas.get(targetKey));

    return (landToLandMove || seaToSeaMove) && enoughSupplyForArmySize;
  }

  // token placement related

  public static isAllowedToPlaceOrderToken(state: GameStoreState, house: House, areaKey: AreaKey): boolean {
    const area: Area = StateSelectorService.getAreaByKey(state, areaKey);
    return area !== null && area.units.length > 0
      && area.controllingHouse === house
      && area.orderToken === null;
  }

  public static getPlacableOrderTokenTypes(state: GameStoreState, house: House): Array<OrderTokenType> {
    let alreadyPlacedOrderTokens: Array<OrderTokenType> = Array.from(state.areas.values()).filter((area) => {
      return area.orderToken && area.controllingHouse === house;
    }).map((area) => {
      return area.orderToken.getType();
    });

    return state.currentlyAllowedTokenTypes.filter((type) => {
      return alreadyPlacedOrderTokens.indexOf(type) === -1;
    });
  }

  public static isAllowedToRaid(sourceArea: Area, targetArea: Area): boolean {
    const sourceAreaStats = AreaStatsService.getInstance().areaStats.get(sourceArea.key);
    const targetAreaStats = AreaStatsService.getInstance().areaStats.get(targetArea.key);
    return this.isConnectedArea(sourceArea, targetArea) && targetArea.controllingHouse !== null
      && sourceArea.controllingHouse !== targetArea.controllingHouse
      && (sourceAreaStats.isLandArea && targetAreaStats.isLandArea || !sourceAreaStats.isLandArea);
  }

  public static isConnectedArea(source: Area, target: Area): boolean {
    return AreaStatsService.getInstance().areaStats.get(source.key).borders.filter((areaKey) => {
      return areaKey === target.key;
    }).length === 1;
  }
}
