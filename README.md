myReceita
# myReceita

## About the project 
myReceita is a project with the aim of aiding medical professionals in their work with prescriptions. Its main function is to provide automatic renewal of prescriptions, was coded for desktop and mobile use and designed to be as easy to use as possible.

myReceita was created with love by @JoaoReisSilva, @bernardofrc, @MarianaDias1998 and myself (@lc-silverio) as a final project for the bachelor's degree.

For artwork on the projecct it can be viewed here https://www.behance.net/lc-silverio and for additional information or fork requests please check the e-mail on my profile.

## Pre-requisites
These are the pre-requisites for getting the project up and running locally on your machine
- NodeJS [**https://nodejs.org/en/**]
- MariaDB [https://mariadb.org/download/] 
  - use *admin* as the *root* password
- Android Studio [https://developer.android.com/studio]

## Installation
1. After installing the above mentioned software, the first step is to configure our database.
    - Open mariaDB,
    - Fill out the user and password
    - Open the pre-created database server
    - Go to file
    - Upload SQL file
    - Select the SQL file in the project folder and press import

2. Next we import our mobile app
    - Unzip the mobile app zip file 
    - Open Android Studio
    - Go to File
    - Open
    - Open the unzipped mobile app folder

3. Install nodeJS dependencies
    - Go to the project folder
    - Run the "Instalar" batch file
    - This will install all nodeJS dependencies used in our project (Body parser, expressJS, mariaDB and nodemon) on the same versions we used


## Running the project
1. Start the server
    - Go to the project folder
    - Run the "Iniciar Servidor" batch file
    - This will run the server used for the project
    - Keep the terminal window open for the remainder of your testing

2. Start the mobile app
    - In Android Studio, press the green "play" arrow
    - This will open an android emulator with the mobile app
    - Database communications should already be working since you have imported the database and have the server running

3. Start the web app
    - Go to the project folder
    - Double-click in the shortcut named "myReceita"
    - This will open a browser window with the web site of our project on your default browser

### Logging in
1. Doctors private area
    - User: 1234567
    - Password: medico1

2. Pharmaceutical clerks private area
    - User: 3456789
    - Password: farmaceutico1

## How to use
1. Doctors private area
    - Login to the doctors private area with the above credentials
    - Enter a patients id [1, 2, 3, 4 or 12345]
    - Press "Validar"
    - Fill out the form choosing a medicine, entering the amount of boxes to take, the daily intake of pills/spoons, indications on how to take the medicine and check (or not) the "Validar automaticamente" check box. This checkbox allows you to enable the automatic monthly renewal of the prescription
    - Press submit
    - This should add a new prescription to the database

2. Pharmaceutical clerks private area
   - Login to the Pharmaceutical clerks private area with the above credentials
   - Enter a prescriptions id, if you haven't added more than one prescrition on the doctors side your prescription should be No. 11
   - Check the box "Levantado" signaling the the costumer has received the choosen medication.
   - Press submit
   - This should update the prescrition and won't allow you to view that prescription again or it will remove the checked medicine from the prescrition (if it has more than one medicine)