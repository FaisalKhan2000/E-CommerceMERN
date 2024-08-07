import { RootState } from "../app/store";
import {
  Elements,
  PaymentElement,
  useElements,
  useStripe,
} from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { useDispatch, useSelector } from "react-redux";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { useNewOrderMutation } from "../app/services/orderAPI";
import { FormEvent, useState } from "react";
import { NewOrderRequest } from "../types/api-types";
import toast from "react-hot-toast";
import { responseToast } from "../utils/features";
import { resetCart } from "../app/features/cartSlice";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_KEY);
// const stripePromise = loadStripe(
//   "pk_test_51OzEfuSB91cvFDQcevZ4kNG4zBHEiq0POaM3q97LR8vCTWX5HVEANERVqpl2lH8YhoU93qnV62BCcOYyvRcDyNTx00X9o265Rk"
// );

const CheckoutForm = () => {
  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { user } = useSelector((state: RootState) => state.user);

  const {
    shippingInfo,
    cartItems,
    subTotal,
    tax,
    discount,
    shippingCharges,
    total,
  } = useSelector((state: RootState) => state.cart);

  const [isProcessing, setIsProcessing] = useState<boolean>(false);

  const [newOrder] = useNewOrderMutation();

  const submitHandler = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!stripe || !elements) return;
    setIsProcessing(true);

    const orderData: NewOrderRequest = {
      shippingInfo,
      orderItems: cartItems,
      subtotal: subTotal,
      tax,
      discount,
      shippingCharges,
      total,
      user: user?._id!,
    };

    const { paymentIntent, error } = await stripe?.confirmPayment({
      elements,
      confirmParams: { return_url: window.location.origin },
      redirect: "if_required",
    });

    if (error) {
      setIsProcessing(false);
      return toast.error(error.message || "Something Went Wrong");
    }

    if (paymentIntent.status === "succeeded") {
      const res = await newOrder(orderData);
      dispatch(resetCart());
      responseToast(res, navigate, "/orders");
    }
    setIsProcessing(false);
  };

  return (
    <div className="checkout-container">
      <form onSubmit={submitHandler}>
        <PaymentElement />
        <button type="submit" disabled={isProcessing}>
          {isProcessing ? "Processing..." : "Pay"}
        </button>
      </form>
    </div>
  );
};

const Checkout = () => {
  const location = useLocation();
  const clientSecret: string | undefined = location.state;
  if (!clientSecret) return <Navigate to={"/shipping"} />;
  return (
    <Elements
      stripe={stripePromise}
      options={{
        clientSecret,
      }}
    >
      <CheckoutForm />
    </Elements>
  );
};
export default Checkout;
