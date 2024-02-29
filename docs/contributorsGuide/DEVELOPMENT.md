## Environment variables

Both the frontend and backend require .env files within them containing the following contents:

In /backend/
```.dotenv
PORT=8080
DB_HOST="localhost"
DB_USER="root"
DB_PASSWORD="your password here"
DB="student_group_db"
AUTH="DEV"
``` 

In /frontend/
```.dotenv
REACT_APP_AUTH="DEV"
REACT_APP_AUTH_DOMAIN=""
REACT_APP_AUTH_CLIENT_ID=""
```

## Extending group formation strategies

In order to extend the available array of group formation strategies, the following additions must be made across the app:

Implement a group formation strategy under backend/helpers/groupFormationHelpers.js and append it to the groupFormationStrategies object

<img width="500" src="/docs/images/extending_strats_forming_groups.png"/>


Implement functions for fetching unit and group analytics using data for the new strategy and append them to the
getUnitAnalyticStrategies and getGroupAnalyticStrategies functions respectively.

<img width="500" src="/docs/images/extending_strats_analytics.png"/>

- **!NOTE:** that the keys for the strategy you are adding must match across the 3 aforementioned objects as shown in the images above
- **!NOTE:** that the following structure must be adhered to when creating the API response for analytics

<img width="500" src="/docs/images/sample_analytics_data.png"/>

Add options to the dropdowns across Import.jsx and CreateGroups.jsx in frontend/src/pages, ensuring the option values match
the keys for the objects that were added to in the backend as described above

<img width="500" src="/docs/images/extending_strats_frontend_dropdowns.png"/>

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
