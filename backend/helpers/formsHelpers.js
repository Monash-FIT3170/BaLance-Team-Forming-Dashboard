const { google } = require('googleapis');
const { GoogleAuth } = require('google-auth-library');
const { response } = require('express');
const { v4: uuidv4 } = require('uuid');
const { MAX_ACCESS_BOUNDARY_RULES_COUNT } = require('google-auth-library/build/src/auth/downscopedclient');
require('dotenv').config();``

const SERVICE_ACCOUNT_JSON = JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT_TOKEN )
const SCOPES = ['https://www.googleapis.com/auth/forms', 'https://www.googleapis.com/auth/drive'];
const auth = new GoogleAuth({
    credentials: SERVICE_ACCOUNT_JSON,
    scopes: SCOPES,
});
const belbinRequest = [
  {
    "createItem": {
      "item": {
        "itemId": "0",
        "title": "What is your name?",
        "questionItem": {
          "question": {
            "questionId": "0",
            "required": true,
            "textQuestion": {
              "paragraph": false
            }
          }
        }
      },
      "location": {
        "index": 0
      }
    }
  },
  {
    "createItem": {
      "item": {
        "itemId": "1",
        "title": "What is your student ID?",
        "questionItem": {
          "question": {
            "questionId": "1",
            "required": true,
            "textQuestion": {
              "paragraph": false
            }
          }
        }
      },
      "location": {
        "index": 1
      }
    }
  },
  {
    "createItem": {
      "item": {
        "itemId": "2",
        "title": "What I believe I can contribute to a team:",
        "questionGroupItem": {
          "questions": [
            {
              "questionId": "21",
              "required": true,
              "rowQuestion": {
                "title": "a. I think I can quickly see and take advantage of new opportunities"
              }
            },
            {
              "questionId": "22",
              "required": true,
              "rowQuestion": {
                "title": "b. I can work well with a very wide range of people"
              }
            },
            {
              "questionId": "23",
              "required": true,
              "rowQuestion": {
                "title": "c. Producing ideas is one of my natural assets"
              }
            },
            {
              "questionId": "24",
              "required": true,
              "rowQuestion": {
                "title": "d. My ability rests in being able to draw people out whenever I detect they have something of value to contribute to group objectives"
              }
            },
            {
              "questionId": "25",
              "required": true,
              "rowQuestion": {
                "title": "e. My capacity to follow through has much to do with my personal effectiveness"
              }
            },
            {
              "questionId": "26",
              "required": true,
              "rowQuestion": {
                "title": "f. I am ready to face temporary unpopularity if it leads to worthwhile results in the end"
              }
            },
            {
              "questionId": "27",
              "required": true,
              "rowQuestion": {
                "title": "g. I can usually sense what is realistic and likely to work"
              }
            },
            {
              "questionId": "28",
              "required": true,
              "rowQuestion": {
                "title": "h. I can offer a reasoned case for alternative courses of action without introducing bias or prejudice"
              }
            }
          ],
          "grid": {
            "columns": {
              "type": "RADIO",
              "options": [
                { "value": "1" },
                { "value": "2" },
                { "value": "3" },
                { "value": "4" },
                { "value": "5" },
                { "value": "6" },
                { "value": "7" },
                { "value": "8" }
              ]
            }
          }
        }
      },
      "location": {
        "index": 2
      }
    }
  },
  {
    "createItem": {
      "item": {
        "itemId": "3",
        "title": "If I have a possible shortcoming in teamwork, it could be that:",
        "questionGroupItem": {
          "questions": [
            {
              "questionId": "31",
              "required": true,
              "rowQuestion": {
                "title": "a. I am not at ease unless meetings are well structured and controlled and generally well conducted"
              }
            },
            {
              "questionId": "32",
              "required": true,
              "rowQuestion": {
                "title": "b. I am inclined to be too generous towards others who have a valid viewpoint that has not been given a proper airing"
              }
            },
            {
              "questionId": "33",
              "required": true,
              "rowQuestion": {
                "title": "c. I have a tendency to talk too much once the group gets on to new ideas"
              }
            },
            {
              "questionId": "34",
              "required": true,
              "rowQuestion": {
                "title": "d. My objective outlook makes it difficult for me to join in readily and enthusiastically with colleagues"
              }
            },
            {
              "questionId": "35",
              "required": true,
              "rowQuestion": {
                "title": "e. I am sometimes seen as forceful and authoritarian if there is a need to get something done."
              }
            },
            {
              "questionId": "36",
              "required": true,
              "rowQuestion": {
                "title": "f. I find it difficult to lead from the front, perhaps because I am over-responsive to the group atmosphere"
              }
            },
            {
              "questionId": "37",
              "required": true,
              "rowQuestion": {
                "title": "g. I am apt to get too caught up in ideas that occur to me and so lose track of what is happening"
              }
            },
            {
              "questionId": "38",
              "required": true,
              "rowQuestion": {
                "title": "h. My colleagues tend to see me as worrying unnecessarily over detail and the possibility that things may go wrong"
              }
            }
          ],
          "grid": {
            "columns": {
              "type": "RADIO",
              "options": [
                { "value": "1" },
                { "value": "2" },
                { "value": "3" },
                { "value": "4" },
                { "value": "5" },
                { "value": "6" },
                { "value": "7" },
                { "value": "8" }
              ]
            }
          }
        }
      },
      "location": {
        "index": 3
      }
    }
  },
  {
    "createItem": {
      "item": {
        "itemId": "4",
        "title": "When involved in a project with other people:",
        "questionGroupItem": {
          "questions": [
            {
              "questionId": "40",
              "required": true,
              "rowQuestion": {
                "title": "a. I have an aptitude for influencing people without pressuring them"
              }
            },
            {
              "questionId": "41",
              "required": true,
              "rowQuestion": {
                "title": "b. My general vigilance prevents careless mistakes and omissions being made"
              }
            },
            {
              "questionId": "42",
              "required": true,
              "rowQuestion": {
                "title": "c. I am ready to press for action to make sure that the meeting does not waste time or lose sight of the main objective"
              }
            },
            {
              "questionId": "43",
              "required": true,
              "rowQuestion": {
                "title": "d. I can be counted on to contribute something original"
              }
            },
            {
              "questionId": "44",
              "required": true,
              "rowQuestion": {
                "title": "e. I am always ready to back a good suggestion in the common interest"
              }
            },
            {
              "questionId": "45",
              "required": true,
              "rowQuestion": {
                "title": "f. I am keen to look for the latest in new ideas and developments"
              }
            },
            {
              "questionId": "46",
              "required": true,
              "rowQuestion": {
                "title": "g. I believe my capacity for judgment can help to bring about the right decisions"
              }
            },
            {
              "questionId": "47",
              "required": true,
              "rowQuestion": {
                "title": "h. I can be called upon to see that all essential work is organised"
              }
            }
          ],
          "grid": {
            "columns": {
              "type": "RADIO",
              "options": [
                { "value": "1" },
                { "value": "2" },
                { "value": "3" },
                { "value": "4" },
                { "value": "5" },
                { "value": "6" },
                { "value": "7" },
                { "value": "8" }
              ]
            }
          }
        }
      },
      "location": {
        "index": 4
      }
    }
  },
  {
    "createItem": {
      "item": {
        "itemId": "5",
        "title": "My characteristic approach to group work is that:",
        "questionGroupItem": {
          "questions": [
            {
              "questionId": "51",
              "required": true,
              "rowQuestion": {
                "title": "a. I have a quiet interest in getting to know colleagues better"
              }
            },
            {
              "questionId": "52",
              "required": true,
              "rowQuestion": {
                "title": "b. I am not reluctant to challenge the views of others or to hold firm to principles"
              }
            },
            {
              "questionId": "53",
              "required": true,
              "rowQuestion": {
                "title": "c. I am prepared to be radical when it brings change that moves things forward"
              }
            },
            {
              "questionId": "54",
              "required": true,
              "rowQuestion": {
                "title": "d. I have a talent for seeing both sides of an argument"
              }
            },
            {
              "questionId": "55",
              "required": true,
              "rowQuestion": {
                "title": "e. I am willing to put myself in other people's shoes to understand how they feel"
              }
            },
            {
              "questionId": "56",
              "required": true,
              "rowQuestion": {
                "title": "f. I contribute ideas that can stir up further innovation"
              }
            },
            {
              "questionId": "57",
              "required": true,
              "rowQuestion": {
                "title": "g. I work best when I know that a clear sense of direction is established"
              }
            },
            {
              "questionId": "58",
              "required": true,
              "rowQuestion": {
                "title": "h. I like to follow things through until I see tangible results"
              }
            }
          ],
          "grid": {
            "columns": {
              "type": "RADIO",
              "options": [
                { "value": "1" },
                { "value": "2" },
                { "value": "3" },
                { "value": "4" },
                { "value": "5" },
                { "value": "6" },
                { "value": "7" },
                { "value": "8" }
              ]
            }
          }
        }
      },
      "location": {
        "index": 5
      }
    }
  },
  {
    "createItem": {
      "item": {
        "itemId": "6",
        "title": "When it comes to teamwork, I am:",
        "questionGroupItem": {
          "questions": [
            {
              "questionId": "61",
              "required": true,
              "rowQuestion": {
                "title": "a. Always alert to opportunities to improve team effectiveness"
              }
            },
            {
              "questionId": "62",
              "required": true,
              "rowQuestion": {
                "title": "b. Good at making connections between different perspectives"
              }
            },
            {
              "questionId": "63",
              "required": true,
              "rowQuestion": {
                "title": "c. Often the one who drives the team to meet its goals"
              }
            },
            {
              "questionId": "64",
              "required": true,
              "rowQuestion": {
                "title": "d. Keen to explore new ideas and strategies"
              }
            },
            {
              "questionId": "65",
              "required": true,
              "rowQuestion": {
                "title": "e. Adept at mediating between conflicting points of view"
              }
            },
            {
              "questionId": "66",
              "required": true,
              "rowQuestion": {
                "title": "f. Often willing to take charge and set clear goals"
              }
            },
            {
              "questionId": "67",
              "required": true,
              "rowQuestion": {
                "title": "g. Always paying attention to the fine details that others might overlook"
              }
            },
            {
              "questionId": "68",
              "required": true,
              "rowQuestion": {
                "title": "h. Happy to work in the background, quietly supporting the team"
              }
            }
          ],
          "grid": {
            "columns": {
              "type": "RADIO",
              "options": [
                { "value": "1" },
                { "value": "2" },
                { "value": "3" },
                { "value": "4" },
                { "value": "5" },
                { "value": "6" },
                { "value": "7" },
                { "value": "8" }
              ]
            }
          }
        }
      },
      "location": {
        "index": 6
      }
    }
  },
  {
    "createItem": {
      "item": {
        "itemId": "7",
        "title": "I tend to:",
        "questionGroupItem": {
          "questions": [
            {
              "questionId": "71",
              "required": true,
              "rowQuestion": {
                "title": "a. Trust my instincts when making decisions"
              }
            },
            {
              "questionId": "72",
              "required": true,
              "rowQuestion": {
                "title": "b. Seek to build consensus in discussions"
              }
            },
            {
              "questionId": "73",
              "required": true,
              "rowQuestion": {
                "title": "c. Focus on ensuring that deadlines are met"
              }
            },
            {
              "questionId": "74",
              "required": true,
              "rowQuestion": {
                "title": "d. Enjoy brainstorming sessions to generate new ideas"
              }
            },
            {
              "questionId": "75",
              "required": true,
              "rowQuestion": {
                "title": "e. Stay calm in high-pressure situations"
              }
            },
            {
              "questionId": "76",
              "required": true,
              "rowQuestion": {
                "title": "f. Like to take on responsibility for decision-making"
              }
            },
            {
              "questionId": "77",
              "required": true,
              "rowQuestion": {
                "title": "g. Prefer to work methodically and ensure accuracy"
              }
            },
            {
              "questionId": "78",
              "required": true,
              "rowQuestion": {
                "title": "h. Like to ensure that everyone is included in discussions"
              }
            }
          ],
          "grid": {
            "columns": {
              "type": "RADIO",
              "options": [
                { "value": "1" },
                { "value": "2" },
                { "value": "3" },
                { "value": "4" },
                { "value": "5" },
                { "value": "6" },
                { "value": "7" },
                { "value": "8" }
              ]
            }
          }
        }
      },
      "location": {
        "index": 7
      }
    }
  },
  {
    "createItem": {
      "item": {
        "itemId": "8",
        "title": "In a group setting, my role is often:",
        "questionGroupItem": {
          "questions": [
            {
              "questionId": "81",
              "required": true,
              "rowQuestion": {
                "title": "a. The person who makes sure that the work gets done"
              }
            },
            {
              "questionId": "82",
              "required": true,
              "rowQuestion": {
                "title": "b. The one who encourages everyone to contribute their ideas"
              }
            },
            {
              "questionId": "83",
              "required": true,
              "rowQuestion": {
                "title": "c. The one who challenges the team to think differently"
              }
            },
            {
              "questionId": "84",
              "required": true,
              "rowQuestion": {
                "title": "d. The person who helps resolve conflicts and ensures harmony"
              }
            },
            {
              "questionId": "85",
              "required": true,
              "rowQuestion": {
                "title": "e. The one who coordinates tasks and ensures the team is focused"
              }
            },
            {
              "questionId": "86",
              "required": true,
              "rowQuestion": {
                "title": "f. The one who brings fresh perspectives to the team"
              }
            },
            {
              "questionId": "87",
              "required": true,
              "rowQuestion": {
                "title": "g. The one who makes sure all the details are handled"
              }
            },
            {
              "questionId": "88",
              "required": true,
              "rowQuestion": {
                "title": "h. The person who takes the lead and ensures progress"
              }
            }
          ],
          "grid": {
            "columns": {
              "type": "RADIO",
              "options": [
                { "value": "1" },
                { "value": "2" },
                { "value": "3" },
                { "value": "4" },
                { "value": "5" },
                { "value": "6" },
                { "value": "7" },
                { "value": "8" }
              ]
            }
          }
        }
      },
      "location": {
        "index": 8
      }
    }
  },
  {
    "createItem": {
      "item": {
        "itemId": "9",
        "title": "Do you consent to this data being stored for the duration of this unit?",
        "questionItem": {
          "question": {
            "questionId": "9",  
            "required": true,
            "choiceQuestion": {
              "type": "RADIO",
              "options": [
                { "value": "Yes" }
              ]
            }
          }
        }
      },
      "location": {
        "index": 9
      }
    }
  }
]

