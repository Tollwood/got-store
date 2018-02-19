import AreaBuilder from '../areaBuilder';
import {AreaKey} from '../../src/model/area/areaKey';
import {gameStore} from '../../src/reducer';
import {loadGame, skipOrder} from '../../src/actions';
import {Area} from '../../src/model/area/area';
import {OrderTokenType} from '../../src/model/orderToken/orderTokenType';
import {House} from '../../src/model/player/house';
import AreaModificationService from '../../src/logic/gameState/areaStateModificationService';
import Player from '../../src/model/player/player';


describe('skipOrder', () => {
    it('should remove orderToken and switch to Next Player', () => {

        const area = new AreaBuilder(AreaKey.Winterfell).withOrderToken(OrderTokenType.consolidatePower_0).withHouse(House.stark).build();
        const areas = new Map<AreaKey, Area>();
        areas.set(AreaKey.Winterfell, area);
        let gameStoreState = {
            areas: areas,
            ironThroneSuccession: [House.stark],
            players: [new Player(House.stark, 5)]
        };
        gameStore.dispatch(loadGame(gameStoreState));
        spyOn(AreaModificationService, 'removeOrderToken').and.returnValue(areas);
        gameStore.dispatch(skipOrder(AreaKey.Winterfell));

        const newAreas = gameStore.getState().areas;
        expect(newAreas).toEqual(areas);
        expect(AreaModificationService.removeOrderToken).toHaveBeenCalled();
    });
});

