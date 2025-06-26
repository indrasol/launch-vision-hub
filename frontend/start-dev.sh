#! /bin/bash

# This script passes system environment variables to Vite
source ~/.zshrc

# Pass the environment variables to Vite dev server

VITE_SUPABASE_URL=$SUPABASEURL \
VITE_SUPABASE_ANON_KEY=$SUPABASEANONKEY \

npm run dev
