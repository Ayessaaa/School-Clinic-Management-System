window.onload = function(){
    var rfidInput = document.getElementById("rfid_input");
    
    var scanButton = document.getElementById("scan_button")
    scanButton.addEventListener("click", function(){
        scanning();
    })

    function scanning(){
        rfidInput.focus();
        document.getElementById("scan_text").innerHTML = "SCANNING ...";
        scanButton.classList.add("border-red-400")
        scanButton.classList.add("bg-red-100")
        scanButton.classList.remove("border-dashed")
        scanButton.classList.add("border")
    }

    


    document.addEventListener("keydown", function(event){
        if(event.code == "Enter"){
            var rfidNumber = document.getElementById("rfid_input").value;
            window.location.href = "/profile/"+rfidNumber;
        } 
    })

}