# Database Setup for Competitor Data Persistence

This document explains how to set up the necessary database tables in Supabase to persist competitor findings and competitor analysis data.

## Prerequisites

- Access to your Supabase project dashboard
- Admin privileges to execute SQL commands

## Setup Instructions

1. **Access Supabase SQL Editor**
   - Go to your Supabase project dashboard
   - Navigate to the "SQL Editor" section in the left sidebar

2. **Execute the Schema**
   - Copy the contents of `supabase-schema.sql`
   - Paste it into the SQL Editor
   - Click "Run" to execute the commands

3. **Verify Tables Creation**
   - Go to "Table Editor" in the left sidebar
   - You should see two new tables:
     - `competitor_findings`
     - `competitor_analysis`

## Database Tables

### competitor_findings
Stores competitor finding data with the following fields:
- `id`: Primary key (auto-increment)
- `product_id`: Reference to the product (matches product.id from sample data)
- `competitor`: Competitor name
- `revenue`: Competitor revenue information
- `market_size`: Market size information
- `order_index`: Order of items in the table
- `created_at`: Timestamp when record was created
- `updated_at`: Timestamp when record was last updated

### competitor_analysis
Stores competitor analysis data with the following fields:
- `id`: Primary key (auto-increment)
- `product_id`: Reference to the product (matches product.id from sample data)
- `competitor`: Competitor name
- `key_gaps`: Key gaps analysis
- `our_solution`: Our solution description
- `order_index`: Order of items in the table
- `created_at`: Timestamp when record was created
- `updated_at`: Timestamp when record was last updated

## Features

- **Row Level Security (RLS)**: Enabled for both tables
- **Automatic Timestamps**: Created and updated timestamps are automatically managed
- **Indexed Queries**: Product ID fields are indexed for better performance
- **Flexible Policies**: Currently set to allow all operations (can be restricted later)

## How It Works

1. When a user visits a product detail page, the component loads existing data from Supabase
2. Any changes to the competitor tables (add, edit, delete) are automatically saved to Supabase
3. Data persists across page refreshes and browser sessions
4. Each product maintains its own set of competitor data

## Security Considerations

The current setup allows all operations on the tables. In a production environment, you may want to:
- Implement user authentication checks
- Restrict operations based on user roles
- Add data validation
- Implement audit logging

## Troubleshooting

If you encounter issues:
1. Check that all SQL commands executed successfully
2. Verify that the Supabase service role key is correctly configured
3. Check browser console for any error messages
4. Ensure the product IDs match between the sample data and the database queries 