declare enum GamePhase {
    WESTEROS1 = "WESTEROS1",
    WESTEROS2 = "WESTEROS2",
    WESTEROS3 = "WESTEROS3",
    PLANNING = "PLANNING",
    ACTION_RAID = "ACTION_RAID",
    ACTION_MARCH = "ACTION_MARCH",
    ACTION_CLEANUP = "ACTION_CLEANUP",
}
declare const ACTION_PHASES: GamePhase[];
declare const WESTEROS_PHASES: GamePhase[];
declare const ALL_PHASES: GamePhase[];
export { WESTEROS_PHASES, ACTION_PHASES, ALL_PHASES, GamePhase };
