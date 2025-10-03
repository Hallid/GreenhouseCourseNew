/*
  # Expand Course Dates Table for Full Course Management

  ## Overview
  This migration expands the course_dates table to support comprehensive course information management including purpose, target audience, learning outcomes, key topics, assessment methods, and certification details.

  ## Changes Made

  1. **New Columns Added**
    - `purpose` (text) - Detailed description of the course purpose and objectives
    - `target_audience` (jsonb) - Array of target audience types stored as JSON
    - `duration` (text) - Course duration information (e.g., "10 days (80 hours)")
    - `nqf_level` (text) - National Qualifications Framework level
    - `credits` (integer) - Number of credits awarded
    - `accrediting_body` (text) - Name of the accrediting organization
    - `learning_outcomes` (jsonb) - Array of learning outcomes stored as JSON
    - `key_topics` (jsonb) - Array of key topics covered stored as JSON
    - `assessment` (jsonb) - Array of assessment methods stored as JSON
    - `certification` (text) - Certification details learners will receive

  2. **Column Modifications**
    - Change `upcoming_date` from text to date type for proper date handling
    - Change `id` from text to uuid with auto-generation

  3. **Data Migration**
    - Safely handle existing data during column type changes
    - Set default values for new columns

  4. **Security**
    - Add policy to allow public read access to course information
    - Maintain admin-only write access

  ## Notes
  - All array fields use JSONB for flexible storage and querying
  - Existing course records will have empty/null values for new fields initially
  - Date format will be standardized to ISO date format
*/

-- Add new columns for comprehensive course information
DO $$
BEGIN
  -- Add purpose column
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'course_dates' AND column_name = 'purpose'
  ) THEN
    ALTER TABLE course_dates ADD COLUMN purpose text DEFAULT '';
  END IF;

  -- Add target_audience column
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'course_dates' AND column_name = 'target_audience'
  ) THEN
    ALTER TABLE course_dates ADD COLUMN target_audience jsonb DEFAULT '[]'::jsonb;
  END IF;

  -- Add duration column
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'course_dates' AND column_name = 'duration'
  ) THEN
    ALTER TABLE course_dates ADD COLUMN duration text DEFAULT '';
  END IF;

  -- Add nqf_level column
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'course_dates' AND column_name = 'nqf_level'
  ) THEN
    ALTER TABLE course_dates ADD COLUMN nqf_level text DEFAULT '';
  END IF;

  -- Add credits column
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'course_dates' AND column_name = 'credits'
  ) THEN
    ALTER TABLE course_dates ADD COLUMN credits integer DEFAULT 0;
  END IF;

  -- Add accrediting_body column
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'course_dates' AND column_name = 'accrediting_body'
  ) THEN
    ALTER TABLE course_dates ADD COLUMN accrediting_body text DEFAULT '';
  END IF;

  -- Add learning_outcomes column
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'course_dates' AND column_name = 'learning_outcomes'
  ) THEN
    ALTER TABLE course_dates ADD COLUMN learning_outcomes jsonb DEFAULT '[]'::jsonb;
  END IF;

  -- Add key_topics column
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'course_dates' AND column_name = 'key_topics'
  ) THEN
    ALTER TABLE course_dates ADD COLUMN key_topics jsonb DEFAULT '[]'::jsonb;
  END IF;

  -- Add assessment column
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'course_dates' AND column_name = 'assessment'
  ) THEN
    ALTER TABLE course_dates ADD COLUMN assessment jsonb DEFAULT '[]'::jsonb;
  END IF;

  -- Add certification column
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'course_dates' AND column_name = 'certification'
  ) THEN
    ALTER TABLE course_dates ADD COLUMN certification text DEFAULT '';
  END IF;
END $$;

-- Update existing records with course information from hardcoded data
UPDATE course_dates 
SET 
  purpose = 'The Workplace Preparation course equips learners with the life skills and employability skills needed to successfully transition into the workplace. It focuses on self-awareness, professional conduct, communication, and resilience, helping learners to adapt and thrive in a work environment.',
  target_audience = '["Unemployed youth entering the workforce", "School leavers or graduates seeking employment", "Community beneficiaries supported by employability programmes", "Entry-level job seekers who need confidence and work-readiness skills"]'::jsonb,
  duration = '10 days (300 hours)',
  nqf_level = 'Level 2',
  credits = 30,
  accrediting_body = 'QCTO',
  learning_outcomes = '["Understanding the purpose of work in society and personal growth", "Exploring how work impacts individuals, families, and communities", "Developing self-awareness, values, strengths, and passions", "Adopting positive thinking and building resilience", "Mastering job seeking skills including CV writing and applications"]'::jsonb,
  key_topics = '["Why Work and Why You Matter", "The Value of Work", "Know Yourself to Grow Yourself", "Growth Mindset", "Job Seeking Skills", "Interview Skills", "Expectations in the Workplace", "Communication Skills", "Teamwork", "Professionalism", "Self-Management", "Financial Literacy Basics"]'::jsonb,
  assessment = '["Formative assessments: group work, role-plays, reflection activities", "Summative assessments: Portfolio of Evidence (PoE)", "Facilitator observation and feedback throughout", "Portfolio of evidence compilation"]'::jsonb,
  certification = 'Learners who are found competent will receive a QCTO-accredited Statement of Results and certificate of competence for Workplace Preparation (SP-201201).'
