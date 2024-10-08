const { google } = require('googleapis');
const { GoogleAuth } = require('google-auth-library');
const { response } = require('express');
const { v4: uuidv4 } = require('uuid')
require('dotenv').config();``

const SERVICE_ACCOUNT_JSON = JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT_TOKEN )
const SCOPES = ['https://www.googleapis.com/auth/forms', 'https://www.googleapis.com/auth/drive'];
const auth = new GoogleAuth({
    credentials: SERVICE_ACCOUNT_JSON,
    scopes: SCOPES,
});

const belbinFormId = null
const belbinRevisionId = null
const projectFormId = null
const projectRevisionId = null
const effortFormId = null
const effortRevisionId = null

async function createForm(auth,formBody){
    const authClient = await auth.getClient();
    const forms = google.forms({ version: 'v1', auth: authClient });
    const result = await forms.forms.create({ requestBody: formBody });
    return result;
}

function effortForm(uniqueFormId, uniqueRevisionId) {
    return {
        "formId": uniqueFormId,
        "info": {
          "title": "Effort Allocation Survey",
          "description": "Please provide information about your effort allocation for this unit.",
          "documentTitle": "Effort Survey"
        },
        "settings": {
          "quizSettings": {
            "isQuiz": false
          }
        },
        "revisionId": uniqueRevisionId,
        "responderUri": `https://docs.google.com/forms/d/e/${uniqueFormId}/viewform`,
        "items": [
          {
            "itemId": "effort_1",
            "title": "What is your name?",
            "questionItem": {
              "question": {
                "questionId": "effort_q1",
                "required": true,
                "textQuestion": {
                  "paragraph": false
                }
              }
            }
          },
          {
            "itemId": "effort_2",
            "title": "What is your student ID?",
            "questionItem": {
              "question": {
                "questionId": "effort_q2",
                "required": true,
                "textQuestion": {
                  "paragraph": false
                }
              }
            }
          },
          {
            "itemId": "effort_3",
            "title": "How many hours are you willing to allocate to this unit per week?",
            "questionItem": {
              "question": {
                "questionId": "effort_q3",
                "required": true,
                "textQuestion": {
                  "paragraph": false
                }
              }
            }
          },
          {
            "itemId": "effort_4",
            "title": "Do you consent to this data being stored for the duration of this unit?",
            "questionItem": {
              "question": {
                "questionId": "effort_q4",
                "required": true,
                "choiceQuestion": {
                  "type": "RADIO",
                  "options": [
                    { "value": "Yes" }
                  ]
                }
              }
            }
        }
    ]
    };
}

function projectPreferencesForm(uniqueFormId, uniqueRevisionId) {
    return {
        "formId": uniqueFormId,
        "info": {
          "title": "Project Preferences Survey",
          "description": "Please rank your project preferences for the upcoming term.",
          "documentTitle": "Project Preferences"
        },
        "settings": {
          "quizSettings": {
            "isQuiz": false
          }
        },
        "revisionId": uniqueRevisionId,
        "responderUri": `https://docs.google.com/forms/d/e/${uniqueFormId}/viewform`,
        "items": [
          {
            "itemId": "project_pref_1",
            "title": "What is your name?",
            "questionItem": {
              "question": {
                "questionId": "project_pref_q1",
                "required": true,
                "textQuestion": {
                  "paragraph": false
                }
              }
            }
          },
          {
            "itemId": "project_pref_2",
            "title": "What is your student ID?",
            "questionItem": {
              "question": {
                "questionId": "project_pref_q2",
                "required": true,
                "textQuestion": {
                  "paragraph": false
                }
              }
            }
          },
          {
            "itemId": "project_pref_3",
            "title": "Rank projects in order of preference",
            "questionItem": {
              "question": {
                "questionId": "project_pref_q3",
                "required": true,
                "gridQuestion": {
                  "rows": [
                    { "value": "1" }, { "value": "2" }, { "value": "3" }, { "value": "4" },
                    { "value": "5" }, { "value": "6" }, { "value": "7" }, { "value": "8" },
                    { "value": "9" }, { "value": "10" }
                  ],
                  "columns": [
                    { "value": "1" }, { "value": "2" }, { "value": "3" }, { "value": "4" },
                    { "value": "5" }, { "value": "6" }, { "value": "7" }, { "value": "8" },
                    { "value": "9" }, { "value": "10" }
                  ]
                }
              }
            }
          },
          {
            "itemId": "project_pref_4",
            "title": "Do you consent to this data being stored for the duration of this unit?",
            "questionItem": {
              "question": {
                "questionId": "project_pref_q4",
                "required": true,
                "choiceQuestion": {
                  "type": "RADIO",
                  "options": [
                    { "value": "Yes" }
                  ]
                }
              }
            }
          }
        ]
    };
}

