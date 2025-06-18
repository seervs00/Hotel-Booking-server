import prisma from "../configs/db.config.js"
import { Webhook } from "svix";
 
const clerkWebhooks = async(req,res) => {
    try{
        const whook = new Webhook(process.env.CLERK_WEBHOOK_SECRET)
        
        const headers ={
            "svix-id":req.headers['svix-id'],
            'svix-timestamp':req.headers['svix-timestamp'],
            'svix-signature':req.headers['svix-signature'],     
          }

       await whook.verify(JSON.stringify(req.body),headers);
       
       const {data ,type} = req.body
       
       
    console.log(userData)
       switch(type){
        case "user.created":{
            const userData = {
                clerkId:data.id,
                email:data.email_addresses[0].email_address,
                username: data.first_name + " " + data.last_name,
                image:data.image_url,
               }
            await prisma.user.create({data:userData})
            break;
        }
        case "user.updated":{
            const userData = {
                clerkId:data.id,
                email:data.email_addresses[0].email_address,
                username: data.first_name + " " + data.last_name,
                image:data.image_url,
               }
      await prisma.user.update({
           where:{ clerkId: data.id },
           data:userData
            })
         break;

        }
        case "user.deleted":{
            const userData = {
                clerkId:data.id,
                email:data.email_addresses[0].email_address,
                username: data.first_name + " " + data.last_name,
                image:data.image_url,
               }
            await prisma.user.delete({
                where:{ clerkId: data.id }
            })
            break;
        }
        default:
            break;
       }
      
       res.json({success:true ,message:"webhook recieved"})

    }

    catch(error){
        console.log(error.message)
        res.json({success: false , message:error.message})
     
    }
}

export default clerkWebhooks; 