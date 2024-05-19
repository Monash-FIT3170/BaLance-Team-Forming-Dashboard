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

- Forms groups between students using one of multiple available formation strategies
- View group by group and cohort wide analytics on personality distribution
- Export group allocation data in CSV format for use with your learning management system

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

| studentId | labCode     | lastName | preferredName | email                       | wam | gender |
| --------- | ----------- | -------- | ------------- | --------------------------- | --- | ------ |
| 12345678  | 01_DualMode | Jim      | White         | jwhi0001@student.monash.edu | 93  | M      |
| 28462818  | 02_OnCampus | Jemma    | Black         | jbla0001@student.monash.edu | 93  | F      |

- studentId must be an 8-digit number
- labCode must be prefixed by the number and '\_' minimally
- gender must be a single char

### Belbin data

Belbin type must be one of people, thinking or action

| studentId | belbinType |
| --------- | ---------- |
| 12345678  | people     |
| 28462818  | thinking   |

### Effort data

hourCommitment is the estimated number of hours that a student expects to commit in a week

| studentId | hourCommitment | avgAssignmentMark |
| --------- | -------------- | ----------------- |
| 12345678  | 13             | 73                |
| 28462818  | 18             | 84                |

# Development guidelines

Refer to the [feature extention](/docs/contributorsGuide/DEVELOPMENT.md) writeup under docs/ for further details on how to add group formation strategies

