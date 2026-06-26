export default function handler(req, res) {
  res.status(200).json({
    supabaseUrl:  process.env.SUPABASE_URL  || '',
    supabaseKey:  process.env.SUPABASE_ANON || '',
    mapsKey:      process.env.GOOGLE_MAPS_KEY || '',
  });
}
