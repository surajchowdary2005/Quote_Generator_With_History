# ✨ Quote Generator with History

A full-stack web application that fetches random inspirational quotes from a public API and allows users to save, view, copy, and remove their favorite quotes.

## 🚀 Features

- 🎲 Fetch random inspirational quotes from a public API.
- ❤️ Save favorite quotes to an SQLite database.
- 📚 View saved quotes in Favorites History.
- 📋 Copy quotes and authors to the clipboard.
- 🗑️ Remove quotes from favorites.
- 📱 Responsive user interface for desktop and mobile devices.
- 🔄 Favorites remain saved across page refreshes.

## 🛠️ Technologies Used

- **Frontend:** HTML, CSS, JavaScript
- **Backend:** Node.js, Express.js
- **Database:** SQLite with better-sqlite3
- **API:** DummyJSON Quotes API

## 📂 Project Structure

```text
Quote_Generator_With_History/
├── server.js
├── index.html
├── style.css
├── script.js
├── package.json
├── package-lock.json
├── .gitignore
└── quotes.db
```

Note: `quotes.db` is generated automatically when the server starts and should not be committed to GitHub.

## ⚙️ Installation and Setup

### 1. Clone the repository

```bash
git clone https://github.com/surajchowdary2005/Quote_Generator_With_History.git
```

### 2. Open the project folder

```bash
cd Quote_Generator_With_History
```

### 3. Install dependencies

```bash
npm install
```

### 4. Start the application

```bash
npm start
```

### 5. Open in your browser

Visit: http://localhost:3000

## 🔌 API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/quote` | Fetch a random quote |
| GET | `/api/favorites` | Get saved favorites |
| POST | `/api/favorites` | Save a favorite quote |
| DELETE | `/api/favorites/:id` | Remove a favorite |

## 🎯 Project Objective

The objective of this project is to practice integrating third-party APIs, building backend services, storing favorite quotes in a database, and implementing clipboard functionality.

## 👨‍💻 Author

**Suraj Chowdary**

GitHub: [surajchowdary2005](https://github.com/surajchowdary2005)

---

⭐ If you like this project, consider giving the repository a star!
