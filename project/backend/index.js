const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv").config();
const mongoose = require("mongoose");
const Stripe = require("stripe");

const app = express();
app.use(cors());
app.use(express.json({ limit: "10mb" }));

const PORT = process.env.PORT || 8000;

// MongoDB connection
mongoose.set("strictQuery", false);
mongoose
  .connect(process.env.MONGODB_URL)
  .then(() => console.log("Connected to the database"))
  .catch((err) => console.log(err));

// SCHEMA & MODELS
const userSchema = mongoose.Schema({
  firstName: String,
  lastName: String,
  email: { type: String, unique: true },
  password: String,
  confirmPassword: String,
  image: String,
});
const UserModel = mongoose.model("user", userSchema);

const productSchema = mongoose.Schema({
  name: String,
  category: String,
  image: String,
  price: String,
  description: String,
});
const ProductModel = mongoose.model("product", productSchema);

const contactSchema = mongoose.Schema({
  name: String,
  email: String,
  phone: String,
  message: String,
  date: { type: Date, default: Date.now },
});
const ContactModel = mongoose.model("contact", contactSchema);

const addressSchema = mongoose.Schema({
  name: String,
  email: String,
  phone: String,
  street: String,
  city: String,
  state: String,
  postalCode: String,
  date: { type: Date, default: Date.now },
});
const AddressModel = mongoose.model("address", addressSchema);

const orderSchema = mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "user", required: true },
  cartItems: [
    {
      productId: { type: mongoose.Schema.Types.ObjectId, ref: "product", required: true },
      qty: { type: Number, required: true, min: 1 },
      price: { type: Number, required: true },
    },
  ],
  totalAmount: Number,
  orderDate: { type: Date, default: Date.now },
  orderStatus: {
    type: String,
    enum: ["Pending", "Processing", "Shipped", "Delivered", "Cancelled"],
    default: "Pending",
  },
});
const OrderModel = mongoose.model("order", orderSchema);

const feedbackSchema = mongoose.Schema({
  name: String,
  email: String,
  phone: String,
  productName: String,
  rating: String,
  comment: String,
  date: { type: Date, default: Date.now },
});
const FeedbackModel = mongoose.model("feedback", feedbackSchema);

// ROUTES
app.get("/", (req, res) => res.send("Server is running"));

// Signup
app.post("/signup", async (req, res) => {
  try {
    const { email } = req.body;
    const exists = await UserModel.findOne({ email });
    if (exists) return res.send({ message: "Email is already registered", alert: false });

    const newUser = new UserModel(req.body);
    await newUser.save();
    res.send({ message: "Registration successful", alert: true });
  } catch (err) {
    res.status(500).send({ message: "An error occurred" });
  }
});

// Login
app.post("/login", async (req, res) => {
  try {
    const user = await UserModel.findOne({ email: req.body.email });
    if (user) {
      const data = {
        _id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        image: user.image,
      };
      res.send({ message: "Login successful", alert: true, data });
    } else {
      res.send({ message: "Email not found", alert: false });
    }
  } catch (err) {
    res.status(500).send({ message: "An error occurred" });
  }
});

// Get all users
app.get("/allusers", async (req, res) => {
  try {
    const users = await UserModel.find();
    res.send({ message: "Users fetched", alert: true, data: users });
  } catch {
    res.status(500).send({ message: "Error fetching users" });
  }
});

// Upload Product
app.post("/uploadProduct", async (req, res) => {
  try {
    const product = new ProductModel(req.body);
    await product.save();
    res.send({ message: "Product uploaded successfully" });
  } catch {
    res.status(500).send({ message: "Error uploading product" });
  }
});

// Get Products
app.get("/product", async (req, res) => {
  try {
    const data = await ProductModel.find();
    res.json(data);
  } catch {
    res.status(500).json({ message: "Error retrieving products" });
  }
});

// Contact
app.post("/contact", async (req, res) => {
  try {
    const { email } = req.body;
    const userExists = await UserModel.findOne({ email });
    if (userExists) {
      const contact = new ContactModel(req.body);
      await contact.save();
      res.status(201).json({ message: "Contact submitted successfully" });
    } else {
      res.status(400).json({ message: "User not found" });
    }
  } catch {
    res.status(500).json({ message: "Server error" });
  }
});

app.get("/allcontacts", async (req, res) => {
  try {
    const contacts = await ContactModel.find();
    res.send({ message: "Data fetched", alert: true, data: contacts });
  } catch {
    res.status(500).send({ message: "Error fetching data" });
  }
});

// Stripe Checkout
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

app.post("/create-checkout-session", async (req, res) => {
  try {
    const session = await stripe.checkout.sessions.create({
      submit_type: "pay",
      mode: "payment",
      payment_method_types: ["card"],
      billing_address_collection: "auto",
      shipping_options: [{ shipping_rate: "shr_1Q6xI7RxZdHdwLQKxHBETndM" }],
      line_items: req.body.map((item) => ({
        price_data: {
          currency: "inr",
          product_data: { name: item.name },
          unit_amount: item.price * 100,
        },
        adjustable_quantity: { enabled: true, minimum: 1 },
        quantity: item.qty,
      })),
      success_url: `${process.env.FRONTEND_URL}/success`,
      cancel_url: `${process.env.FRONTEND_URL}/cancel`,
    });
    res.status(200).json(session.id);
  } catch (err) {
    res.status(err.statusCode || 500).json(err.message);
  }
});

// Address
app.post("/address", async (req, res) => {
  try {
    const userExists = await UserModel.findOne({ email: req.body.email });
    if (userExists) {
      const address = new AddressModel(req.body);
      await address.save();
      res.status(201).json({ message: "Address submitted" });
    }
  } catch {
    res.status(500).json({ message: "Server error" });
  }
});

app.get("/address", async (req, res) => {
  try {
    const address = await AddressModel.findOne({ email: req.query.email });
    if (!address) return res.status(404).json({ message: "Address not found" });
    res.json(address);
  } catch {
    res.status(500).json({ message: "Server error" });
  }
});

app.get("/addresses", async (req, res) => {
  try {
    const addresses = await AddressModel.find();
    res.json(addresses);
  } catch {
    res.status(500).json({ message: "Error fetching addresses" });
  }
});

// Orders
app.post("/order", async (req, res) => {
  const { userId, cartItems, totalAmount } = req.body;
  if (!userId || !cartItems || !totalAmount) {
    return res.status(400).json({ message: "Missing fields" });
  }

  try {
    const order = new OrderModel({ userId, cartItems, totalAmount });
    await order.save();
    res.status(201).json({ message: "Order created", orderId: order._id });
  } catch {
    res.status(500).json({ message: "Order creation failed" });
  }
});

app.get("/orders", async (req, res) => {
  try {
    const orders = await OrderModel.find()
      .populate("userId", "firstName lastName email")
      .populate("cartItems.productId", "name price");
    res.json(orders);
  } catch {
    res.status(500).json({ error: "Failed to fetch orders" });
  }
});

 ​:contentReference[oaicite:0]{index=0}​
