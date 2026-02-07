-- Add soft-delete columns to chat_rooms
ALTER TABLE chat_rooms ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMPTZ;
ALTER TABLE chat_rooms ADD COLUMN IF NOT EXISTS deleted_by UUID REFERENCES users(id);
