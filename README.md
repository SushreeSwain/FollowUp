# FollowUp

A full-stack client and session management app with **online + offline support**.
---

## Features

- JWT Authentication (Login / Register)
- Online Mode (MongoDB + Express API)
- Offline Mode (IndexedDB)
- Seamless switching between online & offline
- Client management (CRUD)
- Session tracking with notes and dates
- Clean UI using shadcn/ui
- Protected routes

---

## Architecture

This app uses a **service layer abstraction**:
UI --> Service Layer --> API/IndexedDB

This allows:
- switching between online & offline modes
- clean separation of logic

---

## Tech Stack

### Frontend
- React
- React Router
- shadcn/ui
- Tailwind CSS

### Backend
- Node.js
- Express.js
- MongoDB Atlas
- JWT Authentication

### Offline Storage
- IndexedDB (Dexie)

---

## Modes

### Online Mode
- Data stored in MongoDB
- Requires login
- User-specific data

### Offline Mode
- Data stored in browser (IndexedDB)
- No login required
- Fully local

---

## Challenges Faced

- Managing dual data sources (API + IndexedDB)
- Handling `_id` vs `id` differences
- Service layer abstraction
- Route consistency across modes
- Debugging async UI + navigation issues

---

## Status

✅ Core features complete  
✅ Online + Offline working  
Future improvements planned  

---

## License

This project is proprietary.

Unauthorized use, copying, or modification is prohibited.

---

## Author

Built by **Sushree S Swain**

---

