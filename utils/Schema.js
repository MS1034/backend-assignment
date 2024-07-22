import getClient from "../database/connection.js";


export default async function createTable() {
    const client = await getClient();
    try {
        const checkTableQuery = `
            SELECT to_regclass('public.topics') AS existing_table
        `;
        const result = await client.query(checkTableQuery);

        if (result.rows[0].existing_table !== null) {
            console.log('Table topics already exists.');
            return;
        }

        const createTableQuery = `
            CREATE TABLE topics (
                id SERIAL PRIMARY KEY,
                title VARCHAR(100)  NOT NULL,
                time INTEGER NOT NULL,
                link VARCHAR(2048)  NOT NULL,
                is_visible BOOLEAN DEFAULT true,
                updated_at TIMESTAMP,
                created_at TIMESTAMP DEFAULT NOW()
                CONSTRAINT min_length_check CHECK (LENGTH(title) >= 5)
                CONSTRAINT valid_link_format CHECK (link ~* '^(?:(?:https?|ftp):\/\/)?(?:www\.)?[a-z0-9-]+(?:\.[a-z0-9-]+)+[^\s]*$')
            )
        `;
        await client.query(createTableQuery);
        console.log('Table topics created successfully!');
    } catch (err) {
        console.error('Error creating table:', err.message);
    } finally {
        console.log("I am closed")
        client.end();
    }
}