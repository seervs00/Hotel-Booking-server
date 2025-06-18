import express from "express"
import { protact } from "../middleware/auth.js";
import { getUserData, storeRecentSearchedCities } from "../controllers/useCnotroller.js";

const userRouter  = express.Router();

userRouter.get('/',protact,getUserData);
userRouter.post("/store-recent-search" , protact,storeRecentSearchedCities)

export default userRouter