const projectRequest = [
  {
    "createItem": {
      "item": {
        "itemId": "0",
        "title": "What is your name?",
        "questionItem": {
          "question": {
            "questionId": "0",
            "required": true,
            "textQuestion": {
              "paragraph": false
            }
          }
        }
      },
      "location": {
        "index": 0
      }
    }
  },
  {
    "createItem": {
      "item": {
        "itemId": "1",
        "title": "What is your student ID?",
        "questionItem": {
          "question": {
            "questionId": "1",
            "required": true,
            "textQuestion": {
              "paragraph": false
            }
          }
        }
      },
      "location": {
        "index": 1
      }
    }
  },
  {
    "createItem": {
      "item": {
        "itemId": "2",
        "title": "Rank projects in order of preference",
        "questionGroupItem": {
          "questions": [
            {
              "questionId" : "21",
              "required" : true,
              "rowQuestion": {
                "title": "1"
              }
            },
            {
              "questionId" : "22",
              "required" : true,
              "rowQuestion": {
                "title": "2"
              }
            },
            {
              "questionId" : "23",
              "required" : true,
              "rowQuestion": {
                "title": "3"
              }
            },
            {
              "questionId" : "24",
              "required" : true,
              "rowQuestion": {
                "title": "4"
              }
            },
            {
              "questionId" : "25",
              "required" : true,
              "rowQuestion": {
                "title": "5"
              }
            },
            {
              "questionId" : "26",
              "required" : true,
              "rowQuestion": {
                "title": "6"
              }
            },
            {
              "questionId" : "27",
              "required" : true,
              "rowQuestion": {
                "title": "7"
              }
            },
            {
              "questionId" : "28",
              "required" : true,
              "rowQuestion": {
                "title": "8"
              }
            },
            {
              "questionId" : "29",
              "required" : true,
              "rowQuestion": {
                "title": "9"
              }
            },
            {
              "questionId" : "210",
              "required" : true,
              "rowQuestion": {
                "title": "10"
              }
            }
          ],
          "grid": {
            "columns": {
              "type": "RADIO",
              "options": [
                { "value": "1" },
                { "value": "2" },
                { "value": "3" },
                { "value": "4" },
                { "value": "5" },
                { "value": "6" },
                { "value": "7" },
                { "value": "8" },
                { "value": "9" },
                { "value": "10" }
              ]
            },
          }
        }
      },
      "location": {
        "index": 2
      }
    }
  },
  {
    "createItem": {
      "item": {
        "itemId": "3",
        "title": "Do you consent to this data being stored for the duration of this unit?",
        "questionItem": {
          "question": {
            "questionId": "3",
            "required": true,
            "choiceQuestion": {
              "type": "RADIO",
              "options": [
                {
                  "value": "Yes"
                }
              ]
            }
          }
        }
      },
      "location": {
        "index": 3
      }
    }
  }
]

