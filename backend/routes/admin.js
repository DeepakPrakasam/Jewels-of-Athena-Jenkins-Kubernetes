const express = require("express");
const { verifyToken, isAdmin } = require("../middleware/authMiddleware");
const connectDB = require("../db/mongoClient");
const { MongoClient, ObjectId } = require("mongodb");
const router = express.Router();
const client = new MongoClient(process.env.MONGO_URI);
const dbName = "jewelleryShop";

// Add Product for Admin
router.post("/add-product", verifyToken, isAdmin, async (req, res) => {
  const {
    title,
    category,
    metalPurity,
    weight,
    description,
    price,
    image,
    subcategory,
    stock,
  } = req.body;

  // Validation (basic example)
  if (
    !title ||
    !category ||
    !metalPurity ||
    !weight ||
    !description ||
    !price ||
    !image ||
    stock === undefined ||
    stock === null
  ) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    const db = await connectDB();
    const products = db.collection("products");

    // Inserting the product into the database
    await products.insertOne({
      title,
      category,
      metalPurity,
      weight,
      description,
      price,
      image,
      subcategory: subcategory || null, // If subcategory is provided, insert it; otherwise, set as null
      createdAt: new Date(),
      stock: Number(stock),
    });

    res.status(200).json({ message: "Product added successfully" });
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ message: "Failed to add product", error: err.message });
  }
});


router.get("/orders", verifyToken, isAdmin, async (req, res) => {
  try {
    const db = await connectDB();
    const orders = await db.collection("orders").aggregate([
      {
        $lookup: {
          from: "users",
          localField: "userId",       // Already an ObjectId now
          foreignField: "_id",
          as: "user",
        },
      },
      {
        $unwind: {
          path: "$user",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $project: {
          _id: 1,
          createdAt: 1,
          totalAmount: 1,
          status: 1,
          "user.name": 1,
          "user.email": 1,
        },
      },
      {
        $sort: {
          createdAt: -1,
        },
      },
    ]).toArray();

    res.status(200).json(orders);
  } catch (err) {
    console.error("Error fetching orders:", err);
    res.status(500).json({ message: "Failed to fetch orders" });
  }
});

// Get all users
router.get("/users", verifyToken, isAdmin, async (req, res) => {
  try {
    const db = await connectDB();
    const users = await db
      .collection("users")
      .find({}, { projection: { password: 0 } })
      .toArray();
    res.status(200).json(users);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch users" });
  }
});

router.get("/products/count", verifyToken, async (req, res) => {
  const db = await connectDB();
  const count = await db.collection("products").countDocuments();
  res.json({ count });
});

router.get("/users/count", verifyToken, async (req, res) => {
  const db = await connectDB();
  const count = await db.collection("users").countDocuments();
  res.json({ count });
});

//weekly revenue summary
router.get("/orders/summary", verifyToken, async (req, res) => {
  const db = await connectDB();
  const ordersCollection = db.collection("orders");
  const usersCollection = db.collection("users");

  const orders = await ordersCollection
    .find()
    .sort({ createdAt: -1 })
    .toArray();

  const recentOrders = await Promise.all(
    orders.slice(0, 5).map(async (order) => {
      const user = await usersCollection.findOne({
        _id: new ObjectId(order.userId),
      });
      return {
        _id: order._id,
        userName: user?.name || "Unknown",
        totalAmount: order.totalAmount,
        status: order.status,
        createdAt: order.createdAt,
      };
    })
  );

  const totalRevenue = orders.reduce(
    (sum, order) => sum + order.totalAmount,
    0
  );

  res.json({
    count: orders.length,
    revenue: totalRevenue,
    recentOrders,
  });
});

//Daily revenue summary
router.get("/revenue-daily", verifyToken, isAdmin, async (req, res) => {
  try {
    const db = await connectDB();
    const ordersCollection = db.collection("orders");

    const dailyRevenue = await ordersCollection.aggregate([
      {
        $match: {
          status: { $ne: "Cancelled" }, // Optional: Exclude cancelled orders
        },
      },
      {
        $group: {
          _id: {
            $dateToString: { format: "%Y-%m-%d", date: "$createdAt" }
          },
          revenue: { $sum: "$totalAmount" }
        }
      },
      {
        $sort: { _id: 1 } // Sort by date ascending
      },
      {
        $project: {
          _id: 0,
          date: "$_id",
          revenue: 1
        }
      }
    ]).toArray();

    res.status(200).json(dailyRevenue);
  } catch (err) {
    console.error("❌ Failed to fetch daily revenue:", err);
    res.status(500).json({ message: "Failed to fetch daily revenue" });
  }
});


// Route to get product category distribution
router.get("/product-categories", async (req, res) => {
  try {
    const db = client.db(dbName);
    const productsCollection = db.collection("products");

    // Group by category and count products in each category
    const result = await productsCollection
      .aggregate([{ $group: { _id: "$category", count: { $sum: 1 } } }])
      .toArray();

    // Send response with the category count
    const response = result.map((item) => ({
      category: item._id,
      count: item.count,
    }));

    res.json(response); // Send data for the chart
  } catch (error) {
    console.error("Error fetching product categories:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Route to get revenue by week
router.get("/revenue-summary", async (req, res) => {
  try {
    const db = client.db(dbName);
    const ordersCollection = db.collection("orders");

    // Aggregate total revenue by week
    const result = await ordersCollection
      .aggregate([
        {
          $project: {
            totalAmount: 1,
            createdAt: 1,
            week: { $isoWeek: "$createdAt" }, // Extract ISO Week
            year: { $isoWeekYear: "$createdAt" }, // Extract year
          },
        },
        {
          $group: {
            _id: { week: "$week", year: "$year" },
            totalRevenue: { $sum: "$totalAmount" },
          },
        },
        { $sort: { "_id.year": 1, "_id.week": 1 } }, // Sort by year and week
      ])
      .toArray();

    // Format the result for the frontend
    const response = result.map((item) => ({
      week: `${item._id.year}-W${item._id.week}`,
      revenue: item.totalRevenue,
    }));

    res.json(response); // Send revenue data for the chart
  } catch (error) {
    console.error("Error fetching revenue:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = router;
