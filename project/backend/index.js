const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv").config();
const mongoose = require("mongoose");
const Stripe = require("stripe");

const app = express();
app.use(cors());
app.use(express.json({ limit: "10mb" }));

const PORT = process.env.PORT || 8000;

console.log(process.env.MONGODB_URL);
//mongodb connection
mongoose.set("strictQuery", false);
mongoose
  .connect(process.env.MONGODB_URL)
  .then(() => console.log("connnectd to the database"))
  .catch((err) => console.log(err));
//schema
const userSchema = mongoose.Schema({
  firstName: String,
  lastName: String,
  email: {
    type: String,
    unique: true,
  },
  password: String,
  confirmPassword: String,
  image: String,
});
//model
const userModel = mongoose.model("user", userSchema);
//api
app.get("/", (req, res) => {
  res.send("Server is running");
});

//signup api
app.post("/signup", async (req, res) => {
  console.log(req.body);
  const { email } = req.body;

  try {
    const result = await userModel.findOne({ email: req.body.email });

    if (result) {
      res.send({ message: "Email id is already registered", alert: false });
    } else {
      const data = new userModel(req.body);
      await data.save(); // Save the new user data
      res.send({ message: "Registration is successful", alert: true });
    }
  } catch (err) {
    console.error(err); // Log the error for debugging
    res.status(500).send({ message: "An error occurred" });
  }
});
//login api
app.post("/login", async (req, res) => {
  console.log(req.body);
  const { email } = req.body;
  try {
    const result = await userModel.findOne({ email: req.body.email });

    if (result) {
      const dataSend = {
        _id: result._id,
        firstName: result.firstName,
        lastName: result.lastName,
        email: result.email,
        image: result.image,
      };
      console.log(dataSend);
      res.send({
        message: "Login is Successfully",
        alert: true,
        data: dataSend,
      });
    } else {
      res.send({ message: "This email is not available", alert: false });
    }
  } catch (err) {
    console.error(err); // Log the error for debugging
    res.status(500).send({ message: "An error occurred" });
  }
});
app.get("/allusers", async (req, res) => {
  try {
    const users = await userModel.find(); // Fetch all users
    res.send({
      message: "Users fetched successfully",
      alert: true,
      data: users, // Send users data
    });
  } catch (err) {
    console.error(err); // Log error for debugging
    res.status(500).send({ message: "An error occurred while fetching users" });
  }
});

//product section

const schemaProduct = mongoose.Schema({
  name: String,
  category: String,
  image: String,
  price: String,
  description: String,
});
//
const productModel = mongoose.model("product", schemaProduct);

//save product in data
//api
app.post("/uploadProduct", async (req, res) => {
  // console.log(req.body)
  const data = await productModel(req.body);
  const datasave = await data.save();
  res.send({ message: "Upload successfully" });
});
//
app.get("/product", async (req, res) => {
  try {
    const data = await productModel.find({});
    res.json(data); // More efficient
  } catch (error) {
    res.status(500).json({ message: "Error retrieving products" });
  }
});

//constct
const contactSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
  date: { type: Date, default: Date.now },
});

const Contact = mongoose.model("Contact", contactSchema);

// POST route for saving contact form submissions
app.post("/contact", async (req, res) => {
  try {
    const { name, email, phone, message } = req.body;
    const result = await userModel.findOne({ email: req.body.email });

    if (result) {
      const data = await Contact(req.body);
      const datasave = await data.save();
      res.status(201).json({ message: "Submitted successfully" });
    }
  } catch (error) {
    console.error("Error submitting contact form:", error);
    res.status(500).json({ message: "Server error. Please try again." });
  }
});
app.get("/allcontacts", async (req, res) => {
  try {
    const complaints = await Contact.find(); // Fetch all contacts
    res.send({
      message: "Data fetched successfully",
      alert: true,
      data: complaints,
    });
  } catch (err) {
    console.error(err);
    res.status(500).send({ message: "An error occurred while fetching Data" });
  }
});

//payment

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

app.post("/create-checkout-session", async (req, res) => {
  try {
    const params = {
      submit_type: "pay",
      mode: "payment",
      payment_method_types: ["card"],
      billing_address_collection: "auto",
      shipping_options: [{ shipping_rate: "shr_1Q6xI7RxZdHdwLQKxHBETndM" }],

      line_items: req.body.map((item) => {
        return {
          price_data: {
            currency: "inr",
            product_data: {
              name: item.name,
              // images : [item.image]
            },
            unit_amount: item.price * 100,
          },
          adjustable_quantity: {
            enabled: true,
            minimum: 1,
          },
          quantity: item.qty,
        };
      }),
      success_url: `${process.env.FRONTEND_URL}/success`,
      cancel_url: `${process.env.FRONTEND_URL}/cancel`,
    };

    const session = await stripe.checkout.sessions.create(params);
    // console.log(session)
    res.status(200).json(session.id);
  } catch (err) {
    res.status(err.statusCode || 500).json(err.message);
  }
});

//adress
const addressSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
  },
  street: {
    type: String,
    required: true,
  },
  city: {
    type: String,
    required: true,
  },
  state: {
    type: String,
    required: true,
  },
  postalCode: {
    type: String,
    required: true,
  },

  date: { type: Date, default: Date.now },
});

