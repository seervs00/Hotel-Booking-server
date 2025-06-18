import express from "express"
import { checkAvailabilityApi, createBooking, getHotelBooking, getUserBookings, stripePayment } from "../controllers/bookingController.js";
import { protact } from "../middleware/auth.js";

const bookingRouter = express.Router();

bookingRouter.post("/check-availability",checkAvailabilityApi);
bookingRouter.post("/book",protact, createBooking);
bookingRouter.get("/user",protact, getUserBookings);
bookingRouter.get("/hotel",protact, getHotelBooking);
bookingRouter.post('/stripe-payment',protact,stripePayment);


export default bookingRouter