import Stripe from "stripe";
import prisma from "../configs/db.config.js"
import transporter from "../configs/nodemailer.js";

//check  availability function
const checkAvailability = async ({ checkInDate, checkOutDate, roomId }) => {

  
   try{
    const bookings = await prisma.booking.findMany({
      where: {
        roomId: roomId,
        checkInDate: {
          lte: new Date(checkOutDate),  // ✅ Convert to Date object
        },
        checkOutDate: {
          gte: new Date(checkInDate),  // ✅ Convert to Date object
        },
      },
      });
    
      const isAvailable = bookings.length === 0;
      return isAvailable;
   }
   catch(err){
    console.error(err.message)
   }
  };

   //api check availability the room
  export const checkAvailabilityApi = async(req,res) => {
    try{
        const {checkInDate,checkOutDate,roomId} = req.body;
        const isAvailable =  await checkAvailability({checkInDate,checkOutDate,roomId});
        res.json({success:true,isAvailable})
    }
    catch(err){
        res.json({success:false,message:err.message})
    }
  };

  //api to create new booking
  export const createBooking = async(req,res)=>{
    try{
        const {checkInDate,checkOutDate,guests,roomId} = req.body
        const userId= req.user.id;
        //check availability of room
       const isAvailable = await checkAvailability({checkInDate,checkOutDate,roomId});

        if(!isAvailable){
          res.json({success:false,message:"room not available"});
          return;
        }
        //get Total price from room
        const roomData =  await prisma.room.findFirst({
          where:{id:roomId},
          include:{
            hotel:true
          }
        })
         
        let totalPrice = roomData.pricePerNight
        const checkIn = new Date(checkInDate);
        const checkOut = new Date(checkOutDate);
        const timeDiff = checkOut.getTime() - checkIn.getTime();
        const nights = Math.ceil(timeDiff/(1000*3600*24));

        totalPrice*= nights

        const booking = await prisma.booking.create({
          data:{
            checkInDate:checkIn,
            checkOutDate:checkOut,
            guests: +guests,
            roomId,
            userId,
            hotelId:roomData.hotel.id,
            totalPrice
          }
        });
          const mailOptions = {
         from:process.env.SENDER_EMAIL,
         to:req.user.email,
         subject:"Hotel Booking Detail",
         html:`
                 <h2> Your Booking Detail </h2>
                 <p> Dear ${req.user.username} </p>
                 <p> Thankyou for your booking! Here are you detail </p>
                 <ui>
                     <li> <strong>Booking ID:</strong> ${booking.id} </li>
                     <li> <strong>Hotel Name:</strong> ${roomData.hotel.name} </li>
                     <li> <strong>Location:</strong> ${roomData.hotel.address} </li>
                     <li> <strong>Date:</strong> ${booking.checkInDate.toDateString()}</li>
                     <li> <strong>Booking Amount:</strong> ${process.env.CURRENCY ||'$'} ${booking.totalPrice} /night </li>
                 </ui>
                 <p> We look forword to welcoming you!<p/>
                 <p>If you need to make any changes,feel free to connect. </p>
               `
          }
         await transporter.sendMail(mailOptions)

        res.json({success:true,message:"booking create successfully"})

    }
    catch(err){
      res.json({success:false,message:err.message});
    }
  }
//all booking for the user 

export const getUserBookings = async(req,res) => {
  try{
   const {userId} = req.user.id;
   const bookings = await prisma.booking.findMany({
    where:{
      userId:userId
    },
    orderBy:{
   created_at: 'desc'
    },
    include: {
      hotel: true,
      room: true
    }
   })

   res.json({success:true,bookings})
  }
  catch(err){
    res.json({success:false,message:err.message})
  }
}

//all booking for hotel
export const getHotelBooking = async(req,res) => {
  try{
    const  Hotel = prisma.hotel.findFirst({
      where:{ owner:{clerkId:req.auth.userId} }
    });
    //check hotel is available or not
    if(!Hotel) return res.json({success:false,message:"No hotel found"})

    const bookings = await prisma.booking.findMany({
      where:{hotelId:Hotel.id},
      orderBy:{
        created_at: 'desc'
         },
         include: {
          room: true,
          hotel: true,
          user: true,
        },
     
    })
     const  totalBookings = bookings.length;
     const totalRevenue = bookings.reduce((acc,bookings) => acc+bookings.totalPrice,0 );

    res.json({success:true,dashboardData:{bookings,totalRevenue,totalBookings}})
  }
  catch(err){
    res.json({success:false,message:err.message});
  }
}


//stripe payment 
export const stripePayment = async(req,res) => {
  try{
     const {bookingId} = req.body
    
     const booking = await prisma.booking.findFirst({
      where:{id:bookingId},  
     });
     if (!booking) {
      return res.status(404).json({ success: false, message: "Booking not found" });
    }
     const roomData = await prisma.room.findFirst({
      where:{id:booking.roomId},
      include:{
        hotel:true
      },
     })

     if (!roomData) {
      return res.status(404).json({ success: false, message: "Room not found" });
    }
     const totalPrice = booking.totalPrice
     const {origin} = req.headers;

     const stripeInstance = new Stripe(process.env.STRIPE_SECRET_KEY);

     const line_items =[
      {
        price_data:{
          currency:'usd',
          product_data:{
            name:roomData.hotel.name
          },
          unit_amount:totalPrice*100
        },
        quantity:1

      }
     ]

    
     // create checkout session
     const session = await stripeInstance.checkout.sessions.create({
      line_items,
      mode:'payment',
      success_url:`${origin}/loader/my-bookings`,
      cancel_url:`${origin}/my-bookings`,
      metadata:{
        bookingId
      }
     })

     res.json({success:true, url:session.url})

  }
  catch(err){
    res.json({success:false,message:"Payment faild please try latter"})
  }

}