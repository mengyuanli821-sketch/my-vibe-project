# AI Student Notebook

Simple MVP for independent yoga, pilates, and barre teachers to record student profiles and class notes in Google Sheets.

## Setup

1. Create a Google Sheet with two tabs: `Students` and `ClassNotes`.
2. Add these headers to `Students`:

   `id, name, contact, age_range, experience_level, goals, body_conditions, injury_notes, teacher_notes, created_at`

3. Add these headers to `ClassNotes`:

   `id, student_id, student_name, class_date, class_type, today_condition, strengths, issues, follow_up, teacher_note, created_at`

4. Copy `.env.local.example` to `.env.local` and fill in:

   `GOOGLE_SHEET_ID`, `GOOGLE_CLIENT_EMAIL`, `GOOGLE_PRIVATE_KEY`

5. Install dependencies and run the app:

   ```bash
   npm install
   npm run dev
   ```

Open `http://localhost:3000/students`.
