const { google } = require('googleapis');
const { GoogleAuth } = require('google-auth-library');
const { response } = require('express');
const { v4: uuidv4 } = require('uuid');
const { promiseBasedQuery, selectUnitOffKey } = require("./commonHelpers");
const { MAX_ACCESS_BOUNDARY_RULES_COUNT } = require('google-auth-library/build/src/auth/downscopedclient');
require('dotenv').config();``

const SERVICE_ACCOUNT_JSON = JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT_TOKEN )
const SCOPES = ['https://www.googleapis.com/auth/forms', 'https://www.googleapis.com/auth/drive'];
const auth = new GoogleAuth({
    credentials: SERVICE_ACCOUNT_JSON,
    scopes: SCOPES,
});

const formData = require('../data/forms.json');


let belbinFormId = null
let belbinResponderURL = null
let projectFormId = null
let projectResponderURL = null
let effortFormId = null
let effortResponderURL = null

async function createForm(auth,formBody){
    const authClient = await auth.getClient();
    const forms = google.forms({ version: 'v1', auth: authClient });
    const result = await forms.forms.create({ requestBody: formBody });
    return result;
}

async function updateForm(auth, formId, requests) {
  const authClient = await auth.getClient();
  const forms = google.forms({ version: 'v1', auth: authClient });
  try {
    const response = await forms.forms.batchUpdate({
      formId,
      requestBody: {
        "includeFormInResponse": true,
        "requests": requests
      },
    });

    console.log('Form updated successfully:', response.data);
  } catch (error) {
    console.error('Error updating form:', error);
  }
}

function effortForm() {
    return {
      "info": {
        "title": "Effort Allocation Survey",
        "documentTitle": "Effort Allocation"
      }
    };
}

function projectPreferencesForm() {
    return {
      "info": {
        "title": "Project Preferences Survey",
        "documentTitle": "Project Preferences"
      }
    }
}

function belbinForm() {
    return {
      "info": {
        "title": "Belbin Team Roles Survey",
        "documentTitle": "Belbin Team Roles"
      }
    }
}

async function generateForms(effort, project, belbin, unitId) {

    if (effort) {
        var effortFormBody = effortForm()
        var effForm = await createForm(auth, effortFormBody)
        effortFormId = effForm.data.formId;
        effortResponderURL = effForm.data.responderUri;
        await updateForm(auth, effortFormId, formData.effortRequest)
        let formValues = [
          [unitId, effortFormId, 'effort']
        ]
        await promiseBasedQuery("INSERT IGNORE INTO unit_form (unit_off_id, test_id, test_type, responder_url) VALUES ?;", [formValues]);
    }

    if (project) {
        var projectFormBody = projectPreferencesForm()
        var projForm = await createForm(auth, projectFormBody)
        projectFormId = projForm.data.formId
        projectResponderURL = projForm.data.responderUri
        await updateForm(auth, projectFormId, formData.projectRequest)
        let formValues = [
          [unitId, projectFormId, 'preference']
        ]
        await promiseBasedQuery("INSERT IGNORE INTO unit_form (unit_off_id, test_id, test_type, responder_url) VALUES ?;", [formValues]);
    }

    if (belbin) {
        var belbinFormBody = belbinForm()
        var belbForm = await createForm(auth, belbinFormBody)
        belbinFormId = belbForm.data.formId
        belbinResponderURL = belbForm.data.responderUri
        await updateForm(auth, belbinFormId, formData.belbinRequest)
        let formValues = [
          [unitId, belbinFormId, 'belbin']
        ]
        await promiseBasedQuery("INSERT IGNORE INTO unit_form (unit_off_id, test_id, test_type, responder_url) VALUES ?;", [formValues]);
    }
}


//note: this can probably only fetch responses from forms the service account has access to, either send the form to the email or make the account create it using createForm. 
async function getFormResponseList(auth,formId){
    const authClient = await auth.getClient();
    const forms = google.forms({ version: 'v1', auth: authClient });
    const responses = await forms.forms.responses.list({ formId });
    // console.log(JSON.stringify(responses.data.responses))
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

}

//example usage is getFormResponses(forms,'1KKE9CKONUECsCMMTLWql0Q9PPmgk7z2RH0FuQ6-rLq0')
//const responses = getFormResponseList(auth,'1wAmNlhVdovg0ULG2SH3HIsnHMcJoJ55i8LVnm7QP9qE')
//const form = getForm(auth, "1wAmNlhVdovg0ULG2SH3HIsnHMcJoJ55i8LVnm7QP9qE")


