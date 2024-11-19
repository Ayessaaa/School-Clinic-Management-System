window.onload = function () {
  var time = new Date();

  var rfidNumber = document.getElementById("rfid").innerText;
  var visitButton = document.getElementById("visit_button");
  visitButton.addEventListener("click", function (event) {
    window.location.href =
      "/visit-done/" +
      rfidNumber.split(" ")[1] +
      "/" +
      time.getHours() +
      ":" +
      String(time.getMinutes()).padStart(2, "0")+
      ":" +
      String(time.getSeconds()).padStart(2, "0");
  });
};
