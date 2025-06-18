import Stripe from "stripe"
import prisma from "../configs/db.config";



export const stripeWebhooks = async(request,response) => {
    //stripe gateway initilize
    const stripeInstance = new Stripe(process.env.STRIPE_SECRET_KEY);
    const sig = request.headers['stripe-signature'];
    let event;
    try{
        event = stripeInstance.webhooks.constructEvent(request.body,sig,process.env.STRIPE_WEBHOOK_SECRET);

    }
    catch(err){
        response.status(400).send(`Webhook Error: ${err.message}`)
    }

    if(event.type ==='payment_intent.succeeded'){
        const paymentIntent = event.data.object;
        const paymentIntentId = paymentIntent.id;
    //metadata
      const session = await stripeInstance.checkout.sessions.list({
        payment_intent:paymentIntentId
      });
      const {bookingId} = session.data[0].metadata

      await prisma.booking.update({
        where:{id:Number(bookingId)},
        data:{
            isPaid:true,
            paymentMethod:'Stripe'
        }
      });
    }
    else{
        console.log('unheandled event type:',event.type)
    }
    response.json({received:true})
}