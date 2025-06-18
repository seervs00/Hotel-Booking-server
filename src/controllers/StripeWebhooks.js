import Stripe from "stripe";
import prisma from "../configs/db.config.js";

const stripeInstance = new Stripe(process.env.STRIPE_SECRET_KEY);

export const stripeWebhooks = async (req, res) => {
  
  const sig = req.headers['stripe-signature'];

  let event;

  try {
    event = stripeInstance.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    return res.status(400).json({ success: false, message: `Webhook Error: ${err.message}` });
  }

  // ✅ Handle only checkout.session.completed
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;

    const bookingId = session.metadata?.bookingId;
    
    if (!bookingId) {
      return res.status(400).json({ success: false, message: "Missing bookingId in metadata" });
    }

    try {
      await prisma.booking.update({
        where: { id:Number(bookingId)},
        data: {
          isPaid: true,
          paymentMethod: 'Stripe',
        },
      });
     
    } catch (err) {
    
      return res.status(500).json({ success: false, message: "Database update failed" });
    }
  } else {
    console.log('Unhandled event type:', event.type);
  }

  res.json({ received: true });
};
