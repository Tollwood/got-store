import { AreaKey } from '../../model/area/areaKey';
import AreaStats from '../../model/area/areaStats';
export declare class AreaStatsService {
    private static areaStatsService;
    private constructor();
    private _areaStats;
    readonly areaStats: Map<AreaKey, AreaStats>;
    static getInstance(): AreaStatsService;
}
