import { useParams } from "react-router-dom";

const OrderDetails = () => {
  const { id } = useParams();
  return <div>Order ID: {id}</div>;
};

export default OrderDetails;
