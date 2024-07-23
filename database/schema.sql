DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'user_role') THEN
        CREATE TYPE user_role AS ENUM ('admin', 'user');
    END IF;
END $$;


CREATE TABLE IF NOT EXISTS users
(
	id SERIAL PRIMARY KEY,
	email VARCHAR(250) UNIQUE NOT NULL,
	first_name VARCHAR(100)  NOT NULL,
	last_name VARCHAR(100) NOT NULL,
	role user_role NOT NULL,    
	password varchar(120)  NOT NULL,
    updated_at TIMESTAMP,
	created_at TIMESTAMP DEFAULT NOW()
	CONSTRAINT email_validation CHECK (email ~* '/^[^\s@]+@[^\s@]+\.[^\s@]+$/')
);

CREATE TABLE IF NOT EXISTS topics 
	(
	id SERIAL PRIMARY KEY,
	title VARCHAR(100)  NOT NULL,
	time INTEGER NOT NULL,
	link VARCHAR(2048)  NOT NULL,
	is_visible BOOLEAN DEFAULT true,
	created_by INT references users(id),
	updated_at TIMESTAMP,
	created_at TIMESTAMP DEFAULT NOW()
	CONSTRAINT min_length_check CHECK (LENGTH(title) >= 5)
	CONSTRAINT valid_link_format CHECK (link ~* '^(?:(?:https?|ftp):\/\/)?(?:www\.)?[a-z0-9-]+(?:\.[a-z0-9-]+)+[^\s]*$')
);

CREATE TABLE IF NOT EXISTS audit_log (
id serial PRIMARY KEY,
table_name TEXT,
record_id TEXT,
operation_type TEXT,
changed_at TIMESTAMP DEFAULT now(),
changed_by TEXT,
original_values jsonb,
new_values jsonb
);

CREATE OR REPLACE FUNCTION audit_trigger() RETURNS TRIGGER AS $$
DECLARE
    new_data jsonb;
    old_data jsonb;
    key text;
    new_values jsonb;
    old_values jsonb;
    user_id text;
BEGIN

    user_id := current_setting('audit.user_id', true);

    IF user_id IS NULL THEN
        user_id := current_user;
    END IF;

    new_values := '{}';
    old_values := '{}';

    IF TG_OP = 'INSERT' THEN
        new_data := to_jsonb(NEW);
        new_values := new_data;

    ELSIF TG_OP = 'UPDATE' THEN
        new_data := to_jsonb(NEW);
        old_data := to_jsonb(OLD);

        FOR key IN SELECT jsonb_object_keys(new_data) INTERSECT SELECT jsonb_object_keys(old_data)
        LOOP
            IF new_data ->> key != old_data ->> key THEN
                new_values := new_values || jsonb_build_object(key, new_data ->> key);
                old_values := old_values || jsonb_build_object(key, old_data ->> key);
            END IF;
        END LOOP;

    ELSIF TG_OP = 'DELETE' THEN
        old_data := to_jsonb(OLD);
        old_values := old_data;

        FOR key IN SELECT jsonb_object_keys(old_data)
        LOOP
            old_values := old_values || jsonb_build_object(key, old_data ->> key);
        END LOOP;

    END IF;

    IF TG_OP = 'INSERT' OR TG_OP = 'UPDATE' THEN
        INSERT INTO audit_log (table_name, record_id, operation_type, changed_by, original_values, new_values)
        VALUES (TG_TABLE_NAME, NEW.id, TG_OP, user_id, old_values, new_values);

        RETURN NEW;
    ELSE
        INSERT INTO audit_log (table_name, record_id, operation_type, changed_by, original_values, new_values)
        VALUES (TG_TABLE_NAME, OLD.id, TG_OP, user_id, old_values, new_values);

        RETURN OLD;
    END IF;
END;
$$ LANGUAGE plpgsql;



CREATE OR REPLACE TRIGGER audit_log_trigger
    BEFORE INSERT OR UPDATE OR DELETE 
    ON public.topics
    FOR EACH ROW
    EXECUTE FUNCTION audit_trigger(); 