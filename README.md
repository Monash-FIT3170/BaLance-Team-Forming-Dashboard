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
3. [Authentication](#authentication)
4. [Development guidelines](#development-guidelines)
    - [Extending group formation strategies](#extending-group-formation-strategies)
    - [Known issues](#known-issues)
    - [Pull Requests](#pull-requests)
    - [Branching Strategy](#branch-strategy)
    - [Versioning](#versioning)
7. [Contributors](#contributors)
8. [License](#license)

# Features

* Forms groups between students using one of multiple available formation strategies
* View group by group and cohort wide analytics on personality distribution
* Export group allocation data in CSV format for use with your learning management system

# Basic Usage

## Dependencies

The project uses the following versions of node and MYSQL respectively

[Node v18.16.0 & npm v9.6.7](https://nodejs.org/en/download/package-manager)

[MYSQL server v8.0.33](https://dev.mysql.com/downloads/mysql/) 


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

[//]: # (TODO, new gif showcasing new application view rather than the old one)

![Basic runthrough](docs/videos/basic-runthrough.gif) 

## Authentication

Authentication is done using Auth0. An Auth0 account is required to use this authentication. Follow the guide here: https://www.youtube.com/watch?v=GGGjnBkN8xk to setup the Auth0 account and applications.

When creating the application, the following needs to be filled out.

Single Page Application:
- Allowed Callback URLs = http://localhost:3000/
- Allowed Logout URLs = http://localhost:3000/
- Allowed Web Origins = http://localhost:3000/

Machine to Machine:
- Do not alter the default settings.

For the frontend you need to note down the following details:
 - domain
 - clientId

For the backend you need to note down the following details:
 - issuerBaseURL (same as domain)

Place these details in the .env files for both backend and frontend.

Backend:
 - AUTH_DOMAIN={issuerBaseURL}

Frontend:
 - REACT_APP_AUTH_DOMAIN={domain}
 - REACT_APP_AUTH_CLIENT_ID={clientId}

Authentication has both a TEST and DEV environment set in both the frontend/.env (as REACT_APP_AUTH) and backend/.env (as AUTH).

The Auth DEV environment uses a mock authentication service. This is for when developing and testing new API calls.

The Auth TEST environment uses Auth0 authentication. (Note: Auth0 authentication when using the free tier has a rate limit, which is reached very quickly if navigating the app quickly.)

Use Auth DEV for development, and switch to Auth TEST to confirm that the implementation works with the Auth0 Authentication.

# Development guidelines

## Extending group formation strategies

In order to extend the available array of group formation strategies, the following additions must be made across the app:

Implement a group formation strategy under backend/helpers/groupFormationHelpers.js and append it to the groupFormationStrategies object

![Group formation strategies](/docs/images/extending_strats_forming_groups.png)

Implement functions for fetching unit and group analytics using data for the new strategy and append them to the 
getUnitAnalyticStrategies and getGroupAnalyticStrategies functions respectively.

![Group analytic strategies](/docs/images/extending_strats_analytics.png)

- **!NOTE:** that the keys for the strategy you are adding must match across the 3 aforementioned objects as shown in the images above
- **!NOTE:** that the following structure must be adhered to when creating the API response for analytics

![Example analytics data](/docs/images/sample_analytics_data.png)

Add options to the dropdowns across ImportPage.jsx and CreateGroups.jsx in frontend/src/pages, ensuring the option values match 
the keys for the objects that were added to in the backend as described above

![Frontend changes](/docs/images/extending_strats_frontend_dropdowns.png)

## Known bugs

- [ ] [On moving students for a given csv file, student is duplicated in database causing eventual crash](https://github.com/Monash-FIT3170/baLance/issues/52)
- [ ] [Units cannot currently be deleted in the main home page](https://github.com/Monash-FIT3170/baLance/issues/87)
- [ ] [Group analytics page displaying data incorrectly](https://github.com/Monash-FIT3170/baLance/issues/89)
- [ ] [Unit cards in the home page do not display correctly on some displays](https://github.com/Monash-FIT3170/baLance/issues/88)

## Pull Requests

### Creating Pull Requests

When creating a pull request, leave a comment listing out all:
- changes
- additions
- subtractions
- added features 
- bug fixes

Assign at least 3 reviewers to the PR and assign people who worked on the branch as the assignees.

Assign the relevant label to the PR.

Before creating a pull request, ensure the application passes all CI/CD tests. Any failures in the pipeline will result in the pull request being rejected.

Once the PR is approved, commence merging to main, ensuring that all pipeline tests pass.

### Approving Pull Requests

When approving a pull request, review the code and provide comments where necessary. If changes have to be made, let the requester know, and ensure those changes are made before approving the merge.

Ensure that the merge passes all pipeline tests.

A minimum of one person must approve the PR in order to merge to main.

## Branching Strategy

The task branching strategy is used for this project. The branch to be used for deployment is the main branch. All branches origins must be from the main branch.

When a new feature is being worked on, the branch must begin with "feat/" followed by the feature to be implemented. The branch can be further sub-divided into smaller branches if required, using the same convention.

When a bug is being worked on, the branch must begin with "fix/" followed by the bug to be fixed.

When working on documentation, the branch must begin with "docs/" followed by the documents to be worked on.

When working on refactoring, the branch must begin with "refactor/" followed by what is being refactored.

All commits must follow the Convential Commit format as specified by Convential Commit Organisation website. (https://www.conventionalcommits.org/en/v1.0.0/)

## Versioning
The versioning strategy used by this project is semantic versioning (MAJOR.MINOR.PATCH) and is split between the frontend and backend. 
Major values must match the backend and frontend versions to guarantee compatibility. Minor and patch values do not need to match 
between the frontend and backend versions for compatibility.

### Backend
The version is 1.0.0 as of 20/10/2023, the first initial release of the backend application.

The Patch version must be incremented when a backward compatible bug fix is introduced.

The Minor version must be incremented when a new backward compatible functionality is introduced, or a functionality is deprecated.

The Major version must be incremented when a new non-backward compatible functionality is introduced.

### Frontend
The version is 1.0.0 as of 20/10/2023, the first initial release of the frontend application.

The Patch version must be incremented when a backward compatiable bug fix is introduced.

The Minor version must be incremented when a new backward compatible functionality is introduced, or a functionality is deprecated.

The Major version must be incremented when a new non-backward compatible functionality is introduced.

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

