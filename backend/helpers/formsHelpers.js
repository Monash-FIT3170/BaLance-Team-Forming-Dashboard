const { google } = require('googleapis');
const { GoogleAuth } = require('google-auth-library');
const { response } = require('express');
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
async function getFormResponseList(auth,formId){
    const authClient = await auth.getClient();
    const forms = google.forms({ version: 'v1', auth: authClient });
    const responses = await forms.forms.responses.list({ formId });
    // console.log(responses.data.responses)
    return responses;
}

async function getFormResponse(auth,formId,responseId){
    const authClient = await auth.getClient();
    const forms = google.forms({ version: 'v1', auth: authClient });
    const response = await forms.forms.responses.get({formId,responseId})
    return response
}

async function getForm(auth, formId){
    const authClient = await auth.getClient();
    const forms = google.forms({ version: 'v1', auth: authClient });
    const form = await forms.forms.get({formId})
    // console.log(form.data.items[0].questionItem)

}

//example usage is getFormResponses(forms,'1KKE9CKONUECsCMMTLWql0Q9PPmgk7z2RH0FuQ6-rLq0')
//const responses = getFormResponseList(auth,'1wAmNlhVdovg0ULG2SH3HIsnHMcJoJ55i8LVnm7QP9qE')

// TODO: Replace with standardised IDs
BELBIN_TYPE_ID = '299979bf'
EFFORT_ID = '4d44c000'
STUDENT_ID = '16df7bea'


async function getBelbinResponse(auth, formId) {
    const belbinResponses = await getFormResponseList(auth,formId);
    responseList = []
    for (let i = 0; i < belbinResponses.data.responses.length; i++) {
        answer = belbinResponses.data.responses[i].answers
        belbinType = answer[BELBIN_TYPE_ID].textAnswers.answers[0].value
        studentId = answer[STUDENT_ID].textAnswers.answers[0].value
        responseList.push([studentId, belbinType])
    }
    return responseList
}

async function getEffortResponse(auth, formId) {
    const belbinResponses = await getFormResponseList(auth,formId);
    responseList = []
    for (let i = 0; i < belbinResponses.data.responses.length; i++) {
        answer = belbinResponses.data.responses[i].answers
        effort = answer[EFFORT_ID].textAnswers.answers[0].value
        studentId = answer[STUDENT_ID].textAnswers.answers[0].value
        responseList.push([studentId, effort, 70])
    }
    return responseList
}

// TODO: Replace with check for number for IDs to form
// ORDER SENSITIVE! Preference IDs MUST be listed in the order they are in the SQL table
preference_ids = ['785732d7', '48f63368', '62f90bcd', '3ecb43fa', '502b627b', '31406d5e', '7128b09f', '0113e93b', '3a0af029', '075ae5ce']

async function getPreferenceResponse(auth, formId) {
    const belbinResponses = await getFormResponseList(auth,formId);
    let responseList = []
    for (let i = 0; i < belbinResponses.data.responses.length; i++) {
        answer = belbinResponses.data.responses[i].answers
        studentId = answer[STUDENT_ID].textAnswers.answers[0].value

        let response = [studentId]
        for (let j = 0; j < preference_ids.length; j++) {
            response.push(preference_ids[j]);
        }
        responseList.push(response)
    }
    return responseList
}

// getBelbinResponse(auth, '1wAmNlhVdovg0ULG2SH3HIsnHMcJoJ55i8LVnm7QP9qE')
// getEffortResponse(auth, '1gaVlsQARmiYYTmgr3wezZdWFJxVcyrWAaFpX5QleVy8')
// getPreferenceResponse(auth, '1BPup6OBO3qyp3Tob2fpTZloGHPuvbzzmFADdNI_NcTg')



module.exports = {
    getBelbinResponse,
    getEffortResponse,
    getPreferenceResponse
}