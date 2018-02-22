import AreaBuilder from '../areaBuilder';
import {AreaKey} from '../../src/model/area/areaKey';
import {GameStoreFactory} from '../../src/reducer';
import {ActionFactory} from '../../src/ActionFactory';import Area from '../../src/model/area/area';
import {OrderTokenType} from '../../src/model/orderToken/orderTokenType';
import {House} from '../../src/model/player/house';
import AreaModificationService from '../../src/logic/gameState/areaStateModificationService';
import Player from '../../src/model/player/player';


describe('skipOrder', () => {
    let store;
    beforeEach(()=>{
        store = GameStoreFactory.create();
    });
    it('should remove orderToken and switch to Next Player', () => {

        const area = new AreaBuilder(AreaKey.Winterfell).withOrderToken(OrderTokenType.consolidatePower_0).withHouse(House.stark).build();
        const areas = new Map<AreaKey, Area>();
        areas.set(AreaKey.Winterfell, area);
        let gameStoreState = {
            areas: areas,
            ironThroneSuccession: [House.stark],
            players: [new Player(House.stark, 5)]
        };
        store.dispatch(ActionFactory.loadGame(gameStoreState));
        spyOn(AreaModificationService, 'removeOrderToken').and.returnValue(areas);
        store.dispatch(ActionFactory.skipOrder(AreaKey.Winterfell));

        const newAreas = store.getState().areas;
        expect(newAreas).toEqual(areas);
        expect(AreaModificationService.removeOrderToken).toHaveBeenCalled();
    });
});

