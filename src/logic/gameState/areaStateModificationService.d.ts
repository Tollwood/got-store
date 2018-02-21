import Area from '../../model/area/area';
import { AreaKey } from '../../model/area/areaKey';
import { OrderToken } from '../../model/orderToken/orderToken';
import Unit from '../../model/units/units';
import { UnitType } from '../../model/units/unitType';
import { GameStoreState } from '../../gameStoreState';
export default class AreaStateModificationService {
    static recruitUnits(areas: Area[], areaKey: AreaKey, unitTypes: UnitType[]): Map<AreaKey, Area>;
    static removeAllRemainingTokens(areas: Area[]): Map<AreaKey, Area>;
    static addOrderToken(areas: Area[], ordertoken: OrderToken, areaKey: AreaKey): Map<AreaKey, Area>;
    static removeOrderTokens(areas: Area[], areaKeys: AreaKey[]): Map<AreaKey, Area>;
    static removeOrderToken(areas: Area[], areaKey: AreaKey): Map<AreaKey, Area>;
    static moveUnits(areas: Area[], source: AreaKey, target: AreaKey, movingUnits: Array<Unit>, completeOrder?: boolean, establishControl?: boolean): Map<AreaKey, Area>;
    private static updateSourceArea(oldArea, movingUnits, completeOrder, establishControl);
    private static updateTargetArea(oldArea, movingUnits);
    static updateAfterFight(state: GameStoreState, areas: Area[], attackingAreaKey: AreaKey, winningAreaKey: AreaKey, loosingAreaKey: AreaKey, units: Array<Unit>): Map<AreaKey, Area>;
}
