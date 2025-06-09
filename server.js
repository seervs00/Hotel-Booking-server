// import express from "express"
// import "dotenv/config";
// import cors from 'cors'
// import {clerkMiddleware} from '@clerk/express'
// import clerkWebhooks from "./src/controllers/clerkWebhooks.js";
// const app = express();

// app.use(express.json())
// // app.use(clerkMiddleware())
// app.use(cors());



// // app.use("/api/clerk" , clerkWebhooks)
// app.get('/',(req,res) => res.send("hello doston"));

// // const PORT = process.env.PORT||3000

// // app.listen(PORT , () => console.log(`server listen ${PORT} Sccessfully`))
// export default app;
import express from "express";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello from Vercel backend! fkgbrl");
});

// 👇 IMPORTANT: export, don’t listen
export default app;