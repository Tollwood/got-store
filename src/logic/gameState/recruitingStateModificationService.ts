import {AreaKey} from '../../model/area/areaKey';
import { StateSelectorService} from '../../selector/stateSelectorService';
import {State} from '../../state';
import {AreaStatsService} from '../area/areaStatsService';

class RecruitingStateModificationService {

    public static calculateAreasAllowedToRecruit(state: State): AreaKey[] {
        return Array.from(state.areas.values()).filter((area) => {
            return area.controllingHouse !== null
                && AreaStatsService.getInstance().areaStats.get(area.key).hasCastleOrStronghold()
                && StateSelectorService.calculateAllowedMaxSizeBasedOnSupply(state, area.controllingHouse) > area.units.length;
        }).map(area => area.key);
    }


    public static updateAreasAllowedToRecruit(areasAllowedToRecruit: AreaKey[], areaKey: AreaKey): AreaKey[] {
        let newAreasAllowedToRecruit = areasAllowedToRecruit.slice();
        let index = newAreasAllowedToRecruit.indexOf(areaKey);
        newAreasAllowedToRecruit.splice(index, 1);
        return newAreasAllowedToRecruit;
    }
}

export {RecruitingStateModificationService}