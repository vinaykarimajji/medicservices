import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://vevanfbucvwarctyixyj.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZldmFuZmJ1Y3Z3YXJjdHlpeHlqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODg1OTk0NTUsImV4cCI6MjEwNDE3NTQ1NX0.p1B0RXFulJ_ytMYLaljKkoFEtS_tXQbKNDI2HQAEtu8';

export const supabase = createClient(supabaseUrl, supabaseKey);
