import Client from "pg/lib/client.js";

const getClient = async () => {
    const client = new Client({
        user: process.env.DB_USER || 'postgres',
        host: process.env.DB_HOST || 'localhost',
        database: process.env.DB_NAME || 'js-course',
        password: process.env.DB_PASSWORD || '1234',
        port: process.env.DB_PORT || 5432,
    });
    await client.connect();
    return client;
};

export default getClient;
