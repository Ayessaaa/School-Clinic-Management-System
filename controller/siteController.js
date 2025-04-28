const { render } = require("ejs");
const User = require("../models/user");
const Visit = require("../models/visit");
const Admin = require("../models/admin");
const serialportgsm = require("serialport-gsm");
const bcrypt = require("bcryptjs");

const nodemailer = require("nodemailer");

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
          .then(async (ress) => {
            await emailSender(result[0], req.body, ress);
            console.log("email sent")
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
  admin = false;

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

const emailSender = async (result, reqBody, resultVisit) => {
  function capitalizeFirstLetter(val) {
    return String(val).charAt(0).toUpperCase() + String(val).slice(1);
  }

  console.log("result", result)
  console.log("reqBody", reqBody)

  if (resultVisit.time_start.split(":")[0] > 12) {
    var hour = resultVisit.time_start.split(":")[0] - 12;
    var am_pm = "PM";
  } else {
    var hour = resultVisit.time_start.split(":")[0];
    var am_pm = "AM";
  }

  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
      user: "aisamae28@gmail.com",
      pass: "uabd jvwm cnnd kafx",
    },
  });

  const body = `
  <!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <title>Birthday Reminder</title>
    <style>
      body {
        margin: 0;
        padding: 0;
        font-family: Arial, sans-serif;
        background-color: #fcf2f8;
      }
      table {
        border-collapse: collapse;
        width: 100%;
      }
      .container {
        max-width: 600px;
        margin: 0 auto;
        background-color: #ffffff;
      }
      .header {
        text-align: center;
        padding: 20px;
      }
      .body {
        padding: 20px;
        font-size: 16px;
      }
    </style>
  </head>
  <body>
    <table class="container">
      <!-- Header -->
      <tr>
        <td class="header">
          <h2 style="margin: 10px 0">
            Here's a receipt from your recent clinic visit
          </h2>
        </td>
      </tr>
      <!-- Body -->
      <tr>
        <td class="body">
          <p>Dear ${result.name},</p>
          <p>
            This document serves as an official receipt for the medical visit
            conducted at the school clinic. <br /><br />

            <b>Patient Information:</b><br />
            <ul>
                <li><b>Name:</b> ${result.name}</li>
                <li><b>Student ID:</b> ${result.student_id}</li>
                <li><b>Grade & Section:</b> ${result.section}</li>
            </ul>

            <b>Visit Details:</b><br />
            <ul>
                <li><b>Date:</b> ${resultVisit.date.toLocaleString("en-us", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })}</li>
                <li><b>Time:</b> ${hour +":"+ resultVisit.time_start.split(':')[1] + " " + am_pm}</li>
                <li><b>Reason for Visit:</b> ${reqBody.reason}</li>
                <li><b>Additional Details:</b> ${reqBody.details}</li>
            </ul>

            <b>Medications Administered: ${reqBody.medications}</b><br />
            
            Attending Nurse: ${reqBody.nurse}<br /><br />

            Notes:<br />
            Please keep this receipt for reference and inform the school clinic
            of any updates regarding the patient's health status.<br /><br />

            For inquiries, contact the school clinic.
          </p>
        </td>
      </tr>
    </table>
  </body>
</html>

  `;

  const mailOptions = {
    from: {
      name: "MediSYNC",
      address: "medisync.sti.malolos@gmail.com",
    },
    to: result.email,
    subject: `MediSYNC Receipt`,
    html: body,
  };

  try {
    await transporter.sendMail(mailOptions); // Directly calling sendMail
    console.log("Email sent successfully");
  } catch (error) {
    console.error("Error sending email:", error);
  }

  return {
    statusCode: 200,
    body: JSON.stringify("Email Sent"),
  };
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
