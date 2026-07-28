const SUPABASE_URL = "Your Supabase Url";
const SUPABASE_KEY = "Your Publishable Supabase Key";

const supabaseClient = supabase.createClient(
    SUPABASE_URL,
    SUPABASE_KEY
);