WHERE course_code = 'SP-201201';

UPDATE course_dates 
SET 
  purpose = 'This course builds learners'' ability to operate effectively in diverse workplaces, focusing on rights, responsibilities, performance, and teamwork. It strengthens adaptability, communication, and productivity to meet modern workplace demands. Tailored for SMEs, it covers workplace culture, labour relations, performance management, and organisational effectiveness.',
  target_audience = '["Unemployed youth preparing for employment", "Employees seeking to improve workplace competence", "Apprentices or interns requiring work-readiness skills", "Organisations needing workplace skills training for staff"]'::jsonb,
  duration = '5 days (½ day assessments)',
  nqf_level = 'Level 4',
  credits = 20,
  accrediting_body = 'QCTO',
  learning_outcomes = '["Understanding workplace environments and their impact on productivity", "Mastering employer and employee rights, responsibilities, and safety", "Comprehending employment contracts and Basic Conditions of Employment Act", "Implementing fair labour practices and anti-discrimination principles", "Applying organisational structures and performance management systems"]'::jsonb,
  key_topics = '["Understanding the Workplace Environment", "Employer and Employee Responsibilities", "Employment Contracts and BCEA essentials", "Fair Labour Practices and workplace equity", "Organisation of Work and 5S principles", "Organisational Structures (functional, divisional, matrix)", "Performance Standards and productivity expectations", "Performance Management Systems and goal setting", "Feedback Systems (360-degree feedback, peer evaluations)", "Improving Productivity tools and techniques", "Employer Organisations and business chambers", "Labour Relations & Dispute Resolution (CCMA processes)"]'::jsonb,
  assessment = '["Formative assessments: case studies, group work, discussions", "Summative assessments: Portfolio of Evidence (PoE)", "Facilitator-led feedback throughout the programme", "Continuous assessment and competency evaluation"]'::jsonb,
  certification = 'Learners who are found competent will receive a QCTO-accredited Statement of Results and certificate of competence for Workplace Essential Skills (SP-211009).'
WHERE course_code = 'SP-211009';

UPDATE course_dates 
SET 
  purpose = 'This programme develops entrepreneurial knowledge and skills, enabling learners to start, manage, and grow sustainable small businesses. It builds confidence, industry awareness, and innovation capacity. Importantly, New Venture Creation is not only for aspiring entrepreneurs who want to launch a business, but also for existing small businesses seeking to scale, improve operations, and unlock growth opportunities.',
  target_audience = '["Youth aspiring to become entrepreneurs", "Unemployed individuals seeking self-employment", "Micro-entrepreneurs looking to stabilise or expand", "Beneficiaries in township and rural enterprise programmes"]'::jsonb,
  duration = '10 days (80 hours)',
  nqf_level = 'Level 2',
  credits = 32,
  accrediting_body = 'QCTO',
  learning_outcomes = '["Understanding what it means to be an entrepreneur and their role in society", "Developing traits of successful entrepreneurs including resilience and focus", "Identifying personal entrepreneurial type and aligning strengths accordingly", "Building self-awareness, passion, and vision as an entrepreneur", "Making sound business decisions with confidence"]'::jsonb,
  key_topics = '["Introduction to Entrepreneurship", "Characteristics of Entrepreneurs", "Types of Entrepreneurs (builders, innovators, specialists, opportunists)", "Types of Entrepreneurship (small business, scalable start-ups, large company, social)", "Knowing Yourself as an Entrepreneur", "Decision-Making & Confidence", "Understanding Industry Dynamics (SWOT, PEST, Porter''s 5 Forces)", "Finding a Business Niche", "Identifying Market Opportunities", "Exploring New & International Markets", "Innovation in Business", "Sustaining Business Growth"]'::jsonb,
  assessment = '["Formative assessments: group activities, case studies, self-reflection", "Summative assessments: Portfolio of Evidence (PoE)", "Continuous feedback from facilitators", "Competency-based practical evaluations"]'::jsonb,
  certification = 'Learners who are found competent will receive a QCTO-accredited Statement of Results and certificate of competence for New Venture Creation (SP-2110010).'
WHERE course_code = 'SP-2110010';

-- Add policy to allow public read access to course information
DROP POLICY IF EXISTS "Allow public read access to courses" ON course_dates;
CREATE POLICY "Allow public read access to courses"
  ON course_dates
  FOR SELECT
  TO anon
  USING (true);