async function getBelbinResponse(auth, formId) {
  const belbinResponses = await getFormResponseList(auth, formId);
  let responseList = [];
  
  for (let i = 0; i < belbinResponses.data.responses.length; i++) {
      const answer = belbinResponses.data.responses[i].answers;
      const studentId = answer['00000001'].textAnswers.answers[0].value;
      const ia = parseInt(answer['00000021'].textAnswers.answers[0].value, 10);
      const ib = parseInt(answer['00000022'].textAnswers.answers[0].value, 10);
      const ic = parseInt(answer['00000023'].textAnswers.answers[0].value, 10);
      const id = parseInt(answer['00000024'].textAnswers.answers[0].value, 10);
      const ie = parseInt(answer['00000025'].textAnswers.answers[0].value, 10);
      const iF = parseInt(answer['00000026'].textAnswers.answers[0].value, 10);
      const ig = parseInt(answer['00000027'].textAnswers.answers[0].value, 10);
      const ih = parseInt(answer['00000028'].textAnswers.answers[0].value, 10);
      
      const iia = parseInt(answer['00000031'].textAnswers.answers[0].value, 10);
      const iib = parseInt(answer['00000032'].textAnswers.answers[0].value, 10);
      const iic = parseInt(answer['00000033'].textAnswers.answers[0].value, 10);
      const iid = parseInt(answer['00000034'].textAnswers.answers[0].value, 10);
      const iie = parseInt(answer['00000035'].textAnswers.answers[0].value, 10);
      const iiF = parseInt(answer['00000036'].textAnswers.answers[0].value, 10);
      const iig = parseInt(answer['00000037'].textAnswers.answers[0].value, 10);
      const iih = parseInt(answer['00000038'].textAnswers.answers[0].value, 10);
      
      const iiia = parseInt(answer['00000040'].textAnswers.answers[0].value, 10);
      const iiib = parseInt(answer['00000041'].textAnswers.answers[0].value, 10);
      const iiic = parseInt(answer['00000042'].textAnswers.answers[0].value, 10);
      const iiid = parseInt(answer['00000043'].textAnswers.answers[0].value, 10);
      const iiie = parseInt(answer['00000044'].textAnswers.answers[0].value, 10);
      const iiiF = parseInt(answer['00000045'].textAnswers.answers[0].value, 10);
      const iiig = parseInt(answer['00000046'].textAnswers.answers[0].value, 10);
      const iiih = parseInt(answer['00000047'].textAnswers.answers[0].value, 10);
      
      const iva = parseInt(answer['00000051'].textAnswers.answers[0].value, 10);
      const ivb = parseInt(answer['00000052'].textAnswers.answers[0].value, 10);
      const ivc = parseInt(answer['00000053'].textAnswers.answers[0].value, 10);
      const ivd = parseInt(answer['00000054'].textAnswers.answers[0].value, 10);
      const ive = parseInt(answer['00000055'].textAnswers.answers[0].value, 10);
      const ivF = parseInt(answer['00000056'].textAnswers.answers[0].value, 10);
      const ivg = parseInt(answer['00000057'].textAnswers.answers[0].value, 10);
      const ivh = parseInt(answer['00000058'].textAnswers.answers[0].value, 10);
      
      const va = parseInt(answer['00000061'].textAnswers.answers[0].value, 10);
      const vb = parseInt(answer['00000062'].textAnswers.answers[0].value, 10);
      const vc = parseInt(answer['00000063'].textAnswers.answers[0].value, 10);
      const vd = parseInt(answer['00000064'].textAnswers.answers[0].value, 10);
      const ve = parseInt(answer['00000065'].textAnswers.answers[0].value, 10);
      const vF = parseInt(answer['00000066'].textAnswers.answers[0].value, 10);
      const vg = parseInt(answer['00000067'].textAnswers.answers[0].value, 10);
      const vh = parseInt(answer['00000068'].textAnswers.answers[0].value, 10);
      
      const via = parseInt(answer['00000071'].textAnswers.answers[0].value, 10);
      const vib = parseInt(answer['00000072'].textAnswers.answers[0].value, 10);
      const vic = parseInt(answer['00000073'].textAnswers.answers[0].value, 10);
      const vid = parseInt(answer['00000074'].textAnswers.answers[0].value, 10);
      const vie = parseInt(answer['00000075'].textAnswers.answers[0].value, 10);
      const viF = parseInt(answer['00000076'].textAnswers.answers[0].value, 10);
      const vig = parseInt(answer['00000077'].textAnswers.answers[0].value, 10);
      const vih = parseInt(answer['00000078'].textAnswers.answers[0].value, 10);
      
      const viia = parseInt(answer['00000081'].textAnswers.answers[0].value, 10);
      const viib = parseInt(answer['00000082'].textAnswers.answers[0].value, 10);
      const viic = parseInt(answer['00000083'].textAnswers.answers[0].value, 10);
      const viid = parseInt(answer['00000084'].textAnswers.answers[0].value, 10);
      const viie = parseInt(answer['00000085'].textAnswers.answers[0].value, 10);
      const viiF = parseInt(answer['00000086'].textAnswers.answers[0].value, 10);
      const viig = parseInt(answer['00000087'].textAnswers.answers[0].value, 10);
      const viih = parseInt(answer['00000088'].textAnswers.answers[0].value, 10);
      

      let IM = ig + iia + iiih + ivd + vb + viF + viie;
      let CO = id + iib + iiia + ivh + vF + vic + viig;
      let SH = iF + iie + iiic + ivb + vd + vig + viia;
      let PL = ic + iig + iiid + ive + vh + via + viF;
      let RI = ia + iic + iiiF + ivg + ve + vih + viid;
      let ME = ih + iid + iiig + ivc + va + vie + viib;
      let TW = ib + iiF + iiie + iva + vc + vib + viih;
      let CF = ie + iih + iiib + ivF + vg + vid + viic;

      let attributes = [["IM", IM], ["CO", CO], ["SH", SH], ["PL", PL], ["RI", RI], ["ME", ME], ["TW", TW], ["CF", CF]];
      console.log(attributes)

      let max_value = 0;
      let max_attribute = null;
      
      for (let j = 0; j < attributes.length; j++) {
        if (attributes[j][1] > max_value) {
          max_attribute = attributes[j][0];
        }
      }

      let belbin_type = null;

      if (max_attribute == "PL" || max_attribute == "ME") {
        belbin_type = "Thinking";
      }
      else if (max_attribute == "SH" || max_attribute == "IM" || max_attribute == "CF") {
        belbin_type = "Action";
      }
      else if (max_attribute == "CO" || max_attribute == "TW" || max_attribute == "RI") {
        belbin_type = "People";
      }

      responseList.push([studentId, belbin_type]);
  }
  
  // console.log(responseList);
  return responseList;
}

