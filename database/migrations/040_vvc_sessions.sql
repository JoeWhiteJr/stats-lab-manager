-- VVC (Vasu's Vibe Coding) sessions table
CREATE TABLE vvc_sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    session_date DATE,
    video_url TEXT,
    video_path TEXT,
    transcript TEXT,
    summary TEXT,
    notes TEXT,
    images JSONB DEFAULT '[]'::jsonb,
    created_by UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMPTZ DEFAULT NULL,
    deleted_by UUID REFERENCES users(id)
);

CREATE INDEX idx_vvc_sessions_date ON vvc_sessions(session_date DESC) WHERE deleted_at IS NULL;

CREATE TRIGGER update_vvc_sessions_updated_at
    BEFORE UPDATE ON vvc_sessions FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- VVC member projects showcase
CREATE TABLE vvc_projects (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    project_url TEXT,
    screenshot_path TEXT,
    created_by UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMPTZ DEFAULT NULL,
    deleted_by UUID REFERENCES users(id)
);

CREATE INDEX idx_vvc_projects_created ON vvc_projects(created_at DESC) WHERE deleted_at IS NULL;

CREATE TRIGGER update_vvc_projects_updated_at
    BEFORE UPDATE ON vvc_projects FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Seed initial VVC resources into site_content
INSERT INTO site_content (section, key, value) VALUES
  ('vvc_resources', 'setup_guide', '"# Setting Up Claude Code\n\n1. Install Claude Code via the CLI\n2. Configure your API key\n3. Open a terminal in your project directory\n4. Run `claude` to start a session\n\n## Tips\n- Use `/help` to see available commands\n- Start with small, well-defined tasks\n- Review generated code before accepting"'::jsonb),
  ('vvc_resources', 'best_practices', '"# Best Practices for Vibe Coding\n\n1. **Start with a clear prompt** — Describe what you want to build\n2. **Iterate incrementally** — Break large tasks into smaller steps\n3. **Review and understand** — Always read the generated code\n4. **Use context wisely** — Reference existing files and patterns\n5. **Test as you go** — Verify each change before moving on"'::jsonb)
ON CONFLICT (section, key) DO NOTHING;
