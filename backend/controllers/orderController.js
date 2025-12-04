import Razorpay from "razorpay";
import orderModel from "../models/orderModel.js";
import userModel from "../models/userModel.js";
import jwt from "jsonwebtoken";
import "dotenv/config";

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_API_KEY,
  key_secret: process.env.RAZORPAY_API_SECRET,
});

const placeOrder = async (req, res) => {
  const frontend_url = "http://localhost:5173";

  try {
    const { token, items, amount, address } = req.body;
    console.log("decoded", token);
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.id;

    const newOrder = new orderModel({
      userId,
      items,
      amount,
      address,
    });
    await newOrder.save();

    await userModel.findByIdAndUpdate(userId, { cartData: {} });

    const options = {
      amount: Math.round(amount * 100), // Razorpay amount in paise
      currency: "INR",
      receipt: `receipt_order_${newOrder._id}`,
      payment_capture: 1, // auto capture
    };

    const order = await razorpay.orders.create(options);

    res.status(200).json({
      success: true,
      razorpayOrderId: order.id,
      amount: order.amount,
      currency: order.currency,
      orderId: newOrder._id,
    });
  } catch (error) {
    console.error("Error placing order:", error);
    res.status(500).json({ success: false, message: "Order placement failed" });
  }
};

const verifyOrder = async (req, res) => {
  try {
    const { orderId } = req.body;

    if (!orderId) {
      return res
        .status(400)
        .json({ success: false, message: "Order ID is required." });
    }

    const updatedOrder = await orderModel.findByIdAndUpdate(
      orderId,
      {
        payment: true,
        status: "paid",
      },
      { new: true }
    );

    // Check if an order was actually found and updated
    if (!updatedOrder) {
      return res
        .status(404)
        .json({ success: false, message: "Order not found." });
    }

    // Clear the user's cart after marking as paid
    await userModel.findByIdAndUpdate(updatedOrder.userId, { cartData: {} });

    res.status(200).json({
      success: true,
      message: "Order payment status updated successfully.",
      order: updatedOrder,
    });
  } catch (error) {
    console.error("Error updating order payment status:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update order status due to server error.",
    });
  }
};

//user orders for frontend
const userOrders = async (req, res) => {
  try {
    const orders = await orderModel.find({ userId: req.body.userId });
    res.json({ success: true, data: orders });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "error" });
  }
};

//Listing orders for admin panel
const listOrders = async (req, res) => {
  try {
    const orders = await orderModel.find({});
    res.json({ success: true, data: orders });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error" });
  }
};

//api for updating order status
const updateStatus = async (req, res) => {
  try {
    await orderModel.findByIdAndUpdate(req.body.orderId, {
      status: req.body.status,
    });
    res.json({ success: true, message: "Status Updated" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error" });
  }
};

export { placeOrder, verifyOrder, userOrders, listOrders, updateStatus };
