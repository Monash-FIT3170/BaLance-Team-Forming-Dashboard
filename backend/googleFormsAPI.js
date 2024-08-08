const { google } = require('googleapis');
const { GoogleAuth } = require('google-auth-library');
require('dotenv').config();``

const SERVICE_ACCOUNT_JSON = JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT_TOKEN )
const SCOPES = ['https://www.googleapis.com/auth/forms', 'https://www.googleapis.com/auth/drive'];
const auth = new GoogleAuth({
    credentials: SERVICE_ACCOUNT_JSON,
    scopes: SCOPES,
});



async function createForm(auth,formBody){
    const authClient = await auth.getClient();
    const forms = google.forms({ version: 'v1', auth: authClient });
    const result = await forms.forms.create({ requestBody: formBody });
    return result;
}
//note: this can probably only fetch responses from forms the service account has access to, either send the form to the email or make the account create it using createForm. 
async function getFormResponses(auth,formId){
    const authClient = await auth.getClient();
    const forms = google.forms({ version: 'v1', auth: authClient });
    const responses = await forms.forms.responses.list({ formId });
    console.log(responses)
    return responses;
}
//example usage is getFormResponses(forms,'1KKE9CKONUECsCMMTLWql0Q9PPmgk7z2RH0FuQ6-rLq0')
const responses = getFormResponses(auth,'1KKE9CKONUECsCMMTLWql0Q9PPmgk7z2RH0FuQ6-rLq0')
