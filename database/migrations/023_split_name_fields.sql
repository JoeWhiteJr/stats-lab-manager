-- Split name into first_name + last_name for users and applications tables
-- name becomes a generated column so all existing SELECT / .name references keep working

-- ============ USERS TABLE ============

-- 1. Add new columns (nullable for backfill)
ALTER TABLE users ADD COLUMN first_name VARCHAR(255);
ALTER TABLE users ADD COLUMN last_name VARCHAR(255);

-- 2. Backfill from existing name (split on first space)
UPDATE users SET
  first_name = CASE
    WHEN position(' ' IN name) > 0 THEN left(name, position(' ' IN name) - 1)
    ELSE name
  END,
  last_name = CASE
    WHEN position(' ' IN name) > 0 THEN substring(name FROM position(' ' IN name) + 1)
    ELSE ''
  END;

-- 3. Set NOT NULL
ALTER TABLE users ALTER COLUMN first_name SET NOT NULL;
ALTER TABLE users ALTER COLUMN last_name SET NOT NULL;

-- 4. Drop the old name column
ALTER TABLE users DROP COLUMN name;

-- 5. Re-create name as a generated column
ALTER TABLE users ADD COLUMN name VARCHAR(255) GENERATED ALWAYS AS (
  CASE WHEN last_name = '' THEN first_name ELSE first_name || ' ' || last_name END
) STORED;


-- ============ APPLICATIONS TABLE ============

-- 1. Add new columns (nullable for backfill)
ALTER TABLE applications ADD COLUMN first_name VARCHAR(255);
ALTER TABLE applications ADD COLUMN last_name VARCHAR(255);

-- 2. Backfill from existing name
UPDATE applications SET
  first_name = CASE
    WHEN position(' ' IN name) > 0 THEN left(name, position(' ' IN name) - 1)
    ELSE name
  END,
  last_name = CASE
    WHEN position(' ' IN name) > 0 THEN substring(name FROM position(' ' IN name) + 1)
    ELSE ''
  END;

-- 3. Set NOT NULL
ALTER TABLE applications ALTER COLUMN first_name SET NOT NULL;
ALTER TABLE applications ALTER COLUMN last_name SET NOT NULL;

-- 4. Drop old name column
ALTER TABLE applications DROP COLUMN name;

-- 5. Re-create name as a generated column
ALTER TABLE applications ADD COLUMN name VARCHAR(255) GENERATED ALWAYS AS (
  CASE WHEN last_name = '' THEN first_name ELSE first_name || ' ' || last_name END
) STORED;
