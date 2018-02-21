import { House } from '../../model/player/house';
import { GameStoreState } from '../../gameStoreState';
export default class SupplyStateModificationService {
    static updateSupply(state: GameStoreState): Map<House, number>;
    private static calculateNumberOfSupply(areas, house);
}
