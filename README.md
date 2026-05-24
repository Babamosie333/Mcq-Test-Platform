# Local MCQ Test Platform
## Author: Vikram Singh
A local-only MCQ test platform where admins create and manage tests, and students attempt timed tests. All data is stored in a local MongoDB database — nothing is sent to the cloud.

## Tech Stack

- **Frontend:** HTML, CSS, JavaScript
- **Backend:** Node.js + Express
- **Database:** MongoDB (local)
- **Excel import:** SheetJS (`xlsx`)
- **Auth:** JWT (httpOnly cookie)

## Prerequisites

- [Node.js](https://nodejs.org/) 18+
- [MongoDB](https://www.mongodb.com/try/download/community) running locally on `mongodb://127.0.0.1:27017`

## Quick Start

```bash
cd local-mcq-test-platform
npm install
npm run seed    # creates default admin (once)
npm start
```

Open:

- **Student site:** http://localhost:3000
- **Admin panel:** http://localhost:3000/admin/login.html

### Default admin credentials

Set in `.env`:

| Variable | Default |
|----------|---------|
| `ADMIN_USERNAME` | `admin` |
| `ADMIN_PASSWORD` | `admin123` |

Change these before any shared/local-network use.

## Environment Variables

```env
PORT=3000
MONGODB_URI=mongodb://127.0.0.1:27017/mcq_test_platform
JWT_SECRET=change-this-to-a-long-random-secret
ADMIN_USERNAME=admin
ADMIN_PASSWORD=admin123
```

## Admin Workflow

1. Log in at `/admin/login.html`
2. Create **Subjects**
3. Create **Tests** (set duration and active status)
4. Add questions manually (**Questions**) or via **Excel Import**
5. View **Dashboard** stats and **Results**

## Excel Import Format

Columns (first row = headers):

| Column | Description |
|--------|-------------|
| subject | Subject name (created if missing) |
| test_title | Test title (created if missing, 30 min default) |
| question | Question text |
| option_a … option_d | Option text |
| correct_option | `A`, `B`, `C`, or `D` |
| marks | Points for correct answer |

Invalid rows are skipped; import summary shows success and failed row details.

## Student Workflow

1. Browse tests at `/tests.html`
2. Enter name and mobile on the test start page
3. Answer MCQs within the time limit
4. Submit manually or auto-submit when timer ends
5. View score on the result page

## API Overview

| Method | Route | Auth |
|--------|-------|------|
| POST | `/api/admin/login` | — |
| POST | `/api/admin/logout` | — |
| GET | `/api/admin/me` | Admin |
| GET/POST/PUT/DELETE | `/api/subjects` | POST/PUT/DELETE: Admin |
| GET/POST/PUT/DELETE | `/api/tests` | POST/PUT/DELETE: Admin |
| GET | `/api/tests/:testId/questions` | — |
| POST/PUT/DELETE | `/api/questions` | Admin |
| POST | `/api/questions/import-excel` | Admin |
| POST | `/api/attempts/start` | — |
| POST | `/api/attempts/:id/submit` | — |
| GET | `/api/admin/results` | Admin |
| GET | `/api/admin/stats` | Admin |

## Scoring

- Correct answer → full question marks
- Wrong or unanswered → 0 marks
- Percentage: `(score / totalMarks) × 100`

## Project Structure

```
local-mcq-test-platform/
  server.js
  public/          # Student-facing pages
  admin/           # Admin panel pages
  src/
    config/        # DB connection
    models/        # Mongoose schemas
    routes/        # API routes
    middleware/    # JWT auth
    services/      # Scoring, Excel import
    scripts/       # Admin seed
```

## Troubleshooting

**MongoDB connection failed**

- Ensure MongoDB is running: `mongosh` or `brew services start mongodb-community`

**No tests on student site**

- Tests must be **Active** and have at least one question

**Admin login fails**

- Run `npm run seed` to create the default admin account

What’s included

  Admin panel

  • Login/logout (JWT + httpOnly cookie)
  • Subjects, tests, questions CRUD
  • Excel bulk import with success/failed row summary
  • Dashboard stats (totals, test-wise averages, recent attempts)
  • Results page with subject/test filters

  Student site

  • Active test cards (subject, title, question count, time)
  • Name + mobile before start
  • Timed MCQ UI with auto-submit on timeout
  • Result page: score, %, correct/wrong counts

  Backend

  • MongoDB collections: admins, subjects, tests, questions, attempts
  • Scoring: correct → marks, wrong/skipped → 0, no negative marking
  • All API routes from your spec

  Suggested workflow

  1. Admin → create Subject → Test (duration + active)
  2. Add questions manually or via Excel Import
  3. Students open Browse Tests → start → submit
  4. Admin checks Dashboard and Results

  Excel columns

  subject, test_title, question, option_a, option_b, option_c, option_d, correct_option (A–D), marks

  Missing/invalid rows are rejected; import shows a summary.



## License

MIT
