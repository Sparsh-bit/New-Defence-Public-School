-- NEW DEFENCE PUBLIC SCHOOL - D1 DATABASE SCHEMA
-- This file is for manual reference and Wrangler CLI migrations.
-- The application also features auto-synchronization.

-- Academic Results Table
CREATE TABLE IF NOT EXISTS results (
    sr_no TEXT PRIMARY KEY,           -- Admission No (Unique Student Identifier)
    student_name TEXT NOT NULL,       -- Full Name
    class TEXT NOT NULL,              -- 10 or 12
    stream TEXT NOT NULL,             -- GENERAL, BIO, MATH, ARTS
    subjects_json TEXT NOT NULL,      -- JSON array of {subject, marks}
    total_marks REAL NOT NULL,        -- Aggregate total
    percentage REAL NOT NULL,         -- Calculated percentage
    result_status TEXT NOT NULL,      -- PASS, FAIL, COMPARTMENT
    academic_year TEXT NOT NULL,      -- e.g., 2024-25
    batch_id TEXT,                    -- Reference to the uploaded Excel file
    upload_date TEXT                  -- ISO timestamp of synchronization
);

-- Indexing for performance
CREATE INDEX IF NOT EXISTS idx_results_year_class ON results(academic_year, class);
CREATE INDEX IF NOT EXISTS idx_results_sr_no ON results(sr_no);
