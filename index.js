import express from "express";
import itemsRoute from "./routes/ItemsRoute.js"
import usersRoute from "./routes/UserRoute.js"
import authRoute from "./routes/AuthRoute.js"
import { globalErrorHandler, routeNotFound } from "./utils/ErrorHandler.js";
import createTable from "./utils/Schema.js";
import cors from 'cors';
import dotenv from "dotenv";
import cookieSession from "cookie-session";
import morganBody from "morgan-body";

dotenv.config({ path: `./configs/.env.${process.env.NODE_ENV}` })

const app = express()
const PORT = process.env.SERVER_PORT || 5000
const BASE_URI = '/api/v1'


if (process.env.NODE_ENV === 'dev') {
    morganBody(app);

}

app.use(express.json())
app.use(cors())
app.use(
    cookieSession({
        name: "session",
        keys: [process.env.COOKIE_SESSION],
        httpOnly: true,
        maxAge: 10 * 1000,
    })
);

app.use(BASE_URI + "/items", itemsRoute);
app.use(BASE_URI + "/users", usersRoute);
app.use(BASE_URI + "/auth", authRoute);


app.use(routeNotFound)
app.use(globalErrorHandler)

app.listen(PORT, () => { console.log(`Server listening on port = ${PORT}`); createTable(); })