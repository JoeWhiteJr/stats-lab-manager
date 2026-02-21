-- Lab news table
CREATE TABLE lab_news (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255) NOT NULL,
    body TEXT NOT NULL,
    created_by UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX idx_lab_news_created ON lab_news(created_at DESC);
CREATE TRIGGER update_lab_news_updated_at
    BEFORE UPDATE ON lab_news FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Seed lab dashboard site_content
INSERT INTO site_content (section, key, value) VALUES
  ('lab_dashboard', 'goal', '"Our mission is to advance statistical research through collaboration, mentorship, and hands-on learning."'::jsonb),
  ('resources', 'contact_info', '"# Contact\n\nEmail: statslab@example.com"'::jsonb),
  ('resources', 'learning_links', '[]'::jsonb)
ON CONFLICT (section, key) DO NOTHING;
