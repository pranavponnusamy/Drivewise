const express = require("express");
const app = express();
require("dotenv").config({ path: "./.env" });
const userRouter = require("./routes/user.routes");
const messageRouter = require("./routes/messages.routes");
const locationRouter = require("./routes/location.routes");
const chatRouter = require("./routes/chat.routes");

const PORT = process.env.PORT || 5001;
app.use(express.json());

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PATCH, DELETE, OPTIONS, PUT"
  );
  next();
});

app.use("/user", userRouter);
app.use("/message", messageRouter);
app.use("/location", locationRouter);
app.use("/chat", chatRouter);

app.listen(PORT, console.log(`Server running on Port ${PORT}`));
