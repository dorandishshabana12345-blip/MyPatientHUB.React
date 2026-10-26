# MyPatientHUB.React

A React + Vite frontend reconstruction of the MyPatientHUB healthcare demo.

## Pages included
- Sign in and sign up
- Dashboard
- Find Doctor (search, specialty/gender filters, list/map preview, demo appointment booking)
- Find Clinic
- Marketplace
- Pharmacy
- Appointments
- Messages
- My Dependents
- My Account
- Settings

## Run locally
Install Node.js first, then open this folder in VS Code and run these commands in Command Prompt:

```bash
npm install
npm run dev
```

Open the local URL Vite prints, usually `http://localhost:5173`.

## Build
```bash
npm run build
npm run preview
```

## Firebase Hosting
The included `firebase.json` rewrites routes to `index.html` for this single-page React app.
After installing/configuring Firebase CLI and selecting your Firebase project:

```bash
npm run build
firebase deploy
```

## Important limitations
This is a frontend demo reconstruction, not a connected medical system. Doctor, clinic, marketplace and medicine entries are sample data. Appointments, dependents, account details and settings are stored in the current browser using localStorage. Authentication, social login, real messaging, payments, live maps, medicine ordering and a secure database are not connected. Do not store sensitive health information in this demo.

The supplied online URL exposes a JavaScript app shell to text-only inspection, so this project is reconstructed from the described pages and previously supplied project context rather than copied from the original source code.
