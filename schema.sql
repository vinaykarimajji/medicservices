-- Run this in your Supabase SQL Editor to create the table
CREATE TABLE IF NOT EXISTS patient_records (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    register_id TEXT NOT NULL,
    name TEXT NOT NULL,
    problem TEXT,
    medicines TEXT,
    status TEXT DEFAULT 'waiting', -- 'cured', 'waiting', 'pending'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Optional: Add some dummy data
INSERT INTO patient_records (register_id, name, problem, medicines, status)
VALUES 
('REG-001', 'Ramesh Patil', 'High Fever', 'Paracetamol', 'waiting'),
('REG-002', 'Sita Devi', 'Severe Headaches', 'Aspirin', 'cured'),
('REG-003', 'Raju Sharma', 'Snake Bite', 'Antivenom', 'pending');