async function getEffortResponse(auth, formId) {
  const effortResponses = await getFormResponseList(auth, formId);
  let responseList = [];
  
  for (let i = 0; i < effortResponses.data.responses.length; i++) {
      const answer = effortResponses.data.responses[i].answers;
      const studentId = answer['00000001'].textAnswers.answers[0].value;
      const effortHours = answer['00000002'].textAnswers.answers[0].value;
      
      responseList.push([studentId, effortHours, 70]);
  }
  
  // console.log(responseList);
  return responseList;
}

async function getPreferenceResponse(auth, formId) {
  const projectPreferencesResponses = await getFormResponseList(auth, formId);
  let responseList = [];
  let response = [studentId];
  
  for (let i = 0; i < projectPreferencesResponses.data.responses.length; i++) {
      const answer = projectPreferencesResponses.data.responses[i].answers;
      const studentId = answer['00000001'].textAnswers.answers[0].value;
      
      let answerNo = 1;
      // Get next preference answer ID, add it if it exists
      while(true) {
          let idBase = '00000000'; // answers have the form '...0002n', left-padded with 0s to 8 chars
          let id = answerNo.toString();
          id = '2'+id;
          id = idBase.substring(0, 8 - id.length) + id;
          if (answer.hasOwnProperty(id)) {
            response.push(answer[id].textAnswers.answers[0].value);
          }
          else {
            break;
          }
      }

      responseList.push([studentId, pref1, pref2, pref3, pref4, pref5, pref6, pref7, pref8, pref9, pref10]);
  }
  
  // console.log(responseList);
  return responseList;
}

module.exports = {
    getBelbinResponse,
    getEffortResponse,
    getPreferenceResponse,
    generateForms
}