window.onload = function () {
  var rfidNumbers = document.querySelectorAll(".rfid");
  var profileDivs = document.querySelectorAll(".profile_div");

  console.log(rfidNumbers[0].innerText);

  

  for (let i = 0; i < rfidNumbers.length; i++) {
    const element = profileDivs[i];

    profileDivs[i].addEventListener("click", function (event) {
        window.location.href = "/profile/" + rfidNumbers[i].innerText + "/";
      });
  }
};
