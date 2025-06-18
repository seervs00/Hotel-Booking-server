import prisma from "../configs/db.config.js";

const registerHotel = async(req,res ) =>{

try{
    const {address,city,contact,name} = req.body
    const owner = req.user.id

//check if user is already registered
const existingHotel = await prisma.hotel.findFirst({where:{ownerId:owner}})

if(existingHotel){
   return  res.json({success:false ,message:"hotel already registered"})
}
//create nre user
 const Hotel = await prisma.hotel.create({
    data: {
      ownerId: owner,
      address,
      name,
      contact,
      city
    },
    include: {
      owner: true
    }
  });
  //update the role of user
await prisma.user.update({
    where:{id:owner},
    data:{role:"hotelOwner"}
})

res.json({success:true,message:"register successfully"})
}

catch(err){
    res.json({success:false,message:err.message})
}
}

export default registerHotel;