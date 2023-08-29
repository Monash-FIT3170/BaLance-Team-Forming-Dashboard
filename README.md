![Balance Logo](/docs/images/balance-logo.png)

# BaLance - Team Forming Dashboard

BaLance is a tool for teaching associates to split student cohorts into well Balanced teams that gel well together 
and work productively.

It makes use of student personality data to determine the optimal team formations and provides a variety of team
formation strategies for teaching associates to select from.

# Features

* Forms groups between students using one of multiple available formation strategies
* View group by group and cohort wide analytics on personality distribution
* Export group allocation data in CSV format for use with your learning management system

# Basic Usage

## Dependencies

[Install node v18.16.0 or later](https://nodejs.org/en/download/package-manager)

[Install MYSQL server v8.0.33 or later](https://dev.mysql.com/downloads/mysql/) 


## Running the application

1. Clone the repository `git clone https://github.com/Monash-FIT3170/baLance.git`

2. In the repository root run `cd backend; npm i; cd ../frontend; npm i; cd ../`

3. Run database/schemaCreation.sql using mySQL

4. Run the server in backend/ `nodemon server.js`

5. Run the application in frontend/ `npm start`

## Walkthrough

1. To use the team forming dashboard, create a new offering for the unit you are currently running

2. Enter the unit and upload your csv list of students with their student details

3. Upload student personality data in accordance with the strategy you would like to form teams
against

4. Select your group formation strategy and form groups
!
5. Optionally export group information as a csv to upload to your learning management system

![Basic runthrough](docs/videos/basic-runthrough.gif)

# Contributors

[Abigail Lithwick](https://github.com/abigail-rose)

[Ahmed Khadawardi]()

[Alex Kanellis](https://github.com/akanel15)

[Baaset Moslih](https://github.com/AbBaSaMo)

[Cheryl Lau](https://github.com/clau-0016)

[Francis Anthony](https://github.com/francisanthony17)

[James Hunt](https://github.com/jhun0012)

[Jon Yip](https://github.com/jon65)

[Luke Bonso](https://github.com/lbon0008)

[Mariah McCleery](https://github.com/MariahMcCleery)

[Mark Mikhail](https://github.com/Mark-Mikhail)

[Matthew Finis](https://github.com/mfin0008)

[Nethara Athukorala](https://github.com/nath0002)

# License

The license we use for this project is the [GPL v3](https://www.gnu.org/licenses/quick-guide-gplv3.html)

