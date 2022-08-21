import Axios from "axios";
import { showAlert } from "./alerts";
import Stripe from "stripe";

const stripe = Stripe("<PUBLIC_STRIPE_API_KEY>");

export const bookTour = async (tourId) => {
    try {
        const session = await Axios(
            `http://127.0.0.1:3000/api/v1/bookings/checout-session/${tourId}`
        );

        await stripe.redirectToCheckout({
            sessionId: session.data.session.id,
        });
    } catch (err) {
        showAlert("error", err);
    }
};
