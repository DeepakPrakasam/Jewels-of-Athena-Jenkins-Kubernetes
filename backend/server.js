const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const bodyParser = require("body-parser");  
const connectDB = require("./db/mongoClient");

dotenv.config();
const app = express();

app.use(cors());
app.use(bodyParser.json());  

// Routes

const authRoutes = require('./routes/auth');
app.use('/api/auth', authRoutes);



const adminRoutes = require('./routes/admin');
app.use('/api/admin', adminRoutes);

app.get("/api/test-proxy", (req, res) => {
  res.json({ message: "Proxy is working!" });
});

const productRoutes = require("./routes/products");  
app.use("/api/products", productRoutes)

const cartRoutes = require("./routes/cart");
app.use("/api/cart", cartRoutes);  
;             

const orderRoutes = require("./routes/orders");  
app.use("/api/orders", orderRoutes);             



// Base route
app.get("/", (req, res) => {
  res.send("Backend is working!");
});

app.get("/api/categories", (req, res) => {
  res.json([
    { title: "Bangles", image: "/bangles-cat.jpg" },
    { title: "Bracelets", image: "/bracelets-cat.webp" },
    { title: "Chains", image: "/chains-cat.webp" },
    { title: "Earrings", image: "/earrings-cat.webp" },
    { title: "Mangalsutra", image: "/mangalsutra-cat.jpg" },
    { title: "Pendants", image: "/pendants-cat.webp" },
    { title: "Rings", image: "/rings-cat.jpg" },
    { title: "Bangles", image: "/bangles-cat.jpg" },

  ]);
});

app.use(express.static("../frontend/public"));
app.use("/uploads", express.static("uploads"));

// Connect to DB first, then start the server
const PORT = process.env.PORT || 5000;

connectDB().then(() => {
  app.listen(process.env.PORT || 5000, '0.0.0.0', () => {
      console.log(`Server running on port ${process.env.PORT}`);
  });
}).catch((err) => {
  console.error("❌ Failed to connect to MongoDB:", err);
});
