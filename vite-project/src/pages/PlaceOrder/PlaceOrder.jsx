import { useContext, useEffect, useState } from "react";
import "./PlaceOrder.css";
import { StoreContext } from "../../context/StoreContext";
import axios from "axios";
import { useNavigate } from 'react-router-dom';

const PlaceOrder = () => {
  const { getTotalCartAmount, cartItems, food_list, token } =
    useContext(StoreContext);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    street: "",
    city: "",
    state: "",
    zip: "",
    country: "",
    phone: "",
  });

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const createOrder = async () => {
    const deliveryFee = getTotalCartAmount() === 0 ? 0 : 40;
    const orderAmount = getTotalCartAmount() + deliveryFee;

    const items = food_list
      .filter((item) => cartItems[item._id] > 0)
      .map((item) => ({
        _id: item._id,
        name: item.name,
        price: item.price,
        quantity: cartItems[item._id],
      }));

    const address = {
      ...formData,
    };

    try {
      const res = await axios.post(
        "http://localhost:4000/api/order/place",
        {
          token,
          items,
          amount: orderAmount,
          address,
        },
        {
          headers: {
            token: token,
          },
        }
      );

      const { razorpayOrderId, amount, currency, orderId } = res.data;

      const options = {
        key: import.meta.env.VITE_RAZORPAY_API_KEY,
        amount: amount,
        currency: currency,
        name: "Food Ordering App",
        description: "Test Transaction",
        order_id: razorpayOrderId,
        handler: async function () {
          try {
            const verifyRes = await axios.post(
              "http://localhost:4000/api/order/verify",
              { orderId: orderId },
              { headers: { token } }
            );

            if (verifyRes.data.success) {
              alert("Payment Successful!");
            } else {
              alert(
                `Payment captured, but server verification failed. Please contact support`
              );
            }
          } catch (error) {
            console.log("error", error);
            alert(
              `Payment captured, but failed to contact verification server. Please contact support`
            );
          }
        },
        prefill: {
          name: `${formData.firstName} ${formData.lastName}`,
          email: formData.email,
          contact: formData.phone,
        },
        theme: {
          color: "#3399cc",
        },
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (err) {
      console.error("Order creation failed:", err);
      alert("Failed to place order");
    }
  };

  const navigate=useNavigate();

  useEffect(() => {
    if(!token){
         navigate('/cart')
    }
    else if(getTotalCartAmount()===0){
        navigate('/cart')
    }
  }, [token]);

  return (
    <form
      className="place-order"
      onSubmit={(e) => {
        e.preventDefault();
        createOrder();
      }}
    >
      <div className="place-order-left">
        <p className="title">Delivery Information</p>
        <div className="multi-fields">
          <input
            type="text"
            name="firstName"
            placeholder="First name"
            required
            onChange={handleInputChange}
          />
          <input
            type="text"
            name="lastName"
            placeholder="Last name"
            required
            onChange={handleInputChange}
          />
        </div>
        <input
          type="email"
          name="email"
          placeholder="Email address"
          required
          onChange={handleInputChange}
        />
        <input
          type="text"
          name="street"
          placeholder="Street"
          required
          onChange={handleInputChange}
        />
        <div className="multi-fields">
          <input
            type="text"
            name="city"
            placeholder="City"
            required
            onChange={handleInputChange}
          />
          <input
            type="text"
            name="state"
            placeholder="State"
            required
            onChange={handleInputChange}
          />
        </div>
        <div className="multi-fields">
          <input
            type="text"
            name="zip"
            placeholder="Zip code"
            required
            onChange={handleInputChange}
          />
          <input
            type="text"
            name="country"
            placeholder="Country"
            required
            onChange={handleInputChange}
          />
        </div>
        <input
          type="tel"
          name="phone"
          placeholder="Phone"
          required
          onChange={handleInputChange}
        />
      </div>

      <div className="place-order-right">
        <div className="cart-total">
          <h2>Cart Totals</h2>
          <div>
            <div className="cart-total-details">
              <p>Subtotal</p>
              <p>₹{getTotalCartAmount()}</p>
            </div>
            <hr />
            <div className="cart-total-details">
              <p>Delivery Fee</p>
              <p>₹{getTotalCartAmount() === 0 ? 0 : 40}</p>
            </div>
            <hr />
            <div className="cart-total-details">
              <b>Total</b>
              <b>
                ₹{getTotalCartAmount() === 0 ? 0 : getTotalCartAmount() + 40}
              </b>
            </div>
          </div>
          <button type="submit">PROCEED TO PAYMENT</button>
        </div>
      </div>
    </form>
  );
};

export default PlaceOrder;
