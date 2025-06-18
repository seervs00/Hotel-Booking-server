import prisma from "../configs/db.config.js"

export  const protact = async(req,res,next) => {
    const {userId} = req.auth();
     
    if(!userId) {
        res.json({success:false, message:"unauthorize user"})
    }
    else{
        const user = await prisma.user.findUnique(
            {where:{clerkId:userId}
        })
        req.user = user;
        next()
    }



   
    "?"
}