import express from "express"
import "dotenv/config";
import cors from 'cors'
import {clerkMiddleware} from '@clerk/express'
import clerkWebhooks from "./src/controllers/clerkWebhooks.js";
import userRouter from "./src/routes/userRouter.js";
import hotelRouter from "./src/routes/hotelRouter.js";
import connectCloudinary from "./src/configs/cloudinary.js";
import roomRouter from "./src/routes/roomRouter.js";
import bookingRouter from "./src/routes/bookingRouter.js";
const app = express();
connectCloudinary()
app.use(express.json())
app.use(clerkMiddleware())
app.use(cors());


app.get('/',(req,res) => res.send("hello doston"));

app.use("/api/clerk" , clerkWebhooks)
app.use('/api/user' ,userRouter);
app.use('/api/hotels',hotelRouter);
app.use("/api/rooms",roomRouter)
app.use("/api/bookings",bookingRouter)

export default app;
const PORT = process.env.PORT||3000

app.listen(PORT , () => console.log(`server listen ${PORT} Sccessfully`))
