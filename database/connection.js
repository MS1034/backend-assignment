import Client from "pg/lib/client.js";

const getClient = async () => {
    const client = new Client({
        user: 'postgres',
        host: 'localhost',
        database: 'js-course',
        password: '1234',
        port: 5432,
    });
    await client.connect();
    return client;
};

export default getClient;
