window.onload = function () {
  var rfidInput = document.getElementById("rfid_input");

  var scanButton = document.getElementById("scan_button");
  scanButton.addEventListener("click", function () {
    scanning();
  });

  function scanning() {
    rfidInput.focus();
    document.getElementById("scan_text").innerHTML = "SCANNING ...";
    scanButton.classList.add("border-red-400");
    scanButton.classList.add("bg-red-100");
    scanButton.classList.remove("border-dashed");
    scanButton.classList.add("border");
  }

  function scanned() {
    document.getElementById("scan_text").innerHTML = "SCANNED";
    document.getElementById("scan_subtitle").innerHTML = "RFID Card Scanned Successfully";
    scanButton.classList.remove("border-red-400");
    scanButton.classList.remove("bg-red-100");
    scanButton.classList.add("border-2");
    scanButton.classList.remove("border");
  }

  document.addEventListener("keydown", function (event) {
    if (event.code == "Enter") {
      scanned()
    }
  });
};
