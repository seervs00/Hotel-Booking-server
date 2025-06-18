import express from "express"
import { protact } from "../middleware/auth.js";
import registerHotel from "../controllers/hotelController.js";

const hotelRouter = express.Router();
hotelRouter.post("/",protact,registerHotel)

export default hotelRouter