const effortRequest = [
  {
    "createItem": {
      "item": {
        "itemId": "0",
        "title": "What is your name?",
        "questionItem": {
          "question": {
            "questionId": "0",
            "required": true,
            "textQuestion": {
              "paragraph": false
            }
          }
        }
      },
      "location": {
        "index": 0
      }
    }
  },
  {
    "createItem": {
      "item": {
        "itemId": "1",
        "title": "What is your student ID?",
        "questionItem": {
          "question": {
            "questionId": "1",
            "required": true,
            "textQuestion": {
              "paragraph": false
            }
          }
        }
      },
      "location": {
        "index": 1
      }
    }
  },
  {
    "createItem": {
      "item": {
        "itemId": "2",
        "title": "How many hours are you willing to allocate to this unit per week?",
        "questionItem": {
          "question": {
            "questionId": "2",
            "required": true,
            "textQuestion": {
              "paragraph": false
            }
          }
        }
      },
      "location": {
        "index": 2
      }
    }
  },
  {
    "createItem": {
      "item": {
        "itemId": "3",
        "title": "Do you consent to this data being stored for the duration of this unit?",
        "questionItem": {
          "question": {
            "questionId": "3",  
            "required": true,
            "choiceQuestion": {
              "type": "RADIO",
              "options": [
                { "value": "Yes" }
              ]
            }
          }
        }
      },
      "location": {
        "index": 3
      }
    }
  }
]


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

