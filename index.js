import express from "express";
import itemsRoute from "./routes/ItemsRoute.js"
import {globalErrorHandler,routeNotFound} from "./utils/ErrorHandler.js";

const app = express()   
const PORT = 5000   

app.use(express.json())
app.use("/api/v1", itemsRoute);


app.use(routeNotFound)
app.use(globalErrorHandler)

app.listen(PORT, ()=> console.log(`Server listening on port = ${PORT}`))