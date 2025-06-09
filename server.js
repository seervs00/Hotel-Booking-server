import express from "express"
import "dotenv/config";
import cors from 'cors'
import {clerkMiddleware} from '@clerk/express'
import clerkWebhooks from "./src/controllers/clerkWebhooks.js";
const app = express();

app.use(express.json())
app.use(clerkMiddleware())
app.use(cors());



app.use("/api/clerk" , clerkWebhooks)
app.get('/',(req,res) => res.send("hello doston lorem10wqqqqqqqqqqqqqqqqq weedesffedfedfvdvdvedfeffeddvfvdvfvdvfbfvdvvfwedfwvfwrifjgvkg"));

// const PORT = process.env.PORT||3000

// app.listen(PORT , () => console.log(`server listen ${PORT} Sccessfully`))
export default app;
