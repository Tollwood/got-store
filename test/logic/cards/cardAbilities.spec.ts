import {OrderTokenType} from '../../../src/model/orderToken/orderTokenType';
import {WesterosCard} from '../../../src/model/cards/westerosCard';
import {AreaKey} from '../../../src/model/area/areaKey';
import {House} from '../../../src/model/player/house';
import Player from '../../../src/model/player/player';
import {Area} from '../../../src/model/area/area';
import {UnitType} from '../../../src/model/units/unitType';
import {GamePhase} from '../../../src/model/gamePhase';
import SupplyStateModificationService from '../../../src/logic/gameState/supplyStateModificationService';
import GameStateModificationService from '../../../src/logic/gameState/gameStateModificationService';
import CardAbilities from '../../../src/logic/cards/cardAbilities';
import AreaBuilder from '../../areaBuilder';
import WesterosCardBuilder from '../../westerosCardBuilder';


describe('CardAbilities', () => {

  describe('supply', () => {
    it(' should call updateSuppy', () => {
      const state = {};
      spyOn(SupplyStateModificationService, 'updateSupply');
      CardAbilities.supply(state);
      expect(SupplyStateModificationService.updateSupply).toHaveBeenCalled();
    });
  });

  describe('invluence', () => {
    it(' should do nothing for now', () => {
      // given
      const initialState = {
        gamePhase: GamePhase.WESTEROS1
      };
      // when
      const actual = CardAbilities.invluence(initialState);

      // then
      expect(actual.currentWesterosCard).toBeNull();
      expect(actual.gamePhase).toBe(GamePhase.WESTEROS2);

    });
  });

  describe('nothing', () => {
    it(' should go to the next gamePhase', () => {
      // given
      const initialState = {
        gamePhase: GamePhase.WESTEROS1
      };

      // when
      const actual = CardAbilities.nothing(initialState);
      expect(actual.gamePhase).toBe(GamePhase.WESTEROS2);
    });
  });

  describe('recruit', () => {
    it(' should set all areas allowed to recruit', () => {
      // given
      const areas: Map<AreaKey, Area> = new Map<AreaKey, Area>();
      const area1: Area = new AreaBuilder(AreaKey.Winterfell).withHouse(House.stark)
        .withUnits([UnitType.Footman])
        .build();
      const area2: Area = new AreaBuilder(AreaKey.TheShiveringSea)
        .withHouse(House.stark)
        .withUnits([UnitType.Footman])
        .build();
      const area3: Area = new AreaBuilder(AreaKey.WhiteHarbor)
        .withHouse(House.baratheon)
        .withUnits([UnitType.Footman])
        .build();
      const currentlyAllowedSupply: Map<House, number> = new Map<House, number>();
      currentlyAllowedSupply.set(House.stark, 2);
      currentlyAllowedSupply.set(House.baratheon, 2);
      areas.set(AreaKey.Winterfell, area1);
      areas.set(AreaKey.TheShiveringSea, area2);
      areas.set(AreaKey.WhiteHarbor, area3);
      const initialState = {
        gamePhase: GamePhase.WESTEROS1,
        areas: areas,
        ironThroneSuccession: [],
        currentlyAllowedSupply: currentlyAllowedSupply
      };
      const actual = CardAbilities.recruit(initialState);
      expect(actual.areasAllowedToRecruit.length).toBe(2);
    });
  });

  describe('shuffleCards', () => {
    it(' should shuffle the cards for the current GamePhase', () => {

      // given
      const westerosCards: Map<GamePhase, WesterosCard[]> = new Map();
      const card1 = new WesterosCardBuilder().build();
      const westeros1Cards: WesterosCard[] = [card1];

      for (let i: number = 0; i < 1000000; i++) {
        westeros1Cards.push(new WesterosCardBuilder().build());
      }
      westerosCards.set(GamePhase.WESTEROS1, westeros1Cards);
      const initialState = {
        westerosCards,
        gamePhase: GamePhase.WESTEROS1,
        currentWesterosCard: new WesterosCardBuilder().gamePhase(GamePhase.WESTEROS1).build()
      };
      // when
      const actual = CardAbilities.shuffleCards(initialState);

      // then
      expect(actual.gamePhase).toBe(GamePhase.WESTEROS1);
      expect(actual.westerosCards.get(GamePhase.WESTEROS1).length).toBe(1000001);
      // testing random... can fail with a chance of 1 to a million
      expect(actual.westerosCards.get(GamePhase.WESTEROS1)[0]).not.toBe(card1);

    });
  });

  describe('noConsolidatePowerOrders', () => {
    it(' should remove consolidate power Orders from currentlyAllowedTokenTypes', () => {
      // given
      const initialState = {
        gamePhase: GamePhase.WESTEROS1,
        currentWesterosCard: new WesterosCardBuilder().build(),
        currentlyAllowedTokenTypes: GameStateModificationService.INITIALLY_ALLOWED_ORDER_TOKEN_TYPES
      };
      // when
      const actual = CardAbilities.noConsolidatePowerOrders(initialState);

      // then
      expect(actual.gamePhase).toBe(GamePhase.WESTEROS2);
      expect(actual.currentWesterosCard).toBeNull();
      expect(actual.currentlyAllowedTokenTypes.length).toBe(12);
      expect(actual.currentlyAllowedTokenTypes.indexOf(OrderTokenType.consolidatePower_0)).toBe(-1);
      expect(actual.currentlyAllowedTokenTypes.indexOf(OrderTokenType.consolidatePower_1)).toBe(-1);
      expect(actual.currentlyAllowedTokenTypes.indexOf(OrderTokenType.consolidatePower_special)).toBe(-1);
    });
  });

  describe('noRaidOrders', () => {
    it(' should remove raid OrderTokens from currentlyAllowedTokenTypes  ', () => {
      // given
      const initialState = {
        gamePhase: GamePhase.WESTEROS1,
        currentWesterosCard: new WesterosCardBuilder().build(),
        currentlyAllowedTokenTypes: GameStateModificationService.INITIALLY_ALLOWED_ORDER_TOKEN_TYPES
      };
      // when
      const actual = CardAbilities.noRaidOrders(initialState);

      // then
      expect(actual.gamePhase).toBe(GamePhase.WESTEROS2);
      expect(actual.currentWesterosCard).toBeNull();
      expect(actual.currentlyAllowedTokenTypes.length).toBe(12);
      expect(actual.currentlyAllowedTokenTypes.indexOf(OrderTokenType.raid_0)).toBe(-1);
      expect(actual.currentlyAllowedTokenTypes.indexOf(OrderTokenType.raid_1)).toBe(-1);
      expect(actual.currentlyAllowedTokenTypes.indexOf(OrderTokenType.raid_special)).toBe(-1);

    });
  });

  describe('noSpecialMarchOrder', () => {
    it(' should remove march special Order from currentlyAllowedTokenTypes', () => {
      // given
      const initialState = {
        gamePhase: GamePhase.WESTEROS1,
        currentWesterosCard: new WesterosCardBuilder().build(),
        currentlyAllowedTokenTypes: GameStateModificationService.INITIALLY_ALLOWED_ORDER_TOKEN_TYPES
      };
      // when
      const actual = CardAbilities.noSpecialMarchOrder(initialState);

      // then
      expect(actual.gamePhase).toBe(GamePhase.WESTEROS2);
      expect(actual.currentWesterosCard).toBeNull();
      expect(actual.currentlyAllowedTokenTypes.length).toBe(14);
      expect(actual.currentlyAllowedTokenTypes.indexOf(OrderTokenType.march_special)).toBe(-1);
    });
  });

  describe('noDefenseOrders', () => {
    it('should remove defense Orders from currentlyAllowedTokenTypes', () => {
      // given
      const initialState = {
        gamePhase: GamePhase.WESTEROS1,
        currentWesterosCard: new WesterosCardBuilder().build(),
        currentlyAllowedTokenTypes: GameStateModificationService.INITIALLY_ALLOWED_ORDER_TOKEN_TYPES
      };
      // when
      const actual = CardAbilities.noDefenseOrders(initialState);

      // then
      expect(actual.gamePhase).toBe(GamePhase.WESTEROS2);
      expect(actual.currentWesterosCard).toBeNull();
      expect(actual.currentlyAllowedTokenTypes.length).toBe(12);
      expect(actual.currentlyAllowedTokenTypes.indexOf(OrderTokenType.defend_1)).toBe(-1);
      expect(actual.currentlyAllowedTokenTypes.indexOf(OrderTokenType.defend_0)).toBe(-1);
      expect(actual.currentlyAllowedTokenTypes.indexOf(OrderTokenType.defend_special)).toBe(-1);
    });
  });
  describe('power', () => {
    it('should increase power for all player owning areas with consolidate power symbols', () => {
      // given
      const winterfell = new AreaBuilder(AreaKey.Winterfell).withHouse(House.stark).build();
      const castleBlack = new AreaBuilder(AreaKey.CastleBlack).withHouse(House.lannister).build();
      const kingsLanding = new AreaBuilder(AreaKey.KingsLanding).withHouse(House.stark).build();

      const playerStark = new Player(House.stark, 0);
      const playerLannister = new Player(House.lannister, 0);

      const areas = new Map<AreaKey, Area>();
      areas.set(AreaKey.Winterfell, winterfell);
      areas.set(AreaKey.CastleBlack, castleBlack);
      areas.set(AreaKey.WhiteHarbor, kingsLanding);
      let initialState = {
        players: [playerStark, playerLannister],
        areas: areas
      };

      // when
      const actual = CardAbilities.power(initialState);
      const newPlayerStark = actual.players.filter(player => player.house === House.stark)[0];
      const newPlayerLannister = actual.players.filter(player => player.house === House.lannister)[0];
      // then
      expect(newPlayerStark).not.toBe(playerStark);
      expect(newPlayerStark.powerToken).toBe(3);
      expect(newPlayerLannister).not.toBe(playerLannister);
      expect(newPlayerLannister.powerToken).toBe(1);
    });
  });

  describe('wildlingAttack', () => {
    it(' should do nothing for now', () => {
      // given
      const initialState = {
        gamePhase: GamePhase.WESTEROS1,
        currentWesterosCard: new WesterosCardBuilder().build()
      };

      // when
      const actual = CardAbilities.wildlingAttack(initialState);

      // then
      expect(actual.gamePhase).toBe(GamePhase.WESTEROS2);
      expect(actual.currentWesterosCard).toBeNull();


    });
  });

  describe('noSupportOrders', () => {
    it(' should remove the support token for currently allowedOrderTokenTypes', () => {
      // given
      const initialState = {
        gamePhase: GamePhase.WESTEROS1,
        currentWesterosCard: new WesterosCardBuilder().build(),
        currentlyAllowedTokenTypes: GameStateModificationService.INITIALLY_ALLOWED_ORDER_TOKEN_TYPES
      };

      // when
      const actual = CardAbilities.noSupportOrders(initialState);

      // then
      expect(actual.gamePhase).toBe(GamePhase.WESTEROS2);
      expect(actual.currentWesterosCard).toBeNull();
      expect(actual.currentlyAllowedTokenTypes.length).toBe(12);
      expect(actual.currentlyAllowedTokenTypes.indexOf(OrderTokenType.support_0)).toBe(-1);
      expect(actual.currentlyAllowedTokenTypes.indexOf(OrderTokenType.support_1)).toBe(-1);
      expect(actual.currentlyAllowedTokenTypes.indexOf(OrderTokenType.support_special)).toBe(-1);
    });
  });
});
