import {House} from '../../model/player/house';
import {Area } from '../../model/area/area';
import {State} from '../../state';
import {AreaStatsService} from '../area/areaStatsService';

class SupplyStateModificationService {

    public static updateSupply(state: State): Map<House, number> {
        let updatedSupply = new Map<House, number>();
        state.players.forEach((player) => {
            updatedSupply.set(player.house, this.calculateNumberOfSupply(Array.from(state.areas.values()), player.house));
        });
        return updatedSupply;
    }

    private static calculateNumberOfSupply(areas: Area[], house: House): number {
        return areas.filter((area: Area) => {
            const areaStats = AreaStatsService.getInstance().areaStats.get(area.key);
            return area.controllingHouse === house && areaStats.supply > 0;
        }).map((area) => {
            const areaStats = AreaStatsService.getInstance().areaStats.get(area.key);
            return areaStats.supply;
        }).reduce(
            (accumulator,
             currentValue) => {
                return accumulator + currentValue;
            }, 0
        );
    }

}

export {SupplyStateModificationService}