import express from "express"
import "dotenv/config";
import cors from 'cors'
import {clerkMiddleware} from '@clerk/express'
import clerkWebhooks from "./src/controllers/clerkWebhooks.js";
const app = express();

app.use(express.json())
// app.use(clerkMiddleware())
app.use(cors());

// app.post('/user',async(req,res) => {
//     const {name,email,password,role} = req.body

//     const NewUser =  await prisma.user.create({
//         data:{
//             name:name,
//             email:email,
//             password:password,
//             role:role
//         }
//     })
//     res.send(NewUser)
// })
// app.use("/api/clerk" , clerkWebhooks)
app.get('/',(req,res) => res.send("hello doston"));

const PORT = process.env.PORT||5000

app.listen(PORT , () => console.log(`server listen ${PORT} Sccessfully`))