# MediSYNC - School Clinic Management System
A School Clinic Management System that implements RFID cards to provide the most efficient way to access healthcare at school especially for emergencies where time, accuracy, and information is crucial.

### Built Using
MediSYNC is built using these technologies:
<div align="left">
  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg" height="30" alt="javascript logo"  />
  <img width="12" />
  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/html5/html5-original.svg" height="30" alt="html5 logo"  />
  <img width="12" />
  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/css3/css3-original.svg" height="30" alt="css3 logo"  />
  <img width="12" />
  <img src="https://img.icons8.com/office80/512/express-js.png" height="30" alt="css3 logo"  />
  <img width="12" />
  <img src="https://user-images.githubusercontent.com/4727/38117898-75c704e4-336c-11e8-82bb-dffd73f55e94.png" height="30" alt="css3 logo"  />
  <img width="12" />
  <img src="https://www.svgrepo.com/show/374118/tailwind.svg" height="30" alt="css3 logo"  />
  <img width="12" />
  <img src="https://img.icons8.com/?size=512&id=74402&format=png" height="30" alt="css3 logo"  />
</div>

## Home
![home1](https://github.com/user-attachments/assets/754844c9-3519-439c-9f51-35050b7094d3)
#### Home consists:
- Navigation Panel
- ID Scanner
- Visit Stats
- Clinic Visit History

### Tapping the ID
By tapping the students ID on the attached RFID, this will redirect to that **student profile**

## Student Profile
![profile1](https://github.com/user-attachments/assets/02eff1c5-03ff-40de-b5b0-d18594093f10)

This is the student profile, where the student informations are stored including their medical information and numbers to contact which will make the visit more efficient.

## Visit Done
![visit-done1](https://github.com/user-attachments/assets/8a28e47c-ba3a-479e-9437-92daba25c515)

When the visit is done, the nurse will fill out this form for logging purposes. This data will then be stored on **history page**.
##### This not only decrease the time of logging, but this also ensures more accurate data compared to logging it traditionally.

## History
![history1](https://github.com/user-attachments/assets/4551c670-66de-4b4e-96b7-d0336d3196a3)

The history page shows all the visit that has been made and also its information. By clicking a visit, you will be redirected to the **history details page** where more information in shown, including some more information about the student.

## History Details
![details1](https://github.com/user-attachments/assets/26c31ef5-4eae-4467-ae94-d0dfcb6aaa27)

This page shows more details about the selected visit. You could also view the patient profile by clicking the red card.

## Students
![students1](https://github.com/user-attachments/assets/9bf9cc8c-033b-407b-b3fc-fc59f2351c57)

This consists of the student that are currently on the database. Development of this page is expected in the future :)

## Fill Out Form
This isnt included in this repo as of the moment but this page is where the students will fill out their information which is connected to an API Gateway that triggers a Lambda function to pass the data to the database in MongoDB Atlas.

## SMS Message
This uses GSM-Module to send text messages to students parents about their visit in the clinic.

## Email Receipts
Students will also receive an email containing the details of the student visit. This includes the type of visit, time visited, and medication given. 


