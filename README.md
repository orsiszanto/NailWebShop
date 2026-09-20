# NailShop

<p align="center">
	<img src="https://img.shields.io/badge/Angular-21-DD0031?style=for-the-badge&logo=angular&logoColor=white" alt="Angular 21" />
	<img src="https://img.shields.io/badge/TypeScript-5.9-3178C6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript 5.9" />
	<img src="https://img.shields.io/badge/Firebase-12-FFCA28?style=for-the-badge&logo=firebase&logoColor=black" alt="Firebase" />
	<img src="https://img.shields.io/badge/SCSS-Design%20System-CF649A?style=for-the-badge&logo=sass&logoColor=white" alt="SCSS" />
</p>

A full-stack web shop for nail-care products, built with Angular and Firebase. Customers can browse and filter products, manage a shopping cart, place orders, and maintain their profile. Administrators can manage the product catalogue, categories, and order statuses from a dedicated dashboard.

> Note: The user-facing application is primarily in Hungarian.
>
> The application uses the Firebase project configured for `nailshopweb`. A Firebase web configuration is included for the client application; the Firebase Admin SDK service-account key is intentionally excluded from Git and must be supplied locally only when running the database seed script.

## Overview

NailShop demonstrates a realistic e-commerce workflow for a small product business. The application separates customer and administrator experiences while keeping shared concerns such as authentication, routing, Firestore access, notifications, layout, and design tokens in reusable application layers.

The deployed application is available at:

**https://nailshopweb.web.app**

## Showcase

<p align="center">
	<a href="docs/media/Showcase.gif">
		<img src="docs/media/Showcase.gif" alt="NailShop application showcase" width="900" />
	</a>
</p>

## Key Features

### Customer experience

- email and password registration and login
- product browsing with category filtering, search, and sorting
- product detail pages with image galleries and add-to-cart actions
- shopping cart with quantity updates, item removal, clearing, and totals
- cart persistence through browser local storage
- authenticated checkout with shipping details and order notes
- personal order history and order detail views
- profile editing and account deletion with re-authentication
- loading, empty, error, not-found, and unauthorized states

### Administrator experience

- role-protected admin area
- dashboard overview
- product creation, editing, activation, and deletion
- category management
- order list and order status updates

## Tech Stack

- **Angular 21** with standalone components and Angular Router
- **TypeScript 5.9**
- **Firebase Authentication** for account management and sessions
- **Cloud Firestore** for users, products, categories, orders, and order items
- **Firebase Admin SDK** for the local database seed script
- **Angular signals** and computed signals for local application state
- **RxJS** for asynchronous authentication and data flows
- **SCSS** with shared design tokens for colors, spacing, typography, radius, shadows, and responsive breakpoints
- **Vitest** and JSDOM for automated tests
- **Firebase Hosting** for deployment

## Architecture and Solutions

The application follows a feature-oriented Angular structure:

- `core/` contains Firebase integration, authentication, guards, shared models, and cross-feature services.
- `layout/` contains the shell, header, top bar, and footer used across the application.
- `features/` groups each business capability into its own routes, pages, components, and data-access code.
- `shared/` contains reusable UI components and application-wide helpers.
- `styles/` contains the global SCSS foundation and design-token system.

Important implementation decisions include:

- **Lazy-loaded feature routes:** Shop, cart, orders, users, information pages, and the admin area are loaded through feature route configurations.
- **Route protection:** `authGuard` protects authenticated workflows such as checkout, while `adminGuard` restricts the administration area to users with the `admin` role.
- **Signal-based stores:** `AuthStore` exposes the current user, loading state, errors, and authentication status through signals. The cart store provides derived totals and cart operations.
- **Firestore data-access services:** Product, category, and order operations are kept separate from presentation components.
- **Reusable UI:** Shared buttons, inputs, modals, loading states, page titles, empty states, and notifications keep the feature pages consistent.
- **Centralized error mapping:** Firebase errors are translated into user-facing messages through shared services.
- **Responsive design system:** SCSS tokens and shared layout styles support desktop and mobile shopping flows.

## Data Model

The main Firestore entities are:

