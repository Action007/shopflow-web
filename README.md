# ShopFlow Web

ShopFlow Web is a Next.js 16 storefront for browsing products, managing a cart, checking out, and reviewing orders.

- Swagger: https://shopflow-api-1fl0.onrender.com/api/docs
- Demo frontend: https://shopflow-web-pi.vercel.app/

It is built with:

- Next.js App Router
- React 19
- Tailwind CSS v4
- Zustand for client cart state
- Vitest + Testing Library for tests

## Features

- Product catalog with filters, sorting, and search
- Product detail pages
- Cart and checkout flow
- Order history and order detail pages
- Authentication-aware navigation and protected routes
- Proxy-based auth gate and token refresh handling
- Standalone production build support for Docker

## Requirements

- Node.js 20+
- npm 10+
- A running backend API compatible with the expected `API_URL`

## Environment Variables

Create `.env.local` for local development.

Required:

```env
API_URL=http://localhost:3000/api/v1
```

Optional:

```env
NEXT_PUBLIC_APP_NAME=ShopFlow
```

Reference example:

- [.env.example](./.env.example)

## Local Development

Install dependencies:

```bash
npm install
```

Start the dev server:

```bash
npm run dev
```

Open:

```text
http://localhost:3000
```

## Scripts

```bash
npm run dev
npm run build
npm run start
npm run lint
npm run test
npm run test:run
```

## Testing

Run the full test suite:

```bash
npm run test:run
```

Current coverage includes:

- utility helpers
- cart store selectors and initialization
- auth, cart, and order server actions
- auth form behavior
- cart and checkout interactions
- middleware/proxy and API wrapper logic

## Production Build

This app is configured for standalone output in:

- [next.config.ts](./next.config.ts)

Important production notes:

- fonts are self-hosted locally under [`public/fonts`](./public/fonts), so builds do not depend on Google Fonts
- auth route protection now uses [`src/proxy.ts`](./src/proxy.ts), matching current Next.js guidance

For a local production-style build:

```bash
npx next build --webpack
```

`npm run build` may use Turbopack depending on environment. In this repo, webpack has been the more reliable production verification path.

## Docker

The project includes:

- [Dockerfile](./Dockerfile)
- [.dockerignore](./.dockerignore)
- [docker-compose.yml](./docker-compose.yml)

### Build the storefront image

```bash
docker build -t shopflow-web .
```

### Run the storefront container

```bash
docker run --rm -p 3001:3001 \
  -e API_URL=http://host.docker.internal:3000/api/v1 \
  shopflow-web
```

The container serves the app on:

```text
http://localhost:3001
```

### Docker Compose

The included compose file is best treated as a local integration setup for:

- PostgreSQL
- the NestJS API in `../ecommerce-nestjs-api`
- this storefront

Start it with:

```bash
docker compose up --build
```

Before using it outside local development, review:

- placeholder secrets such as `JWT_SECRET`
- published database ports
- API-specific health endpoints and readiness behavior

## Deployment Checklist

Before deploying, verify:

1. Environment variables are set correctly.
2. The backend API is reachable from the deployed storefront.
3. `npm run test:run` passes.
4. Lint passes for your changed files.
5. A production build succeeds.
6. Container build succeeds if deploying with Docker.

Recommended deployment flow:

```bash
npm run test:run
npx next build --webpack
docker build -t shopflow-web .
```

## Project Structure

```text
src/app              App Router pages and layouts
src/actions          Server actions
src/components       UI and feature components
src/lib              Utilities, constants, API helpers, validations
src/stores           Zustand stores
src/test             Vitest setup
src/proxy.ts         Route protection and token refresh proxy
public/fonts         Self-hosted production fonts
```

## Notes

- Product and auth behavior is covered by automated tests, but you should still smoke-test the full checkout flow against the real backend before release.
- The compose file depends on a sibling API repository path. If that path changes, update `docker-compose.yml`.
