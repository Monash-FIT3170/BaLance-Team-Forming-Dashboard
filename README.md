![Balance Logo](/docs/images/balance-logo.png)

# BaLance - Team Forming Dashboard

BaLance is a tool for teaching associates to split student cohorts into well Balanced teams that gel well together 
and work productively.

It makes use of student personality data to determine the optimal team formations and provides a variety of team
formation strategies for teaching associates to select from.

# Table of Contents

1. [Features](#features)
2. [Basic Usage](#basic-usage)
    - [Dependencies](#dependencies)
    - [Running the application](#running-the-application)
    - [Walkthrough](#walkthrough)
4. [Authentication](#authentication)
4. [Additional notes](#additional-notes)
    - [Known issues](#known-issues)
    - [Miscellaneous](#miscellaneous)
5. [Contributors](#contributors)
6. [License](#license)

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

5. Optionally export group information as a csv to upload to your learning management system

![Basic runthrough](docs/videos/basic-runthrough.gif)

## Authentication

Authentication is done using Auth0. An Auth0 account is required to use this authentication. Follow the guide here: https://www.youtube.com/watch?v=GGGjnBkN8xk to setup the Auth0 account and applications.

A summary of what is needed in Auth0 is a Single Page Application and a Machine to Machine API. Make sure when creating the Single Page Application, "Allowed Callback URLs", "Allowed Logout URLs" and "Allowed Web Origins" all have the address "http://localhost:3000/" in them.

For the frontend you need to note down the following details:
 - domain
 - clientId

For the backend you need to note down the following details:
 - issuerBaseURL (same as domain)

Place these details in the .env file for both backend and frontend.

Authentication has both a TEST and DEV envrionment set in both the frontend/.env (REACT_APP_AUTH) and backend/.env (AUTH) files.

The Auth DEV envrionment uses a mock authentication service. This is for when developing and testing new API calls.

The Auth TEST envrionment uses Auth0 authentication. Auth0 authentication when using the free tier has a rate limit, which is reached very quickly if navigating the app quickly.

Use Auth DEV most of the time, and switch to Auth TEST to confirm that the implementation works with the actual authentication.

# Additional notes

## Known issues

* Frontend analytics view displays title and descriptor in analytics card for analytics
that have no data in the backend rather than an empty state
* App crashes when non-integer values are supplied for unit year on unit creation

## Miscellaneous

* Group formation strategies can be extended in backend/helpers/groupFormationHelpers.js by declaring a new function 
that contains the logic for the new strategy and adding it to the strategies object. Frontend strategy selection
dropdown must include a value with the same name as the key in the aforementioned strategies object
* Analytics for new strategies can be added by adding a new function in backend/helpers/groupAnalyticHelpers.js that
retrieves distribution statistics in the right format and returns it as an object

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

