import express from "express";
import { upload } from "../middleware/uploadmiddleware.js";
import { createRooms, getOwnerRooms, getRooms, ToggleAvailabilityRooms } from "../controllers/roomController.js";
import { protact } from "../middleware/auth.js";

const roomRouter = express.Router();

roomRouter.post("/",upload.array("images",4),protact,createRooms)

roomRouter.get("/",getRooms);
roomRouter.get("/owner",protact,getOwnerRooms);
roomRouter.post("/toggle-Availability",protact,ToggleAvailabilityRooms);
export default roomRouter