# HVAC Portal

HVAC Portal is the MVP foundation for the **Hot & Cool Command Center**, an internal operations system for Hot & Cool Services.

The app is designed around the company workflow:

`Property -> Unit -> Equipment -> Job -> Materials + Hours -> Invoice -> Revenue`

Residential work is supported separately:

`Residential Client -> Equipment -> Job -> Materials + Hours -> Invoice`

## MVP Includes

- Owner dashboard with revenue, job, alert, inventory, approval, and invoice signals
- Apartment property, unit, equipment, job, material, labor, approval, and invoice data model
- Mobile-first technician view for assigned jobs
- Prisma schema for SQLite local development
- Seed data for Jose Alfaro, Angel Alfaro, Oscar Alfaro, apartment properties, jobs, materials, invoices, and alerts
- Role-aware navigation structure for owner, office/admin, and technician workflows

## Local Setup

```bash
npm install
cp .env.example .env
npm run prisma:migrate -- --name init
npm run prisma:seed
npm run dev
```

Open `http://localhost:3000`.

## Important MVP Flow

Create Property -> Add Unit -> Add Equipment -> Create Job -> Add Materials -> Add Employee Hours -> Mark Completed -> Create Invoice -> Mark Paid -> Dashboard Updates