const AddressModel = mongoose.model("Adress", addressSchema);
app.post("/address", async (req, res) => {
  try {
    const { name, email, phone, street, city, state, postal } = req.body;
    const result = await userModel.findOne({ email: req.body.email });

    if (result) {
      const data = await AddressModel(req.body);
      const datasave = await data.save();
      res.status(201).json({ message: "Submitted successfully" });
    }
  } catch (error) {
    console.error("Error submitting Address form:", error);
    res.status(500).json({ message: "Server error. Please try again." });
  }
});

app.get("/address", async (req, res) => {
  const { email } = req.query; // Assumes email is passed as a query parameter

  try {
    // Find the address associated with the email
    const address = await AddressModel.findOne({ email });

    if (!address) {
      return res.status(404).json({ message: "Address not found" });
    }

    res.status(200).json(address); // Send the address details back to the client
  } catch (error) {
    console.error("Error fetching address:", error);
    res.status(500).json({ message: "Server error. Please try again." });
  }
});
app.get("/addresses", async (req, res) => {
  try {
    const addresses = await AddressModel.find(); // Retrieve all addresses
    res.status(200).json(addresses); // Send the addresses as JSON
  } catch (error) {
    res.status(500).json({ message: "Error fetching addresses", error });
  }
});

const orderSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "user", // Adjust according to your user model name
  },
  cartItems: [
    {
      productId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "product", // Adjust according to your product model name
      },
      qty: {
        type: Number,
        required: true,
        min: 1,
      },
      price: {
        type: Number,
        required: true,
      },
    },
  ],
  totalAmount: {
    type: Number,
    required: true,
  },
  orderDate: {
    type: Date,
    default: Date.now,
  },
  orderStatus: {
    type: String,
    enum: ["Pending", "Processing", "Shipped", "Delivered", "Cancelled"],
    default: "Pending", // Default status when the order is first created
  },
});

const Order = mongoose.model("Order", orderSchema);
app.post("/order", async (req, res) => {
  const { userId, cartItems, totalAmount } = req.body;

  if (!userId || !cartItems || !totalAmount) {
    return res
      .status(400)
      .json({ message: "User ID, cart items, and total amount are required." });
  }

  try {
    const newOrder = new Order({
      userId,
      cartItems,
      totalAmount,
      orderStatus: "Pending", // Set the initial status if not set in the body
    });

    await newOrder.save();

    res
      .status(201)
      .json({ message: "Order created successfully", orderId: newOrder._id });
  } catch (error) {
    res.status(500).json({ message: "Error creating order", error });
  }
});
app.get("/orders", async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("userId", "firstName lastName email") // Populate user details
      .populate("cartItems.productId", "name price"); // Populate product details in cartItems

    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch orders" });
  }
});

const feedbackSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
  },
  productName: {
    type: String,
    required: true,
  },
  rating: {
    type: String,
    required: true,
  },
  comment: {
    type: String,
    required: true,
  },
  date: { type: Date, default: Date.now },
});

const FeedbackModel = mongoose.model("Feedback", feedbackSchema);
app.post("/feedback", async (req, res) => {
  try {
    const { name, email, phone, productname, rating, comment } = req.body;
    const result = await userModel.findOne({ email: req.body.email });

    if (result) {
      const data = await FeedbackModel(req.body);
      const datasave = await data.save();
      res.status(201).json({ message: "Submitted successfully" });
    }
  } catch (error) {
    console.error("Error submitting Feedback form:", error);
    res.status(500).json({ message: "Server error. Please try again." });
  }
});
app.get("/allfeedbacks", async (req, res) => {
  try {
    const feedbacks = await FeedbackModel.find(); // Fetch all contacts
    res.send({
      message: "Data fetched successfully",
      alert: true,
      data: feedbacks,
    });
  } catch (err) {
    console.error(err);
    res.status(500).send({ message: "An error occurred while fetching Data" });
  }
});
app.put("/orders/:id/status", async (req, res) => {
  const { id } = req.params; // The order ID
  const { orderStatus } = req.body; // The new status from the frontend

  // Validate the new status
  const validStatuses = [
    "Pending",
    "Processing",
    "Shipped",
    "Delivered",
    "Cancelled",
  ];
  if (!validStatuses.includes(orderStatus)) {
    return res.status(400).json({ message: "Invalid order status" });
  }

  try {
    // Find the order by ID and update its status
    const order = await Order.findByIdAndUpdate(
      id,
      { orderStatus }, // Set the new status
      { new: true } // Return the updated order
    );

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    res
      .status(200)
      .json({ message: "Order status updated successfully", order });
  } catch (error) {
    res.status(500).json({ message: "Failed to update order status", error });
  }
});
app.get("/my-orders", async (req, res) => {
  const { userId } = req.query; // Assuming userId is passed as a query parameter
  try {
    const orders = await Order.find({ userId })
      .populate("userId", "firstName lastName email") // Populate user details
      .populate("cartItems.productId", "name price image") // Populate product details
      .select("totalAmount orderDate orderStatus cartItems"); // Select specific fields including orderStatus

    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch orders" });
  }
});

app.listen(PORT, () => console.log("Server is running at port : " + PORT));
