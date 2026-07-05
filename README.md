# Web Consensus Sleep Diary

A functional web implementation of the Consensus Sleep Diary built with Next.js, React and Tailwind CSS.

The app includes:

- Participant login screen
- Sequential diary workflow
- Schema-driven question loading
- Reusable input components
- Per-question and final submission validation
- One-submission-per-participant-per-day checking
- Local development fallback
- Optional Supabase database integration

## Project structure

```text
app/
  page.js
components/
  DiaryWorkflow.jsx
  QuestionLoader.jsx
  inputs/
  ui/
library/
  diarySchema.js
  validation.js
services/
  participantService.js
  submissionService.js
lib/
  config.js
  supabaseClient.js
supabase/
  schema.sql
```

## Running locally

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

The local fallback works immediately using the built-in participant:

```text
Username: participant01
Password: sleepdemo
```

## Data provider modes

The app uses a service layer so the diary UI does not depend directly on a specific database.

By default, it runs in local mode:

```env
NEXT_PUBLIC_CSD_DATA_PROVIDER=local
```

Local mode stores submission state in browser `localStorage`. This is useful for development, testing and trying the app immediately after cloning.

For real study use, connect a database provider. This version includes Supabase support.

## Reccomended deployment
Host the application on Vercel and connect it to a Supabase project using the provided database schema. This configuration requires no custom backend and provides a simple, scalable solution for research studies.


## Connecting Supabase

### 1. Create a Supabase project

Create a new project from the Supabase dashboard.

### 2. Run the SQL schema

Open the Supabase SQL editor and run:

```text
supabase/schema.sql
```

This creates two tables:

### `participants`

Stores participant login records.

| Column | Purpose |
|---|---|
| `id` | Participant UUID |
| `username` | Participant login username |
| `password` | Participant login password/code |
| `active` | Whether the participant can log in |
| `created_at` | Record creation timestamp |

### `submissions`

Stores completed diary entries.

| Column | Purpose |
|---|---|
| `id` | Submission UUID |
| `participant_id` | Linked participant |
| `submission_date` | Date of diary submission |
| `submission_time` | Time of diary submission |
| `diary_data` | Full diary response as JSON |
| `created_at` | Record creation timestamp |

The schema includes a unique constraint on:

```text
participant_id + submission_date
```

This prevents the same participant from submitting more than once per day.

### 3. Add participants

The schema inserts one testing participant:

```text
Username: participant01
Password: sleepdemo
```

For a real study, replace this with your own participants in the `participants` table.

### 4. Create `.env.local`

Copy `.env.example` to `.env.local`:

```bash
cp .env.example .env.local
```

Then set:

```env
NEXT_PUBLIC_CSD_DATA_PROVIDER=supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

Restart the development server after changing environment variables.

### 5. Test the connection

Run:

```bash
npm run dev
```

Log in using a participant record from your Supabase `participants` table. When the diary is submitted, a row should be added to the `submissions` table.

## How the service layer works

The UI calls only two service files:

```text
services/participantService.js
services/submissionService.js
```

### Participant authentication

`authenticateParticipant(username, password)` returns a participant object if credentials are valid, or `null` if they are not.

In Supabase mode it queries:

```text
participants
```

### Submission status

`hasSubmittedToday(participantId)` checks whether the participant already has a submission for today's date.

In Supabase mode it queries:

```text
submissions
```

### Saving a diary entry

`saveDiarySubmission(participantId, submission)` saves the completed diary response.

In Supabase mode it inserts into:

```text
submissions
```

The saved diary response is stored in the `diary_data` JSONB column.

## Security note

The included Supabase setup is intentionally simple so the app can be connected quickly. For a live clinical or research deployment, review security before collecting real participant data.

Recommended production improvements include:

- Do not store plain-text passwords.
- Use hashed passwords, magic links, or an authentication provider.
- Review Supabase Row Level Security policies.
- Avoid exposing unnecessary participant data to the browser.
- Ensure your deployment meets any relevant data protection requirements.

## Customising the diary

The diary questions are defined in:

```text
library/diarySchema.js
```

Each schema item controls the question label, direction, input type and validation limits. The diary workflow reads this schema and renders the correct input component through `QuestionLoader.jsx`.

## Build

```bash
npm run build
```
