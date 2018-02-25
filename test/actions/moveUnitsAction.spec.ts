import {AreaBuilder} from '../areaBuilder';
import {Unit} from '../../src/model/units/units';
import {UnitType} from '../../src/model/units/unitType';
import {House} from '../../src/model/player/house';
import {AreaKey} from '../../src/model/area/areaKey';
import {OrderTokenType} from '../../src/model/orderToken/orderTokenType';
import {Area} from '../../src/model/area/area';
import {Player} from '../../src/model/player/player';
import {GameLogicFactory} from '../../src/gameLogicFactory';
import {ActionFactory} from '../../src/actionFactory';
import {GamePhase} from '../../src/model/gamePhase';


describe('moveUnitsAction', () => {
    const playerLannister = new Player(House.lannister, 0);
    const playerStark = new Player(House.stark, 1);
    let gameLogic;
    beforeEach(()=>{
         gameLogic = GameLogicFactory.create([]);
    });
    it('should move the units and establish control in targetArea, aswell as moving on to the next player', () => {
        // given
        const horseUnit = new Unit(UnitType.Horse, House.stark);
        const footmanUnit1 = new Unit(UnitType.Footman, House.stark);
        const footmanUnit2 = new Unit(UnitType.Footman, House.stark);
        const sourceArea = new AreaBuilder(AreaKey.Winterfell).withHouse(House.stark).withOrderToken(OrderTokenType.march_special).build();
        sourceArea.units = [horseUnit, footmanUnit1, footmanUnit2];
        const targetArea = new AreaBuilder(AreaKey.WhiteHarbor).build();
        const karlhold = new AreaBuilder(AreaKey.Karhold)
            .withOrderToken(OrderTokenType.march_special)
            .withHouse(House.lannister)
            .withUnits([UnitType.Horse]).build();
        const areas = new Map<AreaKey, Area>();
        areas.set(AreaKey.Winterfell, sourceArea);
        areas.set(AreaKey.WhiteHarbor, targetArea);
        areas.set(AreaKey.Karhold, karlhold);
        const unitsToMove = [footmanUnit1, horseUnit];
        const completeOrder = false;
        const establishControl = false;
        let gameStoreState = {
            ironThroneSuccession: [playerLannister.house, playerStark.house],
            players: [playerStark, playerLannister],
            currentHouse: House.stark,
            areas: areas,
            gamePhase: GamePhase.ACTION_MARCH
        };
        gameLogic.execute(ActionFactory.loadGame(gameStoreState));

        // when
        gameLogic.execute(ActionFactory.moveUnits(sourceArea.key, targetArea.key, unitsToMove, completeOrder, establishControl));
        const actual = gameLogic.getState().areas;

        // then
        expect(actual).not.toBe(areas);

        expect(actual.get(targetArea.key).units).toEqual(unitsToMove);
        expect(actual.get(targetArea.key).controllingHouse).toBe(House.stark);
        expect(actual.get(sourceArea.key).units).toEqual([footmanUnit2]);
        expect(actual.get(sourceArea.key).controllingHouse).toBe(House.stark);
        expect(actual.get(sourceArea.key).orderToken).toBeDefined();
        expect(actual.get(sourceArea.key).orderToken.getType()).toBeDefined(OrderTokenType.march_special);
        expect(gameLogic.getState().gamePhase).toBe(GamePhase.ACTION_MARCH);
        expect(gameLogic.getState().currentHouse).toBe(House.lannister);
    });
    it('should set controllingHouse to null if all units leave source area', () => {
        // given
        const horseUnit = new Unit(UnitType.Horse, House.stark);
        const horseUnit1 = new Unit(UnitType.Horse, House.stark);
        const sourceArea = new AreaBuilder(AreaKey.Winterfell).withHouse(House.stark).withOrderToken(OrderTokenType.march_special).build();
        sourceArea.units = [horseUnit, horseUnit1];
        const targetArea = new AreaBuilder(AreaKey.WhiteHarbor).build();
        const areas = new Map<AreaKey, Area>();
        areas.set(AreaKey.Winterfell, sourceArea);
        areas.set(AreaKey.WhiteHarbor, targetArea);
        const unitsToMove = [horseUnit, horseUnit1];
        const completeOrder = false;
        const establishControl = false;
        let gameStoreState = {
            ironThroneSuccession: [playerLannister.house, playerStark.house],
            players: [playerStark, playerLannister],
            currentHouse: House.stark,
            areas: areas
        };
        gameLogic.execute(ActionFactory.loadGame(gameStoreState));

        // when
        gameLogic.execute(ActionFactory.moveUnits(sourceArea.key, targetArea.key, unitsToMove, completeOrder, establishControl));
        const actual = gameLogic.getState().areas;
        // then
        const actualSource = actual.get(sourceArea.key);
        expect(actualSource).toBe(undefined);
    });
    it('should set the orderToken to null incase order is complete', () => {
        // given
        const horseUnit = new Unit(UnitType.Horse, House.stark);
        const horseUnit1 = new Unit(UnitType.Horse, House.stark);
        const sourceArea = new AreaBuilder(AreaKey.Winterfell).withHouse(House.stark).withOrderToken(OrderTokenType.march_special).build();
        sourceArea.units = [horseUnit, horseUnit1];
        const targetArea = new AreaBuilder(AreaKey.WhiteHarbor).build();
        const areas = new Map<AreaKey, Area>();
        areas.set(AreaKey.Winterfell, sourceArea);
        areas.set(AreaKey.WhiteHarbor, targetArea);
        const unitsToMove = [horseUnit];
        let gameStoreState = {
            ironThroneSuccession: [playerLannister.house, playerStark.house],
            players: [playerStark, playerLannister],
            currentHouse: House.stark,
            areas: areas
        };
        gameLogic.execute(ActionFactory.loadGame(gameStoreState));

        // when
        gameLogic.execute(ActionFactory.moveUnits(sourceArea.key, targetArea.key, unitsToMove));
        const actual = gameLogic.getState().areas;
        // then
        expect(actual.get(sourceArea.key).orderToken).toBeNull();
    });
    it('should establish control if order is complete and establishControl is true', () => {
        // given
        const horseUnit = new Unit(UnitType.Horse, House.stark);
        const sourceArea = new AreaBuilder(AreaKey.Winterfell).withHouse(House.stark).withOrderToken(OrderTokenType.march_special).build();
        sourceArea.units = [horseUnit];
        const targetArea = new AreaBuilder(AreaKey.WhiteHarbor).build();
        const areas = new Map<AreaKey, Area>();
        areas.set(AreaKey.Winterfell, sourceArea);
        areas.set(AreaKey.WhiteHarbor, targetArea);
        const unitsToMove = [horseUnit];
        const completeOrder = true;
        const establishControl = true;
        let gameStoreState = {
            ironThroneSuccession: [playerLannister.house, playerStark.house],
            players: [playerStark, playerLannister],
            currentHouse: House.stark,
            areas: areas
        };
        gameLogic.execute(ActionFactory.loadGame(gameStoreState));

        // when
        gameLogic.execute(ActionFactory.moveUnits(sourceArea.key, targetArea.key, unitsToMove, completeOrder, establishControl));
        const actual = gameLogic.getState();

        // then
        expect(actual.areas.get(sourceArea.key).controllingHouse).toBe(House.stark);
        expect(gameLogic.getState().players.filter(player => player.house === House.stark)[0].powerToken).toBe(0);
    });
    it('should return the house that has exactly 7 strongholds/ castle', () => {
        let winterfell = new AreaBuilder(AreaKey.Winterfell).withHouse(House.stark).build();
        let whiteHarbor = new AreaBuilder(AreaKey.WhiteHarbor).withHouse(House.stark).build();
        let flintsFinger = new AreaBuilder(AreaKey.FlintsFinger).withHouse(House.stark).build();
        let pyke = new AreaBuilder(AreaKey.Pyke).withHouse(House.stark).build();
        let moatCailin = new AreaBuilder(AreaKey.MoatCailin).withHouse(House.stark).build();
        let seagard = new AreaBuilder(AreaKey.Seagard).withHouse(House.stark).build();
        let widowsWatch = new AreaBuilder(AreaKey.WidowsWatch)
            .withHouse(House.stark)
            .withUnits([UnitType.Footman, UnitType.Footman])
            .withOrderToken(OrderTokenType.march_zero)
            .build();
        let theEyrie = new AreaBuilder(AreaKey.TheEyrie).build();
        const areas = new Map<AreaKey, Area>();
        areas.set(AreaKey.Winterfell, winterfell);
        areas.set(AreaKey.WhiteHarbor, whiteHarbor);
        areas.set(AreaKey.FlintsFinger, flintsFinger);
        areas.set(AreaKey.Pyke, pyke);
        areas.set(AreaKey.MoatCailin, moatCailin);
        areas.set(AreaKey.Seagard, seagard);
        areas.set(AreaKey.WidowsWatch, widowsWatch);
        areas.set(AreaKey.TheEyrie, theEyrie);
        let gameStoreState = {
            winningHouse: null,
            ironThroneSuccession: [House.stark, House.lannister],
            areas: areas,
            players: [new Player(House.lannister, 0), new Player(House.stark, 0)],
            currentHouse: House.stark
        };
        gameLogic.execute(ActionFactory.loadGame(gameStoreState));
        gameLogic.execute(ActionFactory.moveUnits(AreaKey.WidowsWatch, AreaKey.TheEyrie, [new Unit(UnitType.Footman, House.stark)], true, true));
        const newState = gameLogic.getState();
        expect(newState.winningHouse).toBe(House.stark);
    });

});
