const express = require("express");
const multer = require("multer");
const connectDB = require("../db/mongoClient"); 
const router = express.Router(); 
const path = require("path");
const fs = require("fs");
const jwt = require('jsonwebtoken');

const { ObjectId } = require("mongodb"); // Make sure this is at the top

// GET all products
router.get("/", async (req, res) => {
  try {
    const db = await connectDB();
    const products = await db.collection("products").find().toArray();
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: "Error fetching products", error: err.message });
  }
});

// GET all gold products
router.get("/gold", async (req, res) => {
  try {
    const db = await connectDB();
    const products = await db.collection("products").find({category:"Gold"}).toArray();
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: "Error fetching products", error: err.message });
  }
});

// GET all gold products
router.get("/silver", async (req, res) => {
  try {
    const db = await connectDB();
    const products = await db.collection("products").find({category:"Silver"}).toArray();
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: "Error fetching products", error: err.message });
  }
});

// DELETE product
router.delete("/:id", async (req, res) => {
  try {
    const db = await connectDB();
    const result = await db.collection("products").deleteOne({ _id: new ObjectId(req.params.id) });

    if (result.deletedCount === 0) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.json({ message: "Product deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Error deleting product", error: err.message });
  }
});

// Ensure uploads folder exists
const uploadDir = path.join(__dirname, "..", "uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

// Set up Multer for file upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "_" + file.originalname);
  },
});
const upload = multer({ storage });

//update product
router.put("/:id", upload.single("image"), async (req, res) => {
  const productId = req.params.id;
  const updatedProduct = req.body;

  if (req.file) {
    updatedProduct.image = req.file.path;  // Save uploaded image path
  }

  // Convert stock to number if provided
  if (updatedProduct.stock !== undefined) {
    updatedProduct.stock = Number(updatedProduct.stock);
    if (isNaN(updatedProduct.stock) || updatedProduct.stock < 0) {
      return res.status(400).json({ message: "Invalid stock value" });
    }
  }

  try {
    const db = await connectDB();
    const result = await db.collection("products").updateOne(
      { _id: new ObjectId(productId) },
      { $set: updatedProduct }
    );

    if (result.modifiedCount === 0) {
      return res.status(404).json({ message: "Product not found or no changes made" });
    }

    res.status(200).json({ message: "Product updated successfully" });
  } catch (err) {
    console.error("Error updating product:", err);
    res.status(500).json({ message: "Error updating product", error: err.message });
  }
});


// update product
// router.put("/:id", upload.single("image"), async (req, res) => {
//     const productId = req.params.id;
//     const updatedProduct = req.body;
  
//     if (req.file) {
//       updatedProduct.image = req.file.path;  // Save image path in the database
//     }
  
//     try {
//       const db = await connectDB();
//       const result = await db.collection("products").updateOne(
//         { _id: new ObjectId(productId) }, 
//         { $set: updatedProduct }
//       );
  
//       if (result.modifiedCount === 0) {
//         return res.status(404).json({ message: "Product not found" });
//       }
  
//       res.status(200).json({ message: "Product updated successfully" });
//     } catch (err) {
//       console.error("Error updating product:", err);
//       res.status(500).json({ message: "Error updating product", error: err.message });
//     }
//   });

  // In your backend route (Express.js)
    //router.get("/:id", async (req, res) => {
    //const productId = req.params.id;
    //try {
      //const db = await connectDB();
      //const product = await db.collection("products").findOne({ _id: new ObjectId(productId) });
  
     // if (!product) {
      //  return res.status(404).json({ message: "Product not found" });
     // }
  
      //res.status(200).json(product); // Return the found product
   // } catch (err) {
    //  console.error("Error fetching product:", err);
      //res.status(500).json({ message: "Error fetching product", error: err.message });
   // }
  //});

  // GET a single product by ID
router.get("/:id", async (req, res) => {
  const productId = req.params.id;
  try {
    const db = await connectDB();
    const product = await db.collection("products").findOne({ _id: new ObjectId(productId) });

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.status(200).json(product);
  } catch (err) {
    console.error("Error fetching product:", err);
    res.status(500).json({ message: "Error fetching product", error: err.message });
  }
});

// POST /api/products/:id/review
router.post("/:id/review", async (req, res) => {
  const { rating, comment, name } = req.body;
  const productId = req.params.id;

  if (!rating || !comment || !name) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    // Extract token from Authorization header
    const token = req.headers.authorization?.split(" ")[1]; 
    if (!token) {
      return res.status(401).json({ message: "Token missing" });
    }

    // Decode the JWT token
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decodedToken.id;

    // Connect to DB and get the product
    const db = await connectDB();
    const product = await db.collection("products").findOne({ _id: new ObjectId(productId) });

    if (!product) {
      console.error("Product not found with id:", productId);
      return res.status(404).json({ message: "Product not found" });
    }

    // Prepare review object
    const review = {
      userId: new ObjectId(userId),
      name,
      rating: Number(rating),
      comment,
      createdAt: new Date(),
    };

    // Update product with new review
    await db.collection("products").updateOne(
      { _id: new ObjectId(productId) },
      { $push: { reviews: review } }
    );

    //console.log("Review submitted successfully", review);
    return res.status(200).json({ message: "Review submitted successfully" });

  } catch (error) {
    console.error("Error in review submission:", error);
    return res.status(500).json({ message: "Server error", error: error.message });
  }
});



  

module.exports = router;
