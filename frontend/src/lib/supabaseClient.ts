import { createClient } from '@supabase/supabase-js';

// const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
// const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

const supabaseUrl = "https://hmnwjyufjfxiizrnwsle.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhtbndqeXVmamZ4aWl6cm53c2xlIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MDM2ODg1NiwiZXhwIjoyMDY1OTQ0ODU2fQ.xrUg8POzAXILWS9YcpsrN6_1i4yp7kGYt97wz6wQevM";

export const supabase = createClient(supabaseUrl, supabaseKey); 