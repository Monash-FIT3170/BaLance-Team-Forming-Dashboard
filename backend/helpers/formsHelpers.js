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
const form = getForm(auth, "1wAmNlhVdovg0ULG2SH3HIsnHMcJoJ55i8LVnm7QP9qE")


async function getBelbinResponse(auth, formId) {
    const belbinResponses = await getFormResponseList(auth,formId);
    responseList = []
    for (let i = 0; i < belbinResponses.data.responses.length; i++) {
        answer = belbinResponses.data.responses[i].answers
        belbinType = answer['299979bf'].textAnswers.answers[0].value
        studentId = answer['16df7bea'].textAnswers.answers[0].value
        responseList.push([studentId, belbinType])
    }
    console.log(responseList)
    return responseList
}

async function getEffortResponse(auth, formId) {
    const belbinResponses = await getFormResponseList(auth,formId);
    responseList = []
    for (let i = 0; i < belbinResponses.data.responses.length; i++) {
        answer = belbinResponses.data.responses[i].answers
        effort = answer['4d44c000'].textAnswers.answers[0].value
        studentId = answer['16df7bea'].textAnswers.answers[0].value
        responseList.push([studentId, effort, 70])
    }
    console.log(responseList)
    return responseList
}


async function getPreferenceResponse(auth, formId) {
    const belbinResponses = await getFormResponseList(auth,formId);
    responseList = []
    for (let i = 0; i < belbinResponses.data.responses.length; i++) {
        answer = belbinResponses.data.responses[i].answers
        studentId = answer['16df7bea'].textAnswers.answers[0].value
        pref1 = answer['785732d7'].textAnswers.answers[0].value
        pref2 = answer['48f63368'].textAnswers.answers[0].value
        pref3 = answer['62f90bcd'].textAnswers.answers[0].value
        pref4 = answer['3ecb43fa'].textAnswers.answers[0].value        
        pref5 = answer['502b627b'].textAnswers.answers[0].value
        pref6 = answer['31406d5e'].textAnswers.answers[0].value
        pref7 = answer['7128b09f'].textAnswers.answers[0].value
        pref8 = answer['0113e93b'].textAnswers.answers[0].value
        pref9 = answer['3a0af029'].textAnswers.answers[0].value
        pref10 = answer['075ae5ce'].textAnswers.answers[0].value
        responseList.push([studentId, pref1, pref2, pref3, pref4, pref5, pref6, pref7, pref8, pref9, pref10])
    }
    console.log(responseList)
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