const { render } = require("ejs");
const User = require("../models/user");
const Visit = require("../models/visit");
const serialportgsm = require("serialport-gsm");

var day = new Date();

const home = (req, res) => {
  Visit.find()
    .sort({ createdAt: -1 })
    .then((result) => {
      console.log(result);
      res.render("index", { visits: result });
    })
    .catch((err) => {
      console.log(err);
    });
};

const profile = (req, res) => {
  User.find({ rfid: req.params.rfid })
    .exec()
    .then((result_user) => {
      Visit.find({ rfid: req.params.rfid })
        .sort({ createdAt: -1 })
        .then((result_visit) => {
          res.render("profile", {
            profile_info: result_user[0],
            visits: result_visit,
            rfid: req.params.rfid
          });
        })
        .catch((err) => {
          console.log(err);
        });
    })
    .catch((err) => {
      console.log(err);
    });
};

const visit_done = (req, res) => {
  User.find({ rfid: req.params.rfid })
    .then((result) => {
      res.render("visit-done", { user: result[0] });
    })
    .catch((err) => {
      console.log(err);
    });
};

const visit_done_post = (req, res) => {
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
};

const clinic_history = (req, res) => {
  Visit.find()
    .sort({ createdAt: -1 })
    .then((result) => {
      res.render("clinic-history", { visits: result });
    })
    .catch((err) => {
      console.log(err);
    });
};

const clinic_history_details = (req, res) => {
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
};

const user_history = (req, res) => {
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
};

const students = (req, res) => {
  User.find()
    .sort({ name: 1 })
    .then((result) => {
      console.log(result);
      res.render("students", { students: result });
    })
    .catch((err) => {
      console.log(err);
    });
};

const sendSMS = async (req, res) => {
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
};
