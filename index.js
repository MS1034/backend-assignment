import express from "express";
import itemsRoute from "./routes/ItemsRoute.js"
import { globalErrorHandler, routeNotFound } from "./utils/ErrorHandler.js";
import createTable from "./utils/Schema.js";
import cors from 'cors';
import morgan from "morgan";
import dotenv from "dotenv";

dotenv.config({ path: `./configs/.env.${process.env.NODE_ENV}` })

const app = express()
const PORT = process.env.SERVER_PORT || 5000
const BASE_URI = '/api/v1'



if (process.env.NODE_ENV === 'dev') {
    app.use(morgan('dev'));
}

app.use(express.json())
app.use(cors())

app.use(BASE_URI + "/items", itemsRoute);


app.use(routeNotFound)
app.use(globalErrorHandler)

app.listen(PORT, () => { console.log(`Server listening on port = ${PORT}`); createTable(); })