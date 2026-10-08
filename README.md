# Silloker Web

Silloker Web is the Vue 3 front end for searching and analyzing Korean historical records from the Chosŏn dynasty. It replaces the former Angular 10 application while preserving its public routes, backend endpoints, payloads, pagination, TSV downloads, and aggregation calculations.

## Technology

- Vue 3 and TypeScript
- Vite and Vue Router
- PrimeVue and PrimeIcons
- D3 for chart scales, stacks, and paths
- Vitest, Vue Testing Library, and Playwright
- Docker and Nginx

## Requirements

- Node.js 22.22.2, Node.js 24.15, or a newer active LTS release
- npm 10 or newer
- Docker for container verification

## Development

```bash
npm ci
npm run dev
```

The development server is available at [http://localhost:4200](http://localhost:4200).

The original application called `http://3.140.156.59:8080` directly. That remains the default to preserve its API contract. Override it without changing source:

```bash
VITE_API_BASE_URL=http://localhost:8080 npm run dev
```

Only expose a public, browser-reachable API URL. The client does not contain credentials.

## Scripts

| Command | Purpose |
| --- | --- |
| `npm run dev` | Start the Vite development server |
| `npm run build` | Type-check and create the production bundle |
| `npm run typecheck` | Run strict Vue/TypeScript checks |
| `npm run lint` | Run ESLint |
| `npm test` | Run Vitest in watch mode |
| `npm run test:run` | Run unit and component tests once |
| `npm run test:coverage` | Produce unit-test coverage |
| `npm run test:e2e` | Run Playwright browser tests |
| `npm run preview` | Preview the production bundle |

Install Playwright's browser once before local browser testing:

```bash
npx playwright install chromium
npm run test:e2e
```

The browser suite intercepts API calls with deterministic fixtures, so it does not require the live backend.

## Routes

- `/search` — record search, pagination, and TSV download
- `/aggregation` — keyword counts, ratios, source totals, accessible data tables, and download
- `/record/:id` — record details and related tags
- `/tag/:name` — preserved tag route with a search handoff; the legacy source did not implement a tag-results API
- `/about` — project background and feedback form
- `/search/instruction` — search instructions
- Unknown routes render an accessible 404 page
- `/` redirects to `/search`

Search criteria are reflected in the URL so a query can be revisited. Page indices sent to the backend remain zero-based, and page size remains 50.

## API contract

The app preserves these verified endpoints:

- `POST /record/search?page={page}&size=50`
- `POST /record/download/search`
- `GET /record/id/{id}`
- `GET /tag/record/{id}`
- `POST /record/aggregation`
- `GET /record/aggregation/{recordType}`
- `POST /record/download/aggregation`

Search download intentionally preserves the legacy body contract, which excludes selected record types. Downloads use the server's `Content-Disposition` filename when present and retain the legacy `search-results.tsv` and `aggregation-results.tsv` fallbacks.

Aggregation ratio values preserve the original calculation: for each year from 1392 through 1910, combined keyword hits are divided by combined totals for the selected record sources. Missing yearly values count as zero. The chart display domain remains 1392 through 1928.

## Production build

```bash
npm run lint
npm run typecheck
npm run test:run
npm run build
```

The output is written to `dist/`.

## Docker and Nginx

Build the image with the default API URL:

```bash
docker build -t silloker-web .
docker run --rm -p 8080:80 silloker-web
```

Or set the API URL at build time:

```bash
docker build \
  --build-arg VITE_API_BASE_URL=https://api.example.org \
  -t silloker-web .
```

The bundled Nginx configuration serves immutable hashed assets and falls back to `index.html` for client routes, so refreshing `/record/:id`, `/aggregation`, and other deep links does not return a 404.

## Accessibility

The interface targets WCAG 2.2 AA with semantic landmarks, explicit labels, keyboard-accessible controls, visible focus, status announcements, reduced-motion handling, responsive layouts, and tabular alternatives for chart data.

## Integration status

Unit, component, and browser tests use deterministic fixtures. A successful local build does not prove that the historical public backend is currently online or that its CORS policy permits a new deployment. Verify the configured backend and production hosting environment before release.
