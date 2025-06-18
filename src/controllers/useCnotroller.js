import prisma from "../configs/db.config.js";


export const getUserData = async(req,res) => {
    try{
        const user = req.user;
        const role = user.role;
        const recentSearchedCities = user.recentSearchedCities
        res.json({success:true ,role,recentSearchedCities})
    }
    catch(error){
        res.json({success:false,message:message.error})
    }
}

export const storeRecentSearchedCities = async(req,res) => {
    try{
        const {recentSearchedCity} = req.body
    const user =   req.user
     let updateCities = user.recentSearchedCities;
     //check duplicate
     if(updateCities.includes(recentSearchedCity)){
        updateCities = updateCities.filter((city) => city !== recentSearchedCity);
     }

     if(updateCities.length >=3){
        updateCities.shift();
     }
     updateCities.push(recentSearchedCity);
//update user data
    await prisma.user.update({
        where:{id: user.id},
        data:{recentSearchedCities:updateCities}
    }) 
    res.json({success:true ,message:"Recent search city updated"})
    }
    catch(err){
        console.json({success:false ,message:err.message})
    }

}