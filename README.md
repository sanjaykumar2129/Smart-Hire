# Smart Hire AI – AI-Powered Resume Analyzer & Job Recommendation System

**Smart Hire AI** is a modern, responsive, and fully functional web application designed to help students, fresh graduates, job seekers, and working professionals analyze their resumes, identify critical skill gaps, and discover suitable job opportunities aligned with market demands.

---

## 🌟 Core Highlights

- **Multi-Format Resume Ingestion**: Client-side document parsing supporting PDF (`.pdf`), Word (`.docx`, `.doc`), and plain text (`.txt`).
- **NLP & AI Extraction**: Automated identification of candidate contacts, executive summary, work experience history, academic degrees, certifications, and technical competencies.
- **Categorized Skill Taxonomy**: 150+ skills mapped across 7 core domains (Programming Languages, Web Development, Databases, AI/ML, Cloud & DevOps, Cybersecurity, Soft Skills, and Tools).
- **Deterministic Job Matching**: Real-time 0–100 compatibility scoring comparing candidate qualifications against job descriptions.
- **ATS Compatibility Audit**: Structural health metrics evaluating action verb velocity, quantified metrics (Google X-Y-Z formula), section clarity, and keyword density.
- **Career Recommendation Dashboard**: Dynamic ranking of target roles (Frontend, Python, Full Stack, Data Analyst, AI/ML, Cloud/DevOps, Security) with skill gap breakdowns.
- **Downloadable PDF Report**: One-click generation of branded executive intelligence reports using `jspdf` and `jspdf-autotable`.
- **Hybrid Storage & Privacy**: 100% private client-side processing with optional Supabase PostgreSQL sync.

---

## 🎨 Design System

Smart Hire AI follows an intentional, accessible, and elegant color palette:
- **Olive Green**: `#556B3E` / `#435930` (Primary accents, verified match badges, confident actions)
- **Soft Pink**: `#FFF0F3` / `#FCE7EC` / `#CC2C52` (Secondary highlights, skill gap callouts, warm subtle gradients)
- **Warm Whites & Off-Whites**: `#FAFBF9` / `#FFFFFF` (Clean, clutter-free canvas with high contrast)
- **Typography**: `Outfit` for bold, distinctive headings and `Inter` for clean, readable body copy.

---

## 🚀 Technology Stack

- **Frontend**: React 19, TypeScript, Tailwind CSS v4, Lucide React Icons
- **Data Visualizations**: Recharts (Radar charts, score gauges, benchmark comparison bars)
- **Document Extractors**: `pdfjs-dist` (PDF stream parsing) and `mammoth` (DOCX extraction)
- **Report Generation**: `jspdf` and `jspdf-autotable`
- **Backend & Cloud Persistence**: `@supabase/supabase-js` with graceful `localStorage` offline fallback
- **Build Tooling**: Vite with lightning-fast HMR

---

## 🛠️ Getting Started

### 1. Installation

Ensure you have [Node.js](https://nodejs.org/) (v18+) installed.

```bash
# Navigate to the project directory
cd "c:\Users\Priya Dharshini\OneDrive\Desktop\Smart Hire"

# Install dependencies (on Windows PowerShell, use npm.cmd if script execution is restricted)
npm install
```

### 2. Development Server

Start the local Vite dev server:

```bash
npm run dev
```

Open your browser at `http://localhost:5173`.

### 3. Production Build

To create an optimized production build:

```bash
npm run build
```

---

## 🗄️ Supabase Cloud Database Setup (Optional)

The application functions completely out of the box using browser storage. To persist analyses across devices via Supabase:

1. Create a project at [supabase.com](https://supabase.com).
2. Create a `.env` file in the project root:
   ```env
   VITE_SUPABASE_URL=https://your-project.supabase.co
   VITE_SUPABASE_ANON_KEY=eyJhbGciOi...
   ```
3. Run the following SQL script in the Supabase SQL Editor:
   ```sql
   CREATE TABLE IF NOT EXISTS public.analysis_history (
       id TEXT PRIMARY KEY,
       created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
       file_name TEXT NOT NULL,
       candidate_name TEXT,
       skills_count INTEGER DEFAULT 0,
       ats_score INTEGER DEFAULT 0,
       best_job_title TEXT,
       best_job_score INTEGER DEFAULT 0,
       resume_payload JSONB,
       match_payload JSONB
   );

   ALTER TABLE public.analysis_history ENABLE ROW LEVEL SECURITY;
   CREATE POLICY "Allow public insert" ON public.analysis_history FOR INSERT WITH CHECK (true);
   CREATE POLICY "Allow public select" ON public.analysis_history FOR SELECT USING (true);
   CREATE POLICY "Allow public delete" ON public.analysis_history FOR DELETE USING (true);
   ```

---

## ⚖️ Important Compliance & Advisory Disclaimer

> **Notice:** Smart Hire AI compatibility scores, ATS metrics, and career recommendations are advisory analytical assessments intended to guide interview preparation and resume formatting. **Smart Hire AI never guarantees job interview invitations, selection, or employment offers.** Actual hiring outcomes remain solely at the discretion of hiring managers and prospective employers.