async function generateForms(effort, project, belbin) {


    if (effort) {
        var effortFormBody = effortForm()
        var effForm = await createForm(auth, effortFormBody)
        effortFormId = effForm.data.formId;
        effortResponderURL = effForm.data.responderUri;
        await updateForm(auth, effortFormId, effortRequest)
    }

    if (project) {
        var projectFormBody = projectPreferencesForm()
        var projForm = await createForm(auth, projectFormBody)
        projectFormId = projForm.data.formId
        projectResponderURL = projForm.data.responderUri
        await updateForm(auth, projectFormId, projectRequest)
    }

    if (belbin) {
        var belbinFormBody = belbinForm()
        var belbForm = await createForm(auth, belbinFormBody)
        belbinFormId = belbForm.data.formId
        belbinResponderURL = belbForm.data.responderUri
        await updateForm(auth, belbinFormId, belbinRequest)
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
  
  console.log(responseList);
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
  
  console.log(responseList);
  return responseList;
}

async function getPreferenceResponse(auth, formId) {
  const projectPreferencesResponses = await getFormResponseList(auth, formId);
  let responseList = [];
  
  for (let i = 0; i < projectPreferencesResponses.data.responses.length; i++) {
      const answer = projectPreferencesResponses.data.responses[i].answers;
      const studentId = answer['00000001'].textAnswers.answers[0].value;
      const pref1 = answer['00000021'].textAnswers.answers[0].value;
      const pref2 = answer['00000022'].textAnswers.answers[0].value;
      const pref3 = answer['00000023'].textAnswers.answers[0].value;
      const pref4 = answer['00000024'].textAnswers.answers[0].value;
      const pref5 = answer['00000025'].textAnswers.answers[0].value;
      const pref6 = answer['00000026'].textAnswers.answers[0].value;
      const pref7 = answer['00000027'].textAnswers.answers[0].value;
      const pref8 = answer['00000028'].textAnswers.answers[0].value;
      const pref9 = answer['00000029'].textAnswers.answers[0].value;
      const pref10 = answer['00000210'].textAnswers.answers[0].value;

      responseList.push([studentId, pref1, pref2, pref3, pref4, pref5, pref6, pref7, pref8, pref9, pref10]);
  }
  
  console.log(responseList);
  return responseList;
}

module.exports = {
    getBelbinResponse,
    getEffortResponse,
    getPreferenceResponse
}

