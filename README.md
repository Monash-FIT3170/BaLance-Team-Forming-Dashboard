<img src="/docs/images/balance-logo.png" width="200"/>

# BaLance - Team Forming Dashboard

BaLance is a tool for teaching associates to split student cohorts into well Balanced teams that gel well together 
and work productively.

It makes use of student personality data to determine the optimal team formations and provides a variety of team
formation strategies for teaching associates to select from.

# Table of Contents

1. [Features](#features)
2. [Basic Usage](#basic-usage)
    - [Running the application](#running-the-application)
    - [Walkthrough](#walkthrough)
    - [CSV data](#csv-data-format)
3. [Development guidelines](#development-guidelines)
4. [Contributors](#contributors)
5. [License](#license)

# Features

* Forms groups between students using one of multiple available formation strategies
* View group by group and cohort wide analytics on personality distribution
* Export group allocation data in CSV format for use with your learning management system

# Basic Usage

## Running the application

Install and setup

```shell
git clone https://github.com/Monash-FIT3170/BaLance-Team-Forming-Dashboard.git;
cd BaLance-Team-Forming-Dashboard/backend; npm i; cd ../frontend; npm i cd ../database;
mysql -h host_address -u user_name -p pass_word < schemaCreation.sql;
```

Run the frontend and backend from their respective directories

`cd backend; nodemon server`
`cd frontend; npm start`

### Using docker

An existing docker-compose can be used however, it must be noted the database must be
run from your local device as an existing image has not yet been implemented.

## Walkthrough

1. To use the team forming dashboard, create a new offering for the unit you are currently running

2. Enter the unit and upload your csv list of students with their student details

3. Upload student personality data in accordance with the strategy you would like to form teams
against

4. Select your group formation strategy and form groups

5. Optionally export group information as a csv to upload to your learning management system

![Basic runthrough](docs/videos/basic-runthrough.gif)

## CSV data format

The following examples outline the expected structure and content of csv files. Note extra columns may be present 
but will be ignored and only what is shown will be used by the application.

### Student data

|studentId|labCode|lastName|preferredName|email|wam|gender|
|--|--|--|--|--|--|-|
|12345678|01_DualMode|Jim|White|jwhi0001@student.monash.edu|93|M|
|28462818|02_OnCampus|Jemma|Black|jbla0001@student.monash.edu|93|F|

* studentId must be an 8-digit number
* labCode must be prefixed by the number and '_' minimally
* gender must be a single char

### Belbin data

Belbin type must be one of people, thinking or action

|studentId|belbinType|
|--|--|
|12345678|people  |
|28462818|thinking|


### Effort data

hourCommitment is the estimated number of hours that a student expects to commit in a week

|studentId|hourCommitment|avgAssignmentMark|
|--|--|--|
|12345678|13|73|
|28462818|18|84|


# Development guidelines

Refer to the [feature extention](/docs/contributorsGuide/DEVELOPMENT.md) writeup under docs/ for further details on how to add group formation strategies

# Contributors [2024]

[Rishi Bidani](https://github.com/Rishi-Bidani)

[Domico Carlo Wibowo](https://github.com/SetPizzaOnBroil30min)

[Zhijun Chen](https://github.com/ZCStephen)

# Contributors

[Abigail Lithwick](https://github.com/abigail-rose)

[Ahmed Khadawardi](https://github.com/ahes0001)

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

[Trevor Yao](https://github.com/WofWaf)
# License

The license we use for this project is the [GPL v3](https://www.gnu.org/licenses/quick-guide-gplv3.html)

