## Cubica Game Player (Next.js)

This app renders Cubica game screens from JSON blueprints. Rather than hard-coding layouts, the UI is described as data delivered from the backend (or local fixtures). The runtime loads that schema, resolves the entry screen, and builds the component tree on the fly.

### Architecture
- `src/app/page.js` mounts `GameScreenRenderer`, a client component that hydrates the game state and exposes it via `GameScreenContext`.
- `GameScreenRenderer` chooses between local fixtures (`src/app/utils/localDataLoader.js`) and the remote API (`src/app/utils/serverDataLoader.js`) and stores the parsed schema in `appState`.
- `src/app/utils/renderer.js` walks the schema, mapping each `component` id to a React component under `src/app/components/gameComponents`. Old (`cssInline`) and new (`css`) styling props are merged so both schema generations render.
- Player interactions trigger JSON-defined actions that are dispatched through `src/app/utils/actions.js`. Handlers can swap screens, fetch server deltas, or mutate state via `applyDeepUpdates`.

### Data Sources
- **Local development**: `localDevelopment=true` loads `screen_s1.json` so you can work offline. Additional fixtures live under `src/app/data/`.
- **Remote mode**: `fetchServerData` posts to the game engine and expects a payload shaped like the fixtures (with optional `updates`). The current host is hard-coded; wire this to an env var before shipping.

### Key Modules
- `src/app/utils/actions.js`: action name catalogue, handler map, and deep merge helper.
- `src/app/utils/renderUtils.js`: resolves the entry-point key inside the schema.
- `src/app/components/gameComponents/*`: presentational building blocks that accept normalized props from the renderer.
- `src/app/api/route.js`: development-only API stub serving `screen_s1.json` and returning sample update diffs.

### Development
```bash
npm install
npm run dev
# visit http://localhost:3000
```

Toggle local fixtures vs. server fetches by passing `localDevelopment` to `GameScreenRenderer` (see `src/app/page.js`).

### Testing
There are currently no automated tests. Recommended next steps include:
- Renderer smoke tests that load each fixture and snapshot the output tree.
- Action handler tests for `applyDeepUpdates` and state transitions.
- Integration tests covering server diffs and context updates.

### Roadmap Notes
- Replace the hard-coded API host/token with environment variables.
- Trim console logging before production builds.
- Expand schema/docs for action contracts so backend and frontend evolve together.
