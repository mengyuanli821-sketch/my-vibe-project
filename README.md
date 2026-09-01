# AI Student Notebook

Simple MVP for independent yoga, pilates, and barre teachers to record student profiles and class notes in Google Sheets.

## Setup

The app runs immediately with a local JSON data store at `.data/student-notebook.json` when Google credentials are not configured. To use Google Sheets instead:

1. Create a Google Sheet with two tabs: `Students` and `ClassNotes`.
2. Add these headers to `Students`:

   `id, name, contact, age_range, experience_level, goals, body_conditions, injury_notes, teacher_notes, created_at`

3. Add these headers to `ClassNotes`:

   `id, student_id, student_name, class_date, class_type, today_condition, strengths, issues, follow_up, teacher_note, created_at, energy_score, body_comfort_score, focus_score, class_time`

4. Copy `.env.local.example` to `.env.local` and fill in all three values (environment variable names are case-sensitive):

   `GOOGLE_SHEET_ID`, `GOOGLE_CLIENT_EMAIL`, `GOOGLE_PRIVATE_KEY`

AI-generated practice guides are optional. To explicitly enable sending the de-identified practice context to OpenAI, also set `OPENAI_API_KEY` and `ENABLE_AI_RECOMMENDATIONS=true`. You can override the default model with `OPENAI_MODEL`.

5. Install dependencies and run the app:

   ```bash
   npm install
   npm run dev
   ```

Open `http://localhost:3000/students`.
