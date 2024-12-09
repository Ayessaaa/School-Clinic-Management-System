window.onload = function () {
  var time = new Date();

  var rfidNumber = document.getElementById("rfid").innerText;
  var visitButton = document.getElementById("visit_button");
  visitButton.addEventListener("click", function (event) {
    window.location.href =
      "/visit-done/" +
      rfidNumber +
      "/" +
      time.getHours() +
      ":" +
      String(time.getMinutes()).padStart(2, "0") +
      ":" +
      String(time.getSeconds()).padStart(2, "0");
  });

  var sendSMS = document.getElementById("SMS");
  sendSMS.addEventListener("click", function (event) {
    const number = document.getElementById("inputnumber").value;
    const body = document.getElementById("body").value;
    const myHeaders = new Headers();
    myHeaders.append(
      "Authorization",
      "App 7333ee0984c5197d5e79aa4b7df06615-703dcd5e-8532-4d02-adcf-44037daf9d32"
    );
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("Accept", "application/json");

    const raw = JSON.stringify({
      messages: [
        {
          destinations: [{ to: "63"+number.slice(1) }],
          from: "447491163443",
          text: body,
        },
      ],
    });

    const requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: raw,
      redirect: "follow",
    };

    fetch("https://kqpyde.api.infobip.com/sms/2/text/advanced", requestOptions)
      .then((response) => response.text())
      .then((result) => console.log(result))
      .then(() => alert("SMS sent"))
      .catch((error) => console.error(error));
  });
};
