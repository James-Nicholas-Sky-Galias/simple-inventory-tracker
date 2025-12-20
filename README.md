# Simple Inventory Tracker

## Description
A lightweight inventory tracker for household or school items.  
Features CRUD operations via a REST API with low-stock alerts.

---

## Features
- Add new items with quantity
- Update item quantity
- Delete items
- Low-stock indicator (alerts & red highlight)
- REST API integration (Express + MongoDB)
- Vanilla JS frontend

---

## Tech Stack
- Node.js
- Express.js
- MongoDB Atlas
- Vanilla JavaScript, HTML, CSS

---

## Setup Instructions (Clone & Run Locally)

1. **Clone the repository**
```bash
git clone https://github.com/James-Nicholas-Sky-Galias/simple-inventory-tracker.git
```

2. **Install Dependencies**
```bash
npm install
```

3. **Set up environment variables**
 - Copy .env.example to .env
```bash
cp .env.example .env
```
 - Replace MONGO_URI with your own MongoDB Atlas connecting string

4. **Start the server**
```bash
npm start
```

5. **Open the app in your browser**
```bash
http://localhost:3000
```