- **User:** identity, contact details, address, and role
- **Product:** name, description, price, stock, images, category, active state, and timestamps
- **Category:** name, description, and active state
- **Order:** customer, order date, status, total, shipping details, notes, and line items
- **Order item:** product reference, quantity, price at purchase time, and subtotal

The documented relationships are:

```text
Category 1 ---- N Product
User     1 ---- N Order
Order    1 ---- N OrderItem
Product  1 ---- N OrderItem
```

Firestore access rules are defined in [`firestore.rules`](firestore.rules), and required query indexes are tracked in [`firestore.indexes.json`](firestore.indexes.json).

## Project Structure

```text
.
├── docs/
│   ├── SPECIFICATION.md       # Functional and non-functional requirements
│   ├── DATAMODEL.md           # Entities and relationships
│   ├── COMPONENTS.md          # Component and page architecture
│   └── AI_PROMPT_LOG.md       # AI-assisted planning notes
├── public/                    # Static assets
├── scripts/
│   ├── seed-database.js       # Firebase Admin SDK seed script
│   └── seed-database.ts       # TypeScript version of the seed script
├── src/
│   ├── app/
│   │   ├── core/              # Auth, Firebase, models, and shared services
│   │   ├── features/          # Shop, cart, order, user, admin, and info features
│   │   ├── layout/            # Shell, header, top bar, and footer
│   │   └── shared/            # Reusable UI components
│   ├── styles/                # Global SCSS and design tokens
│   └── main.ts                # Application entry point
├── angular.json
├── firebase.json
├── firestore.indexes.json
├── firestore.rules
├── package.json
└── README.md
```

## Getting Started

### Prerequisites

- Node.js 24 or a compatible current Node.js release
- npm 11
- access to the `nailshopweb` Firebase project for live data and authentication

### Install and run

```bash
git clone https://github.com/orsiszanto/NailWebShop.git
cd NailWebShop
npm install
npm start
```

The development server runs at `http://localhost:4200/` by default.

The client Firebase configuration is stored in [`src/app/core/firebase/firebase.config.ts`](src/app/core/firebase/firebase.config.ts). The Firebase web API key is not a service-account private key; access control is enforced through Firebase Authentication and Firestore rules.

## Database Seeding

The seed script uses the Firebase Admin SDK and requires a service-account JSON file. Create or download a new private key for the `nailshopweb` Firebase project and save it locally as:

```text
scripts/nailshopweb-key.json
```

This file is ignored by Git through `.gitignore` and must never be committed or uploaded.

After installing dependencies, run the seed script from the project root:

```bash
node scripts/seed-database.js
```

The script writes seed products, categories, and administrator data to Firestore. Review the script before running it against a shared or production database.

## Available Scripts

| Command | Purpose |
|---|---|
| `npm start` | Start the Angular development server |
| `npm run build` | Create a production build |
| `npm run watch` | Build continuously in development mode |
| `npm test` | Run the Vitest test suite |
| `npm run test:ui` | Open the Vitest UI |
| `npm run test:coverage` | Generate test coverage |
| `node scripts/seed-database.js` | Seed Firebase data locally |

## Testing

The repository includes unit tests for authentication state, notification behavior, and order services, as well as an end-to-end checkout-flow specification. Run the unit test suite with:

```bash
npm test
```

## Build and Deployment

Create a production build with:

```bash
npm run build
```

Firebase Hosting is configured in [`firebase.json`](firebase.json). After authenticating with the Firebase CLI and building the application, deploy with:

```bash
firebase deploy
```

Deployment requires the appropriate Firebase project access and should never include the Admin SDK service-account JSON file.

## Documentation

- [`docs/SPECIFICATION.md`](docs/SPECIFICATION.md) - functional requirements, roles, routes, and quality goals
- [`docs/DATAMODEL.md`](docs/DATAMODEL.md) - application entities and relationships
- [`docs/COMPONENTS.md`](docs/COMPONENTS.md) - component hierarchy and page composition
- [`docs/AI_PROMPT_LOG.md`](docs/AI_PROMPT_LOG.md) - AI-assisted design and implementation notes

## License

This project was created for educational and portfolio purposes.
