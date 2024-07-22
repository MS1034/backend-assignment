import express from "express";
import itemsRoute from "./routes/ItemsRoute.js"
import { globalErrorHandler, routeNotFound } from "./utils/ErrorHandler.js";
import createTable from "./utils/Schema.js";
import cors from 'cors';

const app = express()
const PORT = 5000

app.use(express.json())
app.use(cors())
app.use("/api/v1", itemsRoute);


app.use(routeNotFound)
app.use(globalErrorHandler)

app.listen(PORT, () => { console.log(`Server listening on port = ${PORT}`); createTable(); })