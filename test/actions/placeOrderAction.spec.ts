import AreaBuilder from '../areaBuilder';
import {UnitType} from '../../src/model/units/unitType';
import {House} from '../../src/model/player/house';
import {AreaKey} from '../../src/model/area/areaKey';
import {OrderTokenType} from '../../src/model/orderToken/orderTokenType';

import Area from '../../src/model/area/area';
import {GameStoreFactory} from '../../src/reducer';
import {ActionFactory} from '../../src/ActionFactory';
import {OrderToken} from '../../src/model/orderToken/orderToken';
import {GamePhase} from '../../src/model/gamePhase';

describe('placeOrderAction', () => {

    let store;
    beforeEach(()=>{
        store = GameStoreFactory.create();
    });
    
    it('should place an orderToken', () => {
        // given
        const areas = new Map<AreaKey, Area>();
        const sourceArea = new AreaBuilder(AreaKey.Winterfell).withHouse(House.stark).withUnits([UnitType.Footman]).build();
        const secondArea = new AreaBuilder(AreaKey.WhiteHarbor).withHouse(House.stark).withUnits([UnitType.Footman]).build();
        areas.set(sourceArea.key, sourceArea);
        areas.set(secondArea.key, secondArea);
        let gameStoreState = {
            areas: areas,
            ironThroneSuccession: [House.stark]
        };
        store.dispatch(ActionFactory.loadGame(gameStoreState));

        // when
        store.dispatch(ActionFactory.placeOrder(sourceArea.key, new OrderToken(House.stark, OrderTokenType.defend_0)));
        const newState = store.getState();

        // then
        expect(newState).not.toBe(gameStoreState);
        const orderToken = newState.areas.get(sourceArea.key).orderToken;
        expect(orderToken).toBeDefined();
        expect(orderToken.getHouse()).toBe(House.stark);
        expect(orderToken.getType()).toBe(OrderTokenType.defend_0);
        expect(newState.currentHouse).toBe(House.stark);

    });

    it('should place an orderToken and switch to next phase if all tokens are placed', () => {
        // given
        const areas = new Map<AreaKey, Area>();
        const sourceArea = new AreaBuilder(AreaKey.Winterfell).withHouse(House.stark).withUnits([UnitType.Footman]).build();
        const secondArea = new AreaBuilder(AreaKey.WhiteHarbor).withHouse(House.stark).withUnits([UnitType.Footman]).withOrderToken(OrderTokenType.march_zero).build();
        areas.set(sourceArea.key, sourceArea);
        areas.set(secondArea.key, secondArea);
        let gameStoreState = {
            ironThroneSuccession: [House.lannister, House.stark],
            gamePhase: GamePhase.PLANNING,
            areas: areas
        };
        store.dispatch(ActionFactory.loadGame(gameStoreState));

        // when
        store.dispatch(ActionFactory.placeOrder(sourceArea.key, new OrderToken(House.stark, OrderTokenType.raid_0)));
        const newState = store.getState();
        // then
        expect(newState).not.toBe(gameStoreState);
        const orderToken = newState.areas.get(sourceArea.key).orderToken;
        expect(orderToken).toBeDefined();
        expect(orderToken.getHouse()).toBe(House.stark);
        expect(orderToken.getType()).toBe(OrderTokenType.raid_0);
        expect(newState.gamePhase).toBe(GamePhase.ACTION_RAID);
        expect(newState.currentHouse).toBe(House.lannister);
    });
});
