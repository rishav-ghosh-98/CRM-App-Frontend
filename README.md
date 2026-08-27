# Anvaya CRM Frontend

Anvaya CRM is a React-based customer relationship management dashboard for organizing leads, assigning them to sales agents, and monitoring sales activity through a connected backend API.

## What I Built

- A dashboard showing total leads, active leads, recent closures, lead status, and leads grouped by sales agent.
- A lead overview page with filtering by status, sales agent, source, and tags.
- Lead sorting by priority and estimated time to close.
- Lead detail and edit workflows, plus a form for adding new leads.
- Sales agent management with a form for adding agents.
- Reports with pipeline totals, recently closed leads, lead distribution, and Chart.js visualizations.
- Loading and error states for API requests, with responsive styling for the main CRM screens.

## Tech Stack

- React 19 and React Router
- Vite
- Axios for API requests
- Bootstrap and custom CSS
- Chart.js with `react-chartjs-2`
- React Icons

## Project Structure

```text
Crm_App/
├── public/
├── src/
│   ├── api/
│   ├── components/
│   ├── pages/
│   └── routes/
├── index.html
├── package.json
└── vite.config.js
```

## Running the Frontend

From the `Frontend/Crm_App` directory, install dependencies and start the development server:

```bash
npm install
npm run dev
```

Open the local URL shown by Vite in your browser. The frontend expects the backend API to be running so that leads, agents, and report data can be loaded.

## Available Commands

```bash
npm run dev       # Start the development server
npm run build     # Create a production build
npm run lint      # Check the frontend source code
npm run preview   # Preview the production build
```

For backend setup and API endpoint details, see [Backend/README.md](../../Backend/README.md).
