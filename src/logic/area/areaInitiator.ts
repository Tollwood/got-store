import {Area} from '../../model/area/area';
import * as areaConfigData from './areaConfig.json';
import * as unitsConfigData from './unitsConfig.json';
import {House} from '../../model/player/house';
import Unit from '../../model/units/units';
import {UnitType} from '../../model/units/unitType';
import {AreaKey} from '../../model/area/areaKey';
import {AreaStats} from '../../model/area/areaStats';

export class AreaInitiator {

    public static getInitalState(playingHouses: Array<House>): Map<AreaKey, Area> {
        let areas: Map<AreaKey, Area> = new Map();
        (<any>unitsConfigData).forEach((jsonConfig) => {
            if (playingHouses.indexOf(House[<string>jsonConfig.controllingHouse]) > -1) {
                const area = this.createArea(jsonConfig);
                areas.set(area.key, area);
            }
        });

        return areas;
    }

    public static getAreaStats(): Map<AreaKey, AreaStats> {
        let areasStats: Map<AreaKey, AreaStats> = new Map();

        (<any>areaConfigData).forEach((jsonConfig) => {
            const areaStats = this.parseAreas(jsonConfig);
            areasStats.set(areaStats.key, areaStats);
        });

        Array.from(areasStats.values()).map(areaStats => {
            this.addBorderAreas(areaStats);
        });
        return areasStats;
    }

    private static parseAreas(json: any): AreaStats {
        return new AreaStats(AreaKey[<string>json.key], json.consolidatePower, json.harbor, json.castle, json.stronghold, json.isLandArea, json.supply);
    }

    private static createArea(json: any) {
        const areaKey: AreaKey = AreaKey[<string>json.key];
        const controllingHouse: House = House[<string>json.controllingHouse];
        const units: Unit[] = [];
        json.units.forEach((unitTypeJson => {
            const unitType: UnitType = UnitType[<string>unitTypeJson];
            const unit = new Unit(unitType, controllingHouse);
            units.push(unit);
        }));
        return new Area(areaKey, controllingHouse, units);
    }

    private static addBorderAreas(areaStats: AreaStats) {
        const jsonConfigArea = (<any>areaConfigData)
            .filter(jsonConfig => {
                return AreaKey[<string>jsonConfig.key] === areaStats.key;
            })[0];
        const borders: AreaKey[] = (<any>jsonConfigArea.borders).map(borderKey => {
            return AreaKey[<string>borderKey];
        });
        areaStats.borders = borders;

    }
}
