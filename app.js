const express = require("express");
const morgan = require("morgan");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config({ path: "vars/.env" });

const siteController = require("./controller/siteController");

const app = express();

app.set("view engine", "ejs");

const dbURI = process.env.DB_URI;
if (!dbURI) {
  throw new Error("MONGO_URI is not defined in the environment variables");
}

mongoose
  .connect(dbURI)
  .then((result) => app.listen(3000))
  .then(() => console.log("DB connected"))
  .catch((err) => console.log(err));

app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));

app.get("/login", siteController.login);
app.post("/login", siteController.loginPOST)

app.get("/", siteController.home);

app.get("/visit-done/:rfid/:time", siteController.visit_done);

app.post("/visit-done/:rfid/:time", siteController.visit_done_post);

app.get("/profile/:rfid", siteController.profile);

app.get("/clinic-history", siteController.clinic_history);

app.get("/students", siteController.students);

app.get("/clinic-history/details/:id", siteController.clinic_history_details);

app.get("/user-history/:rfid", siteController.user_history);

app.post("/send-sms/:rfid", siteController.sendSMS);

