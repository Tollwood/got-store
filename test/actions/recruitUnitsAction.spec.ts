import {AreaBuilder} from '../areaBuilder';
import {UnitType} from '../../src/model/units/unitType';
import {House} from '../../src/model/player/house';
import {AreaKey} from '../../src/model/area/areaKey';
import {OrderTokenType} from '../../src/model/orderToken/orderTokenType';
import {Area} from '../../src/model/area/area';
import {GameFactory} from '../../src/gameFactory';
import {ActionFactory} from '../../src/actionFactory';
import {State} from '../../src/state';


describe('recruitUnitsAction', () => {

    let store;
    beforeEach(()=>{
        store = GameFactory.create([]);
    });
    it('should skip recruiting if no units are provided', () => {
        // given
        const ironThroneSuccession = [House.stark, House.lannister];
        const areasAllowedToRecruit = [AreaKey.Winterfell, AreaKey.WhiteHarbor];
        const areas = new Map<AreaKey, Area>();
        const currentHouse = House.stark;
        areas.set(AreaKey.Winterfell, new AreaBuilder(AreaKey.Winterfell).withHouse(House.stark).withUnits([UnitType.Horse]).withOrderToken(OrderTokenType.consolidatePower_special).build());
        areas.set(AreaKey.WhiteHarbor, new AreaBuilder(AreaKey.WhiteHarbor).withUnits([UnitType.Horse]).build());
        const currentlyAllowedSupply = new Map<House, number>();
        currentlyAllowedSupply.set(House.stark, 0);
        currentlyAllowedSupply.set(House.lannister, 0);
        const initialState: State = {
            ironThroneSuccession,
            areas,
            areasAllowedToRecruit,
            currentHouse,
            currentlyAllowedSupply
        };
        store.execute(ActionFactory.loadGame(initialState));
        // when
        store.execute(ActionFactory.recruitUnits(AreaKey.Winterfell));

        // then
        const newState = store.getState();
        expect(newState).not.toBe(initialState);
        expect(newState.areas).not.toBe(initialState.areas);
        expect(newState.areas.get(AreaKey.Winterfell).orderToken).toBeNull();
        expect(newState.areas.get(AreaKey.Winterfell).units.length).toBe(1);
        expect(newState.areasAllowedToRecruit).not.toBe(initialState.areasAllowedToRecruit);
        expect(newState.areasAllowedToRecruit.lastIndexOf(AreaKey.Winterfell)).toBe(-1);
    });

    it('should add units provide by action to the area', () => {

        // given
        const ironThroneSuccession = [House.stark, House.lannister];
        const areasAllowedToRecruit = [AreaKey.Winterfell, AreaKey.WhiteHarbor];
        const currentlyAllowedSupply = new Map<House, number>();
        currentlyAllowedSupply.set(House.stark, 5);
        currentlyAllowedSupply.set(House.lannister, 5);
        const areas = new Map<AreaKey, Area>();
        const currentHouse = House.stark;
        areas.set(AreaKey.Winterfell, new AreaBuilder(AreaKey.Winterfell).withHouse(House.stark).withUnits([UnitType.Horse]).withOrderToken(OrderTokenType.consolidatePower_special).build());
        areas.set(AreaKey.WhiteHarbor, new AreaBuilder(AreaKey.WhiteHarbor).withUnits([UnitType.Horse]).build());
        const initialState: State = {
            ironThroneSuccession,
            areas,
            areasAllowedToRecruit,
            currentHouse,
            currentlyAllowedSupply
        };
        store.execute(ActionFactory.loadGame(initialState));
        // when
        store.execute(ActionFactory.recruitUnits(AreaKey.Winterfell, [UnitType.Footman, UnitType.Siege]));

        // then
        const newState = store.getState();
        expect(newState).not.toBe(initialState);
        expect(newState.areas).not.toBe(initialState.areas);
        expect(newState.areas.get(AreaKey.Winterfell).orderToken).toBeNull();
        expect(newState.areas.get(AreaKey.Winterfell).units.length).toBe(3);
        expect(newState.areasAllowedToRecruit).not.toBe(initialState.areasAllowedToRecruit);
        expect(newState.areasAllowedToRecruit.lastIndexOf(AreaKey.Winterfell)).toBe(-1);

    });

});