function belbinForm(uniqueFormId, uniqueRevisionId) {
    return {
        "formId": uniqueFormId,
        "info": {
            "title": "Belbin Team Roles Survey",
            "description": "This survey helps assess your team role preferences based on Belbin's model.",
            "documentTitle": "Belbin Survey"
        },
        "settings": {
            "quizSettings": {
                "isQuiz": false
            }
        },
        "revisionId": uniqueRevisionId,
        "responderUri": `https://docs.google.com/forms/d/e/${uniqueFormId}/viewform`,
        "items": [
            {
                "itemId": "belbin_1",
                "title": "What is your name?",
                "questionItem": {
                    "question": {
                        "questionId": "belbin_q1",
                        "required": true,
                        "textQuestion": {
                            "paragraph": false
                        }
                    }
                }
            },
            {
                "itemId": "belbin_2",
                "title": "What is your student ID?",
                "questionItem": {
                    "question": {
                        "questionId": "belbin_q2",
                        "required": true,
                        "textQuestion": {
                            "paragraph": false
                        }
                    }
                }
            },
            {
                "itemId": "belbin_3",
                "title": "What I believe I can contribute to a team:",
                "questionItem": {
                    "question": {
                        "questionId": "belbin_q3",
                        "required": true,
                        "gridQuestion": {
                            "rows": [
                                { "value": "a. I think I can quickly see and take advantage of new opportunities" },
                                { "value": "b. I can work well with a very wide range of people" },
                                { "value": "c. Producing ideas is one of my natural assets" },
                                { "value": "d. My ability rests in being able to draw people out whenever I detect they have something of value to contribute to group objectives" },
                                { "value": "e. My capacity to follow through has much to do with my personal effectiveness" },
                                { "value": "f. I am ready to face temporary unpopularity if it leads to worthwhile results in the end" },
                                { "value": "g. I can usually sense what is realistic and likely to work" },
                                { "value": "h. I can offer a reasoned case for alternative courses of action without introducing bias or prejudice" }
                            ],
                            "columns": [
                                { "value": "1" }, { "value": "2" }, { "value": "3" }, { "value": "4" },
                                { "value": "5" }, { "value": "6" }, { "value": "7" }, { "value": "8" }
                            ]
                        }
                    }
                }
            },
            {
                "itemId": "belbin_4",
                "title": "If I have a possible shortcoming in teamwork, it could be that:",
                "questionItem": {
                    "question": {
                        "questionId": "belbin_q4",
                        "required": true,
                        "gridQuestion": {
                            "rows": [
                                { "value": "a. I am not at ease unless meetings are well structured and controlled and generally well conducted" },
                                { "value": "b. I am inclined to be too generous towards others who have a valid viewpoint that has not been given a proper airing" },
                                { "value": "c. I have a tendency to talk too much once the group gets on to new ideas" },
                                { "value": "d. My objectives outlook makes it difficult for me to join in readily and enthusiastically with colleagues" },
                                { "value": "e. I am sometimes seen as forceful and authoritarian if there is a need to get something done." },
                                { "value": "f. I find it difficult to lead from the front, perhaps because I am over-responsive to the group atmosphere" },
                                { "value": "g. I am apt to get too caught up in ideas that occur to me and so lose track of what is happening" },
                                { "value": "h. My colleagues tend to see me as worrying unnecessarily over detail and the possibility that things may go wrong" }
                            ],
                            "columns": [
                                { "value": "1" }, { "value": "2" }, { "value": "3" }, { "value": "4" },
                                { "value": "5" }, { "value": "6" }, { "value": "7" }, { "value": "8" }
                            ]
                        }
                    }
                }
            },
            {
                "itemId": "belbin_5",
                "title": "When involved in a project with other people:",
                "questionItem": {
                    "question": {
                        "questionId": "belbin_q5",
                        "required": true,
                        "gridQuestion": {
                            "rows": [
                                { "value": "a. I have an aptitude for influencing people without pressuring them" },
                                { "value": "b. My general vigilance prevents careless mistakes and omissions being made" },
                                { "value": "c. I am ready to press for action to make sure that the meeting does not waste time or lose sight of the main objective" },
                                { "value": "d. I can be counted on to contribute something original" },
                                { "value": "e. I am always ready to back a good suggestion in the common interest" },
                                { "value": "f. I am keen to look for the latest in new ideas and developments" },
                                { "value": "g. I believe my capacity for judgment can help to bring about the right decisions" },
                                { "value": "h. I can be called upon to see that all essential work is organised" }
                            ],
                            "columns": [
                                { "value": "1" }, { "value": "2" }, { "value": "3" }, { "value": "4" },
                                { "value": "5" }, { "value": "6" }, { "value": "7" }, { "value": "8" }
                            ]
                        }
                    }
                }
            },
            {
                "itemId": "belbin_6",
                "title": "My characteristic approach to group work is that:",
                "questionItem": {
                    "question": {
                        "questionId": "belbin_q6",
                        "required": true,
                        "gridQuestion": {
                            "rows": [
                                { "value": "a. I have a quiet interest in getting to know colleagues better" },
                                { "value": "b. I am not reluctant to challenge the views of others or to hold a minority view myself" },
                                { "value": "c. I can usually find a line of argument to refute unsound propositions" },
                                { "value": "d. I think I have a talent for making things work once a plan has to be put into operation" },
                                { "value": "e. I have a tendency to avoid the obvious and to come out with the unexpected" },
                                { "value": "f. I bring a touch of perfectionism to any job I undertake" },
                                { "value": "g. I am ready to make use of contacts outside the group itself" },
                                { "value": "h. While I am interested in all views I have no hesitation in making up my mind once a decision has to be made" }
                            ],
                            "columns": [
                                { "value": "1" }, { "value": "2" }, { "value": "3" }, { "value": "4" },
                                { "value": "5" }, { "value": "6" }, { "value": "7" }, { "value": "8" }
                            ]
                        }
                    }
                }
            },
            {
                "itemId": "belbin_7",
                "title": "I gain satisfaction in a job because:",
                "questionItem": {
                    "question": {
                        "questionId": "belbin_q7",
                        "required": true,
                        "gridQuestion": {
                            "rows": [
                                { "value": "a. I enjoy analysing situations and weighing up all the possible choices" },
                                { "value": "b. I am interested in finding practical solutions to problems" },
                                { "value": "c. I like to feel I am fostering good working relationships" },
                                { "value": "d. I can have a strong influence on decisions" },
                                { "value": "e. I can meet people who may have something new to offer" },
                                { "value": "f. I can get people to agree on a necessary course of action" },
                                { "value": "g. I feel in my element where I can give a task my full attention" },
                                { "value": "h. I like to find a field that stretches my imagination" }
                            ],
                            "columns": [
                                { "value": "1" }, { "value": "2" }, { "value": "3" }, { "value": "4" },
                                { "value": "5" }, { "value": "6" }, { "value": "7" }, { "value": "8" }
                            ]
                        }
                    }
                }
            },
            {
                "itemId": "belbin_8",
                "title": "If I’m suddenly given a difficult task with limited time and unfamiliar people:",
                "questionItem": {
                    "question": {
                        "questionId": "belbin_q8",
                        "required": true,
                        "gridQuestion": {
                            "rows": [
                                { "value": "a. I would feel like retiring to a corner to devise a way out of the impasse before developing a line" },
                                { "value": "b. I would be ready to work with the person who showed the most positive approach." },
                                { "value": "c. I would find some way of reducing the size of the task by establishing what different individuals might best contribute" },
                                { "value": "d. My natural sense of urgency would help to ensure that we did not fall behind schedule" },
                                { "value": "e. I believe I would keep cool and maintain my capacity to think straight" },
                                { "value": "f. I would retain a steadiness of purpose in spite of the pressures" },
                                { "value": "g. I would be prepared to take a positive lead if I felt the group was making no progress" },
                                { "value": "h. I would open up discussions with a view to stimulating new thoughts and getting something moving" }
                            ],
                            "columns": [
                                { "value": "1" }, { "value": "2" }, { "value": "3" }, { "value": "4" },
                                { "value": "5" }, { "value": "6" }, { "value": "7" }, { "value": "8" }
                            ]
                        }
                    }
                }
            },
            {
                "itemId": "belbin_9",
                "title": "With reference to the problems to which I am subject in working in groups:",
                "questionItem": {
                    "question": {
                        "questionId": "belbin_q9",
                        "required": true,
                        "gridQuestion": {
                            "rows": [
                                { "value": "a. I am apt to show my impatience with those who are obstructing progress" },
                                { "value": "b. Others may criticise me for being too analytical & insufficiently intuitive" },
                                { "value": "c. My desire to ensure that work is properly done can hold up proceedings" },
                                { "value": "d. I tend to get bored rather easily and rely on one or two stimulating members to spark me off" },
                                { "value": "e. I find it difficult to get started unless the goals are clear" },
                                { "value": "f. I am sometimes poor at explaining and clarifying complex points that occur to me" },
                                { "value": "g. I am conscious of demanding from others the things I cannot do myself" },
                                { "value": "h. I hesitate to get my points across when I run up against real opposition" }
                            ],
                            "columns": [
                                { "value": "1" }, { "value": "2" }, { "value": "3" }, { "value": "4" },
                                { "value": "5" }, { "value": "6" }, { "value": "7" }, { "value": "8" }
                            ]
                        }
                    }
                }
            }
        ]
    };
}

async function generateForms(effort, project, belbin) {

    var forms = []

    if (effort) {
        effortFormId = uuidv4();
        effortRevisionId = uuidv4();
        var effortFormBody = effortForm(effortFormId, effortRevisionId)
        var effForm = createForm(auth, effortFormBody)
        forms.push(effForm)
    }

    if (project) {
        projectFormId = uuidv4();
        projectRevisionId = uuidv4();
        var projectFormBody = projectPreferencesForm(projectFormId, projectRevisionId)
        var projForm = createForm(auth, projectFormBody)
        forms.push(projForm)
    }

    if (belbin) {
        belbinFormId = uuidv4();
        belbinRevisionId = uuidv4();
        var belbinFormBody = belbinForm(belbinFormId, belbinRevisionId)
        var belbForm = createForm(auth, belbinFormBody)
        forms.push(belbForm)
    }

    return forms

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

