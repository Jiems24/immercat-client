# ImmerCAT — Frontend (React)

## Description

ImmerCAT is a real estate management tool designed for private agencies in Catalonia. This repository contains the **frontend** built with React and Vite.

The backend repository can be found here: https://github.com/Jiems24/immercat-server


## How it works

ImmerCAT has two parts: a public area and a private admin panel.

### Public area
Any visitor can access the app and:
- Browse available properties
- Filter by operation type, property type and maximum price
- View the full detail of each property

### Private area (agents)
Agents log in with their credentials and get access to:
- **Dashboard** — summary of active properties, clients and owners with stats
- **Properties** — full CRUD, photo upload via Cloudinary, AI description generation with Mistral, and archive/restore
- **Clients** — full CRUD, demand tracking, visit notes linked to properties, and automatic property suggestions based on budget and demand
- **Owners** — full CRUD linked to their properties


---

## Instructions to run locally

### 1. Clone the repository
```bash
git clone https://github.com/Jiems24/immercat-client
cd immercat-client
```

### 2. Install dependencies
```bash
npm install
```

### 3. Environment variables

Create a `.env` file in the root of the project with the following variable:
VITE_API_URL=    # Backend URL (ex. http://localhost:5005 for local development)

> You will need the backend running locally or use the deployed version at `https://immercat-server.vercel.app`

### 4. Run the application
```bash
npm run dev
```

App runs at `http://localhost:5173`

---

## Demo

- **Frontend:** https://immercat.vercel.app
- **Backend API:** https://immercat-server.vercel.app

---

## Agradecimientos

Gracias a **Luis** y a **Ironhack Barcelona** por el bootcamp, el reto y la comunidad.

*Proyecto desarrollado como trabajo final del bootcamp de Web Development en Ironhack Barcelona — 2026*