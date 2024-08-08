const { google } = require('googleapis');
const { GoogleAuth } = require('google-auth-library');
const path = require('path');

const SERVICE_ACCOUNT_FILE = JSON.parse(process.env.SERVICE_ACCOUNT_FILE)
const SCOPES = ['https://www.googleapis.com/auth/forms', 'https://www.googleapis.com/auth/drive'];
const auth = new GoogleAuth({
    keyFile: SERVICE_ACCOUNT_FILE,
    scopes: SCOPES,
});

const authClient = await auth.getClient();
const forms = google.forms({ version: 'v1', auth: authClient });

async function createForm(service,formBody){
  const result = await service.forms.create({ requestBody: formBody });
  return result;
}
//note: this can probably only fetch responses from forms the service account has access to, either send the form to the email or make the account create it using createForm. 
async function getFormResponses(service,formId){
    
  const responses = await service.forms.responses.list({ formId });
  return responses;
}
//example usage is getFormResponses(forms,'1KKE9CKONUECsCMMTLWql0Q9PPmgk7z2RH0FuQ6-rLq0')

