# Inventory Reservation System

## Tech Stack

- Next.js
- Prisma
- PostgreSQL
- TypeScript

---

## Features

- Product inventory management
- Warehouse management
- Reservation system
- Confirm reservation
- Release reservation
- Transaction-based concurrency handling

---

## APIs

### GET /api/products

Returns all products with inventory details.

### GET /api/warehouses

Returns warehouse details.

### POST /api/reservations

Creates reservation.

### POST /api/reservations/[id]/confirm

Confirms reservation.

### POST /api/reservations/[id]/release

Releases reservation stock.

---

## Concurrency Handling

Implemented using Prisma transactions:

```ts
prisma.$transaction()
```

This prevents overselling during simultaneous reservations.

---

## Setup

```bash
npm install
```

```bash
npx prisma generate
```

```bash
npx prisma migrate dev
```

```bash
npm run dev
```

---

## Author

Anushree