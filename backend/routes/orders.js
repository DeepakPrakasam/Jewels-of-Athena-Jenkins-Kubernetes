const express = require("express");
const { ObjectId } = require("mongodb");
const connectDB = require("../db/mongoClient");
const { verifyToken } = require("../middleware/authMiddleware");
const nodemailer = require("nodemailer");

const router = express.Router();

// Set up nodemailer
const transporter = nodemailer.createTransport({
  service: "gmail",
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// // Place an order
// router.post("/", verifyToken, async (req, res) => {
//   const userId = req.user.id;
//   const { items, shippingDetails } = req.body;

//   if (
//     !items ||
//     !Array.isArray(items) ||
//     items.length === 0 ||
//     !shippingDetails
//   ) {
//     return res
//       .status(400)
//       .json({ message: "Missing order items or shipping details" });
//   }

//   try {
//     const db = await connectDB();
//     const productsCollection = db.collection("products");
//     const ordersCollection = db.collection("orders");
//     const usersCollection = db.collection("users");

//     // Validate user ID
//     if (!ObjectId.isValid(userId)) {
//       return res.status(400).json({ message: "Invalid user ID" });
//     }

//     // Fetch user email
//     const user = await usersCollection.findOne({ _id: new ObjectId(userId) });
//     if (!user) return res.status(404).json({ message: "User not found" });

//     // Fetch product details
//     const itemDetails = await Promise.all(
//       items.map(async (item) => {
//         // Check stock availability before placing order
//         for (const item of items) {
//           const product = await productsCollection.findOne({
//             _id: new ObjectId(item.productId),
//           });
//           if (!product) throw new Error(`Product not found: ${item.productId}`);
//           if (product.stock < item.quantity) {
//             return res.status(400).json({
//               message: `Insufficient stock for product: ${product.title}`,
//             });
//           }
//         }

//         await productsCollection.updateOne(
//           { _id: new ObjectId(item.productId) },
//           { $inc: { stock: -item.quantity } }
//         );
//         return {
//           productId: product._id,
//           title: product.title,
//           price: product.price,
//           quantity: item.quantity,
//           subtotal: product.price * item.quantity,
//         };
//       })
//     );

//     const totalAmount = itemDetails.reduce(
//       (sum, item) => sum + item.subtotal,
//       0
//     );

//     const order = {
//       userId,
//       items: itemDetails,
//       shippingDetails,
//       totalAmount,
//       status: "Pending",
//       createdAt: new Date(),
//     };

//     const result = await ordersCollection.insertOne(order);

//     // Send confirmation email (non-blocking)
//     try {
//       const itemListHtml = itemDetails
//         .map(
//           (item) =>
//             `<li>${item.title} (x${item.quantity}) - ₹${item.subtotal}</li>`
//         )
//         .join("");

//       const mailOptions = {
//         from: `"Dhandapani Jewellery" <${process.env.EMAIL_USER}>`,
//         to: `${shippingDetails.email || user.email}`,
//         subject: "Order Confirmation - Dhandapani Jewellery",
//         html: `
//           <h2>Thank you for your order!</h2>
//           <p>Your order <strong>#${result.insertedId}</strong> has been placed successfully.</p>
//           <p><strong>Items:</strong></p>
//           <ul>${itemListHtml}</ul>
//           <p><strong>Total:</strong> ₹${totalAmount}</p>
//           <p>We will ship your order to:</p>
//           <pre>${shippingDetails.fullName}
// ${shippingDetails.address}, ${shippingDetails.city}, ${shippingDetails.state} - ${shippingDetails.zip}
// ${shippingDetails.country}
// Phone: ${shippingDetails.phone}
// Email: ${shippingDetails.email}</pre>
//           <p>We will notify you once your order is shipped.</p>
//         `,
//       };

//       await transporter.sendMail(mailOptions);
//     } catch (emailErr) {
//       console.error("📧 Email error:", emailErr.message);
//       // Don’t crash on email failure
//     }

//     res.status(201).json({
//       message: "✅ Order placed successfully",
//       orderId: result.insertedId,
//     });
//   } catch (err) {
//     console.error("❌ Order placement error:", err);
//     res
//       .status(500)
//       .json({ message: "Failed to place order", error: err.message });
//   }
// });

router.get("/history", verifyToken, async (req, res) => {
  try {
    const userId = req.user.id;
    //console.log("Fetching orders for user:", userId);

    if (!ObjectId.isValid(userId)) {
      return res.status(400).json({ message: "Invalid user ID" });
    }

    const db = await connectDB();
    const ordersCollection = db.collection("orders");

    const orders = await ordersCollection
      .find({ userId: new ObjectId(userId) }) // ✅ convert to ObjectId
      .sort({ createdAt: -1 })
      .toArray();

    res.json(orders);
    //console.log("Fetched orders:", orders);
  } catch (error) {
    console.error("❌ Failed to fetch orders:", error);
    res
      .status(500)
      .json({ message: "Failed to fetch orders", error: error.message });
  }
});


// router.post("/", verifyToken, async (req, res) => {
//   const userId = req.user.id;
//   const { items, shippingDetails } = req.body;

//   if (
//     !items ||
//     !Array.isArray(items) ||
//     items.length === 0 ||
//     !shippingDetails
//   ) {
//     return res
//       .status(400)
//       .json({ message: "Missing order items or shipping details" });
//   }

//   try {
//     const db = await connectDB();
//     const productsCollection = db.collection("products");
//     const ordersCollection = db.collection("orders");
//     const usersCollection = db.collection("users");

//     if (!ObjectId.isValid(userId)) {
//       return res.status(400).json({ message: "Invalid user ID" });
//     }

//     const user = await usersCollection.findOne({ _id: new ObjectId(userId) });
//     if (!user) return res.status(404).json({ message: "User not found" });

//     // Step 1: Fetch all product details once
//     const productMap = {};

//     for (const item of items) {
//       const product = await productsCollection.findOne({
//         _id: new ObjectId(item.productId),
//       });
//       if (!product) {
//         return res
//           .status(404)
//           .json({ message: `Product not found: ${item.productId}` });
//       }
//       if (product.stock < item.quantity) {
//         return res.status(400).json({
//           message: `Insufficient stock for product: ${product.title}`,
//         });
//       }

//       // Store for reuse
//       productMap[item.productId] = product;
//     }

//     // Step 2: Reduce stock
//     for (const item of items) {
//       await productsCollection.updateOne(
//         { _id: new ObjectId(item.productId) },
//         { $inc: { stock: -item.quantity } }
//       );
//     }

//     // Step 3: Build order items using cached product data
//     const itemDetails = items.map((item) => {
//       const product = productMap[item.productId];
//       return {
//         productId: product._id,
//         title: product.title,
//         price: product.price,
//         quantity: item.quantity,
//         subtotal: product.price * item.quantity,
//         image: product.image || "", 
//       };
//     });

//     const totalAmount = itemDetails.reduce(
//       (sum, item) => sum + item.subtotal,
//       0
//     );

//     const order = {
//       userId,
//       items: itemDetails,
//       shippingDetails,
//       totalAmount,
//       status: "Pending",
//       createdAt: new Date(),
//     };

//     const result = await ordersCollection.insertOne(order);

//     // Send confirmation email
//     try {
//       const itemListHtml = itemDetails
//         .map(
//           (item) =>
//             `<li>${item.title} (x${item.quantity}) - ₹${item.subtotal}</li>`
//         )
//         .join("");

//       const mailOptions = {
//         from: `"Dhandapani Jewellery" <${process.env.EMAIL_USER}>`,
//         to: `${shippingDetails.email || user.email}`,
//         subject: "Order Confirmation - Dhandapani Jewellery",
//         html: `
//           <h2>Thank you for your order!</h2>
//           <p>Your order <strong>#${result.insertedId}</strong> has been placed successfully.</p>
//           <ul>${itemListHtml}</ul>
//           <p><strong>Total:</strong> ₹${totalAmount}</p>
//           <p>We will ship your order to:</p>
//           <pre>${shippingDetails.fullName}
// ${shippingDetails.address}, ${shippingDetails.city}, ${shippingDetails.state} - ${shippingDetails.zip}
// ${shippingDetails.country}
// Phone: ${shippingDetails.phone}
// Email: ${shippingDetails.email}</pre>
//         `,
//       };

//       await transporter.sendMail(mailOptions);
//     } catch (emailErr) {
//       console.error("📧 Email error:", emailErr.message);
//     }

//     res.status(201).json({
//       message: "✅ Order placed successfully",
//       orderId: result.insertedId,
//     });
//   } catch (err) {
//     console.error("❌ Order placement error:", err);
//     res
//       .status(500)
//       .json({ message: "Failed to place order", error: err.message });
//   }
// });

router.post("/", verifyToken, async (req, res) => {
  const userId = req.user.id;  // User ID is coming from the JWT token
  const { items, shippingDetails } = req.body;

  if (
    !items ||
    !Array.isArray(items) ||
    items.length === 0 ||
    !shippingDetails
  ) {
    return res
      .status(400)
      .json({ message: "Missing order items or shipping details" });
  }

  try {
    const db = await connectDB();
    const productsCollection = db.collection("products");
    const ordersCollection = db.collection("orders");
    const usersCollection = db.collection("users");

    // Ensure userId is valid and convert to ObjectId
    const userObjectId = new ObjectId(userId);

    const user = await usersCollection.findOne({ _id: userObjectId });
    if (!user) return res.status(404).json({ message: "User not found" });

    // Step 1: Fetch all product details once
    const productMap = {};

    for (const item of items) {
      const product = await productsCollection.findOne({
        _id: new ObjectId(item.productId),
      });
      if (!product) {
        return res
          .status(404)
          .json({ message: `Product not found: ${item.productId}` });
      }
      if (product.stock < item.quantity) {
        return res.status(400).json({
          message: `Insufficient stock for product: ${product.title}`,
        });
      }

      // Store for reuse
      productMap[item.productId] = product;
    }

    // Step 2: Reduce stock
    for (const item of items) {
      await productsCollection.updateOne(
        { _id: new ObjectId(item.productId) },
        { $inc: { stock: -item.quantity } }
      );
    }

    // Step 3: Build order items using cached product data
    const itemDetails = items.map((item) => {
      const product = productMap[item.productId];
      return {
        productId: product._id,
        title: product.title,
        price: product.price,
        quantity: item.quantity,
        subtotal: product.price * item.quantity,
        image: product.image || "", 
      };
    });

    const totalAmount = itemDetails.reduce(
      (sum, item) => sum + item.subtotal,
      0
    );

    const order = {
      userId: userObjectId,  // Ensure userId is stored as an ObjectId
      items: itemDetails,
      shippingDetails,
      totalAmount,
      status: "Pending",
      createdAt: new Date(),
    };

    const result = await ordersCollection.insertOne(order);

    // Send confirmation email
    try {
      const itemListHtml = itemDetails
        .map(
          (item) =>
            `<li>${item.title} (x${item.quantity}) - ₹${item.subtotal}</li>`
        )
        .join("");

      const mailOptions = {
        from: `"Dhandapani Jewellery" <${process.env.EMAIL_USER}>`,
        to: `${shippingDetails.email || user.email}`,
        subject: "Order Confirmation - Dhandapani Jewellery",
        html: `
          <h2>Thank you for your order!</h2>
          <p>Your order <strong>#${result.insertedId}</strong> has been placed successfully.</p>
          <ul>${itemListHtml}</ul>
          <p><strong>Total:</strong> ₹${totalAmount}</p>
          <p>We will ship your order to:</p>
          <pre>${shippingDetails.fullName}
${shippingDetails.address}, ${shippingDetails.city}, ${shippingDetails.state} - ${shippingDetails.zip}
${shippingDetails.country}
Phone: ${shippingDetails.phone}
Email: ${shippingDetails.email}</pre>
        `,
      };

      await transporter.sendMail(mailOptions);
    } catch (emailErr) {
      console.error("📧 Email error:", emailErr.message);
    }

    res.status(201).json({
      message: "✅ Order placed successfully",
      orderId: result.insertedId,
    });
  } catch (err) {
    console.error("❌ Order placement error:", err);
    res
      .status(500)
      .json({ message: "Failed to place order", error: err.message });
  }
});

module.exports = router;
