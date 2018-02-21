import AreaBuilder from '../../areaBuilder';
import {House} from '../../../src/model/player/house';
import {AreaKey} from '../../../src/model/area/areaKey';
import RecruitingStateModificationService from '../../../src/logic/gameState/recruitingStateModificationService';
import Area from '../../../src/model/area/area';
import StateSelectorService from '../../../src/selector/stateSelectorService';


describe('RecruitingStateModificationService', () => {
    describe('calculateAreasAllowedToRecruit', () => {
        it('should set all areas controlled by a  house that has a stronghold and enough supply', () => {
            // given
            const winterfell = new AreaBuilder(AreaKey.Winterfell).withHouse(House.stark).build();
            const theStonyShore = new AreaBuilder(AreaKey.TheStonyShore).withHouse(House.stark).build();
            const areas = new Map<AreaKey, Area>();
            areas.set(AreaKey.TheStonyShore, theStonyShore);
            areas.set(AreaKey.Winterfell, winterfell);
            let state = {areas: areas, currentHouse: House.stark};

            spyOn(StateSelectorService, 'calculateAllowedMaxSizeBasedOnSupply').and.returnValue(10);
            // when
            const actual = RecruitingStateModificationService.calculateAreasAllowedToRecruit(state);

            // then
            expect(actual.length).toBe(1);
            expect(actual[0]).toEqual(AreaKey.Winterfell);
            expect(StateSelectorService.calculateAllowedMaxSizeBasedOnSupply).toHaveBeenCalledWith(state, state.currentHouse);
        });
    });
});
