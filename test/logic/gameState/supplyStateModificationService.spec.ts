import {House} from '../../../src/model/player/house';
import SupplyStateModificationService from '../../../src/logic/gameState/supplyStateModificationService';
import Player from '../../../src/model/player/player';
import AreaBuilder from '../../areaBuilder';
import {AreaKey} from '../../../src/model/area/areaKey';

import {Area} from '../../../src/model/area/area';
import StateSelectorService from '../../../src/selector/stateSelectorService';

describe('SupplyStateModificationService', () => {


    it('should return empty array for house with no army', () => {
        // given
        const karhold = new AreaBuilder(AreaKey.Karhold).withHouse(House.stark).build();
        const areas = new Map<AreaKey, Area>();
        areas.set(AreaKey.Karhold, karhold);
        let state = {players: [new Player(House.stark, 5)], areas: areas};
        SupplyStateModificationService.updateSupply(state);

        expect(StateSelectorService.calculateArmiesBySizeForHouse(Array.from(state.areas.values()), House.stark)).toEqual([]);
    });

});
