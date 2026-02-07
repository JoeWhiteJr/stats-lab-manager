CREATE TABLE IF NOT EXISTS token_blocklist (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  token_hash VARCHAR(64) NOT NULL,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS idx_token_blocklist_hash ON token_blocklist(token_hash);
CREATE INDEX IF NOT EXISTS idx_token_blocklist_expires ON token_blocklist(expires_at);
