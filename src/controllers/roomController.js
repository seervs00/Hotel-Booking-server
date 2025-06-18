import prisma from "../configs/db.config.js"
import {v2 as cloudinary} from "cloudinary"

//Create a new room for hotel
export  const createRooms  = async(req,res) => {
try{
    const {amenities,roomType,pricePerNight,} = req.body

    const Hotel = await prisma.hotel.findFirst({where:{owner:{clerkId:req.auth.userId}}})
    if(!Hotel) return req.json({success:false,message:"No hotel found"})

        //upload cloudinary 
    const uploadImages = req.files.map(async(file) =>{
        const response =  await cloudinary.uploader.upload(file.path);
        return response.secure_url;
    });
   const images = await Promise.all(uploadImages);
  //create a room model
   await prisma.room.create({
    data:{
        hotelId:Hotel.id,
        roomType,
        pricePerNight:+pricePerNight,
        amenities :JSON.parse(amenities),
        images
    }
   })
     res.json({success:true ,message:"room create successfully"})
}
catch(err){
     res.json({success:false,message:err.message}) 
}
}

//get all  room
export const getRooms = async(req,res) => {
    try{
        const rooms = await prisma.room.findMany({
            where: {
              isAvailable: true,
            },
            orderBy: {
              created_at: 'desc',
            },
            include: {
              hotel: {
                include: {
                  owner: {
                    select: {
                      image: true,
                    },
                  },
                },
              },
            },
          });
          res.json({success:true ,message:"all room data",rooms})
          
    }
    catch(err){
       res.json({success:false,message:err.message});
    }

}

// get the  specific hotel  room
export const getOwnerRooms = async(req,res) => {
   try{
    const hotelWithRooms = await prisma.hotel.findFirst({
      where: {
        owner: {
          clerkId: req.auth.userId
        }
      },
      include: {
        rooms: true
      }
    });
    
    if (!hotelWithRooms) {
      return res.status(404).json({ error: "No hotel found for this user." });
    }
    res.json({success:true,message:"get owner all room",hotelWithRooms})
   }
   catch(err){
      res.json({success:false,message:err.message})
   }
}

// toggle availability of a room
export const ToggleAvailabilityRooms = async(req,res) => {

  try{
    const {roomId} = req.body;
    const roomData = await prisma.room.findFirst({
      where:{id:roomId}
    });
   
    await prisma.room.update({
      where:{id:roomId},
      data:{isAvailable: !roomData.isAvailable}
    });
    res.json({success:true,message:"Room Availability updated"})
  }
  catch(err){
    res.json({success:false,message:err.message})
  }
}