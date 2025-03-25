const express = require("express");
const cors = require("cors");
const corsOptions = {
  origin: ["http://localhost:5173"],
};
const app = express();
const dotenv = require("dotenv");
dotenv.config();
const db = require("./config/db.js");
// const authRoute = require("./routes/authRoutes.js");

db();
app.use(cors(corsOptions));
app.use(express.json());
// app.use("/api/v1/auth", authRoute);
app.use("/api/auth", require("./routes"));
app.use("/api/laundry", require("./routes/laundry"));
app.use("/api/salon", require("./routes/salon"));
app.use("/api/food", require("./routes/food"));

app.get("/", (req, res) => {
  res.send("<h1>Welcome to Our Uni-Ease platform.</h1>");
});

const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
  console.log(
    `Server is listening on port ${PORT}`
  );
});
