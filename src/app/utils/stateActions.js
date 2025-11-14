// Centralized set of reducer action names used by GameScreenRenderer and dispatch helpers in src/app/utils/actions.js.
// Keeping them here guarantees that both the UI (dispatch) and reducer switch stay in sync.
export const appStateActionTypes = {
  LOAD_START: 'LOAD_START', // GameScreenRenderer dispatches before kicking off local/remote fetches.
  LOAD_SUCCESS: 'LOAD_SUCCESS', // Reducer stores the freshly fetched schema in state and clears errors.
  LOAD_FAILURE: 'LOAD_FAILURE', // Surface load errors so the renderer can show a message instead of the game UI.
  REPLACE_STATE: 'REPLACE_STATE', // Used by action handlers to swap the entire screen with another fixture/schema.
  APPLY_PATCH: 'APPLY_PATCH', // Applies server-provided diffs via applyStateUpdates without rebuilding the tree.
};
