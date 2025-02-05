const { render } = require("ejs");
const User = require("../models/user");
const Visit = require("../models/visit");
const Admin = require("../models/admin");
const serialportgsm = require("serialport-gsm");
const bcrypt = require("bcryptjs");

var day = new Date();

var admin = false;

const home = (req, res) => {
  if (admin) {
    Visit.find()
      .sort({ createdAt: -1 })
      .then((result) => {
        console.log(result);
        res.render("index", { visits: result });
      })
      .catch((err) => {
        console.log(err);
      });
  } else {
    res.redirect("/login");
  }
};

const profile = (req, res) => {
  if (admin) {
    User.find({ rfid: req.params.rfid })
      .exec()
      .then((result_user) => {
        Visit.find({ rfid: req.params.rfid })
          .sort({ createdAt: -1 })
          .then((result_visit) => {
            res.render("profile", {
              profile_info: result_user[0],
              visits: result_visit,
              rfid: req.params.rfid,
            });
          })
          .catch((err) => {
            console.log(err);
          });
      })
      .catch((err) => {
        console.log(err);
      });
  } else {
    res.redirect("/login");
  }
};

const visit_done = (req, res) => {
  if (admin) {
    User.find({ rfid: req.params.rfid })
      .then((result) => {
        res.render("visit-done", { user: result[0] });
      })
      .catch((err) => {
        console.log(err);
      });
  } else {
    res.redirect("/login");
  }
};

const visit_done_post = (req, res) => {
  if (admin) {
    var dd = String(day.getDate()).padStart(2, "0");
    var mm = String(day.getMonth() + 1).padStart(2, "0"); //January is 0!
    var yyyy = day.getFullYear();

    today = mm + "/" + dd + "/" + yyyy;
    User.find({ rfid: req.params.rfid })
      .exec()
      .then((result) => {
        var time = new Date();
        const visit = new Visit({
          reason: req.body.reason,
          details: req.body.details,
          medications: req.body.medications,
          nurse: req.body.nurse,
          rfid: req.params.rfid,
          name: result[0].name,
          student_id: result[0].student_id,
          section: result[0].section,
          date: today,
          time_start: req.params.time,
          time_end:
            time.getHours() +
            ":" +
            String(time.getMinutes()).padStart(2, "0") +
            ":" +
            String(time.getSeconds()).padStart(2, "0"),
        });

        visit
          .save()
          .then((result) => {
            res.redirect("/");
          })
          .catch((err) => {
            console.log(err);
          });
      })
      .catch((err) => {
        console.log(err);
      });
  } else {
    res.redirect("/login");
  }
};

const clinic_history = (req, res) => {
  if (admin) {
    Visit.find()
      .sort({ createdAt: -1 })
      .then((result) => {
        res.render("clinic-history", { visits: result });
      })
      .catch((err) => {
        console.log(err);
      });
  } else {
    res.redirect("/login");
  }
};

const clinic_history_details = (req, res) => {
  if (admin) {
    Visit.find({ _id: req.params.id })
      .exec()
      .then((result_visit) => {
        User.find({ name: result_visit[0].name })
          .exec()
          .then((result_user) => {
            res.render("history-details", {
              visit: result_visit[0],
              user: result_user[0],
            });
          })
          .catch((err) => {
            console.log(err);
          });
      })
      .catch((err) => {
        console.log(err);
      });
  } else {
    res.redirect("/login");
  }
};

const user_history = (req, res) => {
  if (admin) {
    User.find({ rfid: req.params.rfid })
      .exec()
      .then((result_user) => {
        Visit.find({ rfid: req.params.rfid })
          .sort({ createdAt: -1 })
          .then((result_visit) => {
            res.render("user-history", {
              user: result_user[0],
              visits: result_visit,
            });
          })
          .catch((err) => {
            console.log(err);
          });
      })
      .catch((err) => {
        console.log(err);
      });
  } else {
    res.redirect("/login");
  }
};

const students = (req, res) => {
  if (admin) {
    User.find()
      .sort({ name: 1 })
      .then((result) => {
        console.log(result);
        res.render("students", { students: result });
      })
      .catch((err) => {
        console.log(err);
      });
  } else {
    res.redirect("/login");
  }
};

const sendSMS = async (req, res) => {
  if (admin) {
    let modem = serialportgsm.Modem();
    let options = {
      baudRate: 9600,
      dataBits: 8,
      stopBits: 1,
      parity: "none",
      rtscts: false,
      xon: false,
      xoff: false,
      xany: false,
      autoDeleteOnReceive: true,
      enableConcatenation: true,
      incomingCallIndication: true,
      incomingSMSIndication: true,
      pin: "",
      customInitCommand: "",
      cnmiCommand: "AT+CNMI=2,1,0,2,1",
      logger: console,
    };

    console.log(req.body);

    const number = req.body.inputnumber;
    const body = req.body.body;
    const formattedNumber = "63" + number.slice(1); // Convert to correct format

    // Open modem only if it's not already open
    if (!modem.isOpened) {
      modem.open("COM6", options, (err) => {
        if (err) {
          console.error("Failed to open modem:", err);
          return res.status(500).json({ error: "Failed to open modem" });
        }

        console.log("Modem opened successfully");

        // Initialize modem
        modem.initializeModem(() => {
          console.log("Modem initialized");

          // Send SMS
          modem.sendSMS(formattedNumber, body, false, (err, response) => {
            console.log("SMS Sent Successfully:", response);

            // Close the modem after sending the SMS
            modem.close(() => {
              console.log("Modem closed");
            });

            // Redirect after sending SMS
            res.redirect("/profile/" + req.params.rfid);
          });
        });
      });
    } else {
      console.error("Modem is already open");
      return res.status(500).json({ error: "Modem is already in use" });
    }

    // Handle modem errors
    modem.on("error", (err) => {
      console.error("Modem Error:", err);
    });
  } else {
    res.redirect("/login");
  }
};

const login = (req, res) => {
  res.render("login", { error: false });
};
 
const loginPOST = async (req, res) => {
  // Admin.find({rfid: req.body.rfid})
  console.log(req.body);
  Admin.find({ rfid: req.body.rfid }).then(async (resultAdmin) => {
    if (resultAdmin.length <= 0) {
      res.render("login", { error: true });
    } else {
      const hashedPassword = await bcrypt.hash("password", 8);
      console.log(hashedPassword);
      bcrypt.compare(
        req.body.password,
        resultAdmin[0].password,
        (err, result) => {
          if (err) {
            console.error("Error comparing passwords:", err);
            return;
          }
          if (result) {
            admin = true;
            res.redirect("/");
          } else {
            res.render("login", { error: true });
          }
        }
      );
    }
  });
};

module.exports = {
  profile,
  visit_done_post,
  clinic_history,
  home,
  clinic_history_details,
  user_history,
  visit_done,
  students,
  sendSMS,
  login,
  loginPOST,
};
