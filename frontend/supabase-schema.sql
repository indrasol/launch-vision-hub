-- Create table for competitor findings
CREATE TABLE IF NOT EXISTS competitor_findings (
    id BIGSERIAL PRIMARY KEY,
    product_id TEXT NOT NULL,
    competitor TEXT NOT NULL,
    revenue TEXT,
    market_size TEXT,
    order_index INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create table for competitor analysis
CREATE TABLE IF NOT EXISTS competitor_analysis (
    id BIGSERIAL PRIMARY KEY,
    product_id TEXT NOT NULL,
    competitor TEXT NOT NULL,
    key_gaps TEXT,
    our_solution TEXT,
    order_index INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS competitor_findings_product_id_idx ON competitor_findings (product_id);
CREATE INDEX IF NOT EXISTS competitor_analysis_product_id_idx ON competitor_analysis (product_id);

-- Enable Row Level Security (RLS)
ALTER TABLE competitor_findings ENABLE ROW LEVEL SECURITY;
ALTER TABLE competitor_analysis ENABLE ROW LEVEL SECURITY;

-- Create policies for competitor_findings (allow all operations for now)
CREATE POLICY "Enable all operations for competitor_findings" ON competitor_findings
    FOR ALL USING (true) WITH CHECK (true);

-- Create policies for competitor_analysis (allow all operations for now)
CREATE POLICY "Enable all operations for competitor_analysis" ON competitor_analysis
    FOR ALL USING (true) WITH CHECK (true);

-- Create trigger function for updating timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = TIMEZONE('utc'::text, NOW());
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updating timestamps
CREATE TRIGGER update_competitor_findings_updated_at BEFORE UPDATE ON competitor_findings
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_competitor_analysis_updated_at BEFORE UPDATE ON competitor_analysis
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column(); 