import { AreaKey } from '../../model/area/areaKey';
import { GameStoreState } from '../../gameStoreState';
export default class RecruitingStateModificationService {
    static calculateAreasAllowedToRecruit(state: GameStoreState): AreaKey[];
    static updateAreasAllowedToRecruit(areasAllowedToRecruit: AreaKey[], areaKey: AreaKey): AreaKey[];
}