<!-- ALL-CONTRIBUTORS-BADGE:START - Do not remove or modify this section -->
[![All Contributors](https://img.shields.io/badge/all_contributors-30-orange.svg?style=flat-square)](#contributors-)
<!-- ALL-CONTRIBUTORS-BADGE:END -->
## Contributors ✨

Thanks goes to these wonderful people ([emoji key](https://allcontributors.org/docs/en/emoji-key)):

<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->
<!-- prettier-ignore-start -->
<!-- markdownlint-disable -->
<table>
  <tbody>
    <tr>
      <td align="center" valign="top" width="14.28%"><a href="https://github.com/abigail-rose"><img src="https://avatars.githubusercontent.com/u/80239117?v=4?s=0" width="0px;" alt="Abby"/><br /><sub><b>Abby</b></sub></a><br /><a href="https://github.com/Monash-FIT3170/BaLance-Team-Forming-Dashboard/commits?author=abigail-rose" title="Code">💻</a> <a href="#design-abigail-rose" title="Design">🎨</a> <a href="https://github.com/Monash-FIT3170/BaLance-Team-Forming-Dashboard/issues?q=author%3Aabigail-rose" title="Bug reports">🐛</a> <a href="https://github.com/Monash-FIT3170/BaLance-Team-Forming-Dashboard/pulls?q=is%3Apr+reviewed-by%3Aabigail-rose" title="Reviewed Pull Requests">👀</a></td>
      <td align="center" valign="top" width="14.28%"><a href="https://github.com/ahes0001"><img src="https://avatars.githubusercontent.com/u/105088591?v=4?s=0" width="0px;" alt="ahes0001"/><br /><sub><b>ahes0001</b></sub></a><br /><a href="https://github.com/Monash-FIT3170/BaLance-Team-Forming-Dashboard/commits?author=ahes0001" title="Code">💻</a> <a href="#design-ahes0001" title="Design">🎨</a> <a href="https://github.com/Monash-FIT3170/BaLance-Team-Forming-Dashboard/issues?q=author%3Aahes0001" title="Bug reports">🐛</a> <a href="https://github.com/Monash-FIT3170/BaLance-Team-Forming-Dashboard/pulls?q=is%3Apr+reviewed-by%3Aahes0001" title="Reviewed Pull Requests">👀</a></td>
      <td align="center" valign="top" width="14.28%"><a href="https://github.com/akanel15"><img src="https://avatars.githubusercontent.com/u/126401755?v=4?s=0" width="0px;" alt="Alex"/><br /><sub><b>Alex</b></sub></a><br /><a href="https://github.com/Monash-FIT3170/BaLance-Team-Forming-Dashboard/commits?author=akanel15" title="Code">💻</a> <a href="#design-akanel15" title="Design">🎨</a> <a href="https://github.com/Monash-FIT3170/BaLance-Team-Forming-Dashboard/issues?q=author%3Aakanel15" title="Bug reports">🐛</a></td>
      <td align="center" valign="top" width="14.28%"><a href="https://github.com/AbBaSaMo"><img src="https://avatars.githubusercontent.com/u/95030427?v=4?s=0" width="0px;" alt="AbBaSamo"/><br /><sub><b>AbBaSamo</b></sub></a><br /><a href="https://github.com/Monash-FIT3170/BaLance-Team-Forming-Dashboard/commits?author=AbBaSaMo" title="Code">💻</a> <a href="#design-AbBaSaMo" title="Design">🎨</a> <a href="https://github.com/Monash-FIT3170/BaLance-Team-Forming-Dashboard/issues?q=author%3AAbBaSaMo" title="Bug reports">🐛</a> <a href="https://github.com/Monash-FIT3170/BaLance-Team-Forming-Dashboard/pulls?q=is%3Apr+reviewed-by%3AAbBaSaMo" title="Reviewed Pull Requests">👀</a> <a href="https://github.com/Monash-FIT3170/BaLance-Team-Forming-Dashboard/commits?author=AbBaSaMo" title="Documentation">📖</a></td>
      <td align="center" valign="top" width="14.28%"><a href="https://github.com/clau-0016"><img src="https://avatars.githubusercontent.com/u/128362499?v=4?s=0" width="0px;" alt="clau-0016"/><br /><sub><b>clau-0016</b></sub></a><br /><a href="https://github.com/Monash-FIT3170/BaLance-Team-Forming-Dashboard/commits?author=clau-0016" title="Code">💻</a> <a href="#design-clau-0016" title="Design">🎨</a> <a href="https://github.com/Monash-FIT3170/BaLance-Team-Forming-Dashboard/issues?q=author%3Aclau-0016" title="Bug reports">🐛</a></td>
      <td align="center" valign="top" width="14.28%"><a href="https://github.com/francisanthony17"><img src="https://avatars.githubusercontent.com/u/109979329?v=4?s=0" width="0px;" alt="francisanthony17"/><br /><sub><b>francisanthony17</b></sub></a><br /><a href="https://github.com/Monash-FIT3170/BaLance-Team-Forming-Dashboard/commits?author=francisanthony17" title="Code">💻</a> <a href="#design-francisanthony17" title="Design">🎨</a> <a href="https://github.com/Monash-FIT3170/BaLance-Team-Forming-Dashboard/issues?q=author%3Afrancisanthony17" title="Bug reports">🐛</a> <a href="https://github.com/Monash-FIT3170/BaLance-Team-Forming-Dashboard/pulls?q=is%3Apr+reviewed-by%3Afrancisanthony17" title="Reviewed Pull Requests">👀</a></td>
      <td align="center" valign="top" width="14.28%"><a href="https://github.com/jhun0012"><img src="https://avatars.githubusercontent.com/u/128357966?v=4?s=0" width="0px;" alt="jhun0012"/><br /><sub><b>jhun0012</b></sub></a><br /><a href="https://github.com/Monash-FIT3170/BaLance-Team-Forming-Dashboard/commits?author=jhun0012" title="Code">💻</a> <a href="#design-jhun0012" title="Design">🎨</a> <a href="https://github.com/Monash-FIT3170/BaLance-Team-Forming-Dashboard/issues?q=author%3Ajhun0012" title="Bug reports">🐛</a> <a href="https://github.com/Monash-FIT3170/BaLance-Team-Forming-Dashboard/pulls?q=is%3Apr+reviewed-by%3Ajhun0012" title="Reviewed Pull Requests">👀</a> <a href="https://github.com/Monash-FIT3170/BaLance-Team-Forming-Dashboard/commits?author=jhun0012" title="Documentation">📖</a></td>
    </tr>
    <tr>
      <td align="center" valign="top" width="14.28%"><a href="https://github.com/jon65"><img src="https://avatars.githubusercontent.com/u/64187809?v=4?s=0" width="0px;" alt="Jonathan Yip"/><br /><sub><b>Jonathan Yip</b></sub></a><br /><a href="https://github.com/Monash-FIT3170/BaLance-Team-Forming-Dashboard/commits?author=jon65" title="Code">💻</a> <a href="#design-jon65" title="Design">🎨</a> <a href="https://github.com/Monash-FIT3170/BaLance-Team-Forming-Dashboard/issues?q=author%3Ajon65" title="Bug reports">🐛</a></td>
      <td align="center" valign="top" width="14.28%"><a href="https://github.com/lbon0008"><img src="https://avatars.githubusercontent.com/u/61959810?v=4?s=0" width="0px;" alt="lbon0008"/><br /><sub><b>lbon0008</b></sub></a><br /><a href="https://github.com/Monash-FIT3170/BaLance-Team-Forming-Dashboard/commits?author=lbon0008" title="Code">💻</a> <a href="#design-lbon0008" title="Design">🎨</a> <a href="https://github.com/Monash-FIT3170/BaLance-Team-Forming-Dashboard/issues?q=author%3Albon0008" title="Bug reports">🐛</a> <a href="https://github.com/Monash-FIT3170/BaLance-Team-Forming-Dashboard/pulls?q=is%3Apr+reviewed-by%3Albon0008" title="Reviewed Pull Requests">👀</a></td>
      <td align="center" valign="top" width="14.28%"><a href="https://github.com/MariahMcCleery"><img src="https://avatars.githubusercontent.com/u/89681870?v=4?s=0" width="0px;" alt="MariahMcCleery"/><br /><sub><b>MariahMcCleery</b></sub></a><br /><a href="https://github.com/Monash-FIT3170/BaLance-Team-Forming-Dashboard/commits?author=MariahMcCleery" title="Code">💻</a> <a href="#design-MariahMcCleery" title="Design">🎨</a> <a href="https://github.com/Monash-FIT3170/BaLance-Team-Forming-Dashboard/issues?q=author%3AMariahMcCleery" title="Bug reports">🐛</a> <a href="https://github.com/Monash-FIT3170/BaLance-Team-Forming-Dashboard/commits?author=MariahMcCleery" title="Documentation">📖</a></td>
      <td align="center" valign="top" width="14.28%"><a href="https://github.com/Mark-Mikhail"><img src="https://avatars.githubusercontent.com/u/128358310?v=4?s=0" width="0px;" alt="Mark-Mikhail"/><br /><sub><b>Mark-Mikhail</b></sub></a><br /><a href="https://github.com/Monash-FIT3170/BaLance-Team-Forming-Dashboard/commits?author=Mark-Mikhail" title="Code">💻</a> <a href="#design-Mark-Mikhail" title="Design">🎨</a> <a href="https://github.com/Monash-FIT3170/BaLance-Team-Forming-Dashboard/issues?q=author%3AMark-Mikhail" title="Bug reports">🐛</a> <a href="https://github.com/Monash-FIT3170/BaLance-Team-Forming-Dashboard/pulls?q=is%3Apr+reviewed-by%3AMark-Mikhail" title="Reviewed Pull Requests">👀</a></td>
      <td align="center" valign="top" width="14.28%"><a href="https://github.com/mfin0008"><img src="https://avatars.githubusercontent.com/u/88076329?v=4?s=0" width="0px;" alt="mfin0008"/><br /><sub><b>mfin0008</b></sub></a><br /><a href="https://github.com/Monash-FIT3170/BaLance-Team-Forming-Dashboard/commits?author=mfin0008" title="Code">💻</a> <a href="#design-mfin0008" title="Design">🎨</a> <a href="https://github.com/Monash-FIT3170/BaLance-Team-Forming-Dashboard/issues?q=author%3Amfin0008" title="Bug reports">🐛</a> <a href="https://github.com/Monash-FIT3170/BaLance-Team-Forming-Dashboard/pulls?q=is%3Apr+reviewed-by%3Amfin0008" title="Reviewed Pull Requests">👀</a></td>
      <td align="center" valign="top" width="14.28%"><a href="https://github.com/nath0002"><img src="https://avatars.githubusercontent.com/u/111645579?v=4?s=0" width="0px;" alt="nath0002"/><br /><sub><b>nath0002</b></sub></a><br /><a href="https://github.com/Monash-FIT3170/BaLance-Team-Forming-Dashboard/commits?author=nath0002" title="Code">💻</a> <a href="#design-nath0002" title="Design">🎨</a> <a href="https://github.com/Monash-FIT3170/BaLance-Team-Forming-Dashboard/issues?q=author%3Anath0002" title="Bug reports">🐛</a></td>
      <td align="center" valign="top" width="14.28%"><a href="https://github.com/Iandawarrior"><img src="https://avatars.githubusercontent.com/u/17513301?v=4?s=0" width="0px;" alt="Ian Kabil Felix"/><br /><sub><b>Ian Kabil Felix</b></sub></a><br /><a href="#mentoring-Iandawarrior" title="Mentoring">🧑‍🏫</a></td>
    </tr>
    <tr>
      <td align="center" valign="top" width="14.28%"><a href="https://github.com/riordanalfredo"><img src="https://avatars.githubusercontent.com/u/17421174?v=4?s=0" width="0px;" alt="Riordan Alfredo"/><br /><sub><b>Riordan Alfredo</b></sub></a><br /><a href="#mentoring-riordanalfredo" title="Mentoring">🧑‍🏫</a> <a href="#design-riordanalfredo" title="Design">🎨</a> <a href="#data-riordanalfredo" title="Data">🔣</a> <a href="#ideas-riordanalfredo" title="Ideas, Planning, & Feedback">🤔</a></td>
      <td align="center" valign="top" width="14.28%"><a href="https://github.com/Rishi-Bidani"><img src="https://avatars.githubusercontent.com/u/64310471?v=4?s=0" width="0px;" alt="Rishi-Bidani"/><br /><sub><b>Rishi-Bidani</b></sub></a><br /><a href="https://github.com/Monash-FIT3170/BaLance-Team-Forming-Dashboard/commits?author=Rishi-Bidani" title="Code">💻</a> <a href="#design-Rishi-Bidani" title="Design">🎨</a> <a href="https://github.com/Monash-FIT3170/BaLance-Team-Forming-Dashboard/issues?q=author%3ARishi-Bidani" title="Bug reports">🐛</a></td>
      <td align="center" valign="top" width="14.28%"><a href="https://github.com/SetPizzaOnBroil30min"><img src="https://avatars.githubusercontent.com/u/123727073?v=4?s=0" width="0px;" alt="Domico Carlo"/><br /><sub><b>Domico Carlo</b></sub></a><br /><a href="https://github.com/Monash-FIT3170/BaLance-Team-Forming-Dashboard/commits?author=SetPizzaOnBroil30min" title="Code">💻</a> <a href="#design-SetPizzaOnBroil30min" title="Design">🎨</a> <a href="https://github.com/Monash-FIT3170/BaLance-Team-Forming-Dashboard/issues?q=author%3ASetPizzaOnBroil30min" title="Bug reports">🐛</a></td>
      <td align="center" valign="top" width="14.28%"><a href="https://github.com/Alucardigan"><img src="https://avatars.githubusercontent.com/u/100405818?v=4?s=0" width="0px;" alt="Thejas "/><br /><sub><b>Thejas </b></sub></a><br /><a href="https://github.com/Monash-FIT3170/BaLance-Team-Forming-Dashboard/commits?author=Alucardigan" title="Code">💻</a> <a href="#design-Alucardigan" title="Design">🎨</a> <a href="https://github.com/Monash-FIT3170/BaLance-Team-Forming-Dashboard/issues?q=author%3AAlucardigan" title="Bug reports">🐛</a></td>
      <td align="center" valign="top" width="14.28%"><a href="https://github.com/ZCStephen"><img src="https://avatars.githubusercontent.com/u/131650135?v=4?s=0" width="0px;" alt="ZCStephen"/><br /><sub><b>ZCStephen</b></sub></a><br /><a href="https://github.com/Monash-FIT3170/BaLance-Team-Forming-Dashboard/commits?author=ZCStephen" title="Code">💻</a> <a href="#design-ZCStephen" title="Design">🎨</a> <a href="https://github.com/Monash-FIT3170/BaLance-Team-Forming-Dashboard/issues?q=author%3AZCStephen" title="Bug reports">🐛</a></td>
      <td align="center" valign="top" width="14.28%"><a href="https://github.com/jeffreyyan4"><img src="https://avatars.githubusercontent.com/u/163799488?v=4?s=0" width="0px;" alt="jeffreyyan4"/><br /><sub><b>jeffreyyan4</b></sub></a><br /><a href="https://github.com/Monash-FIT3170/BaLance-Team-Forming-Dashboard/commits?author=jeffreyyan4" title="Code">💻</a> <a href="#design-jeffreyyan4" title="Design">🎨</a> <a href="https://github.com/Monash-FIT3170/BaLance-Team-Forming-Dashboard/issues?q=author%3Ajeffreyyan4" title="Bug reports">🐛</a></td>
      <td align="center" valign="top" width="14.28%"><a href="https://github.com/LachlanWilliams"><img src="https://avatars.githubusercontent.com/u/93383173?v=4?s=0" width="0px;" alt="Lachlan Williams"/><br /><sub><b>Lachlan Williams</b></sub></a><br /><a href="https://github.com/Monash-FIT3170/BaLance-Team-Forming-Dashboard/commits?author=LachlanWilliams" title="Code">💻</a> <a href="#design-LachlanWilliams" title="Design">🎨</a> <a href="https://github.com/Monash-FIT3170/BaLance-Team-Forming-Dashboard/issues?q=author%3ALachlanWilliams" title="Bug reports">🐛</a></td>
    </tr>
    <tr>
      <td align="center" valign="top" width="14.28%"><a href="https://github.com/ying-tsai-wang"><img src="https://avatars.githubusercontent.com/u/127176651?v=4?s=0" width="0px;" alt="charles"/><br /><sub><b>charles</b></sub></a><br /><a href="https://github.com/Monash-FIT3170/BaLance-Team-Forming-Dashboard/commits?author=ying-tsai-wang" title="Code">💻</a> <a href="#design-ying-tsai-wang" title="Design">🎨</a> <a href="https://github.com/Monash-FIT3170/BaLance-Team-Forming-Dashboard/issues?q=author%3Aying-tsai-wang" title="Bug reports">🐛</a></td>
      <td align="center" valign="top" width="14.28%"><a href="https://github.com/dhon0010"><img src="https://avatars.githubusercontent.com/u/162076320?v=4?s=0" width="0px;" alt="dhon0010"/><br /><sub><b>dhon0010</b></sub></a><br /><a href="https://github.com/Monash-FIT3170/BaLance-Team-Forming-Dashboard/commits?author=dhon0010" title="Code">💻</a> <a href="#design-dhon0010" title="Design">🎨</a> <a href="https://github.com/Monash-FIT3170/BaLance-Team-Forming-Dashboard/issues?q=author%3Adhon0010" title="Bug reports">🐛</a></td>
      <td align="center" valign="top" width="14.28%"><a href="https://github.com/kbay0009"><img src="https://avatars.githubusercontent.com/u/102573143?v=4?s=0" width="0px;" alt="kbay0009"/><br /><sub><b>kbay0009</b></sub></a><br /><a href="https://github.com/Monash-FIT3170/BaLance-Team-Forming-Dashboard/commits?author=kbay0009" title="Code">💻</a> <a href="#design-kbay0009" title="Design">🎨</a> <a href="https://github.com/Monash-FIT3170/BaLance-Team-Forming-Dashboard/issues?q=author%3Akbay0009" title="Bug reports">🐛</a></td>
      <td align="center" valign="top" width="14.28%"><a href="https://github.com/WofWaf"><img src="https://avatars.githubusercontent.com/u/97369669?v=4?s=0" width="0px;" alt="Trevor Yao"/><br /><sub><b>Trevor Yao</b></sub></a><br /><a href="https://github.com/Monash-FIT3170/BaLance-Team-Forming-Dashboard/commits?author=WofWaf" title="Code">💻</a> <a href="#design-WofWaf" title="Design">🎨</a> <a href="https://github.com/Monash-FIT3170/BaLance-Team-Forming-Dashboard/issues?q=author%3AWofWaf" title="Bug reports">🐛</a></td>
      <td align="center" valign="top" width="14.28%"><a href="https://github.com/oneil1625"><img src="https://avatars.githubusercontent.com/u/163804456?v=4?s=0" width="0px;" alt="oneil1625"/><br /><sub><b>oneil1625</b></sub></a><br /><a href="https://github.com/Monash-FIT3170/BaLance-Team-Forming-Dashboard/commits?author=oneil1625" title="Code">💻</a> <a href="#design-oneil1625" title="Design">🎨</a> <a href="https://github.com/Monash-FIT3170/BaLance-Team-Forming-Dashboard/issues?q=author%3Aoneil1625" title="Bug reports">🐛</a></td>
      <td align="center" valign="top" width="14.28%"><a href="https://github.com/echu0033"><img src="https://avatars.githubusercontent.com/u/163799481?v=4?s=0" width="0px;" alt="echu0033"/><br /><sub><b>echu0033</b></sub></a><br /><a href="https://github.com/Monash-FIT3170/BaLance-Team-Forming-Dashboard/commits?author=echu0033" title="Code">💻</a> <a href="#design-echu0033" title="Design">🎨</a> <a href="https://github.com/Monash-FIT3170/BaLance-Team-Forming-Dashboard/issues?q=author%3Aechu0033" title="Bug reports">🐛</a></td>
      <td align="center" valign="top" width="14.28%"><a href="https://github.com/Aung33270333"><img src="https://avatars.githubusercontent.com/u/127281485?v=4?s=0" width="0px;" alt="Aung33270333"/><br /><sub><b>Aung33270333</b></sub></a><br /><a href="https://github.com/Monash-FIT3170/BaLance-Team-Forming-Dashboard/commits?author=Aung33270333" title="Code">💻</a> <a href="#design-Aung33270333" title="Design">🎨</a> <a href="https://github.com/Monash-FIT3170/BaLance-Team-Forming-Dashboard/issues?q=author%3AAung33270333" title="Bug reports">🐛</a></td>
    </tr>
    <tr>
      <td align="center" valign="top" width="14.28%"><a href="https://github.com/me-za"><img src="https://avatars.githubusercontent.com/u/90816008?v=4?s=0" width="0px;" alt="me-za"/><br /><sub><b>me-za</b></sub></a><br /><a href="https://github.com/Monash-FIT3170/BaLance-Team-Forming-Dashboard/commits?author=me-za" title="Code">💻</a> <a href="#design-me-za" title="Design">🎨</a> <a href="https://github.com/Monash-FIT3170/BaLance-Team-Forming-Dashboard/issues?q=author%3Ame-za" title="Bug reports">🐛</a></td>
      <td align="center" valign="top" width="14.28%"><a href="https://github.com/dcor0010"><img src="https://avatars.githubusercontent.com/u/163801705?v=4" width="0px;" alt="dcor0010"/><br /><sub><b>dcor0010</b></sub></a><br /><a href="https://github.com/Monash-FIT3170/BaLance-Team-Forming-Dashboard/commits?author=dcor0010" title="Code">💻</a> <a href="#design-dcor0010" title="Design">🎨</a> <a href="https://github.com/Monash-FIT3170/BaLance-Team-Forming-Dashboard/issues?q=author%3Adcor0010" title="Bug reports">🐛</a></td>
      <td align="center" valign="top" width="14.28%"><a href="https://github.com/alexismcharo"><img src="https://avatars.githubusercontent.com/u/163802955?v=4?s=0" width="0px;" alt="alexismcharo"/><br /><sub><b>alexismcharo</b></sub></a><br /><a href="https://github.com/Monash-FIT3170/BaLance-Team-Forming-Dashboard/commits?author=alexismcharo" title="Code">💻</a> <a href="#design-alexismcharo" title="Design">🎨</a> <a href="https://github.com/Monash-FIT3170/BaLance-Team-Forming-Dashboard/issues?q=author%3Aalexismcharo" title="Bug reports">🐛</a></td>
      
    </tr>
  </tbody>
</table>

<!-- markdownlint-restore -->
<!-- prettier-ignore-end -->

<!-- ALL-CONTRIBUTORS-LIST:END -->

This project follows the [all-contributors](https://github.com/all-contributors/all-contributors) specification. Contributions of any kind welcome!