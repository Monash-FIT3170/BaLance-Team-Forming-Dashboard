#!/usr/bin/python
from datetime import datetime, timedelta
from random import randint
import pandas as pd
import requests, argparse
import pprint as p
import datetime

###########################################
###    command line input validation    ###
###########################################
parser = argparse.ArgumentParser(
    prog="generator.py",
    usage="python generator.py [-k|--key]  [-r|--rows] <NUMBER_OF_ROWS> [-l|--labs]",
    description="Generate mock input data for application testing. Default is 50 rows otherwise use " + 
                "the -n flag to specify the number of rows. API key can be generated from https://www.mockaroo.com/"
)

parser.add_argument('-r', '--rows', default=50, type=int, help="The number of rows (students) to generate mock data for.")
parser.add_argument('-l', '--labs', default=4, type=int, help="The number of labs students should be shared across. Note, this must be <= rows")
parser.add_argument('-p', '--projects', default=10, type=int, help="The number of projects in the unit. Note, this must be <= rows")
parser.add_argument('-k', '--key', type=str, required=True, help="The API key from mockaroo to be used as part of mock data generation.")

args = parser.parse_args()

if args.rows < args.labs:
    raise Exception("Number of labs must be <= number of rows.")

if args.rows < args.projects:
    raise Exception("Number of projects must be <= number of rows.")

###########################################
###        generate student data        ###
###########################################

# generate male and female names
mockaroo_endpoint = "https://api.mockaroo.com/api/generate.json"

endpoint_params = {
    "key": args.key,
    "count": args.rows
}

endpoint_body = [
    {
      "name": "lastName",
      "null_percentage": 0,
      "type": "Last Name",
      "formula": None
    },
    {
      "name": "nameFemale",
      "null_percentage": 0,
      "type": "First Name (Female)",
      "formula": None
    },
    {
      "name": "nameMale",
      "null_percentage": 0,
      "type": "First Name (Male)",
      "formula": None
    }
]

response = requests.post(mockaroo_endpoint, params=endpoint_params, json=endpoint_body)

if not response.ok:
    raise Exception("Call to Mockaroo API returned response NOT ok")

mock_names = response.json()

# determine ratio of female to male
num_males = round(float(randint(0, 100))/100 * args.rows)

students = [{
        'lastName': mock_names[i]['lastName'],
        'preferredName': mock_names[i]['nameMale'],
        'gender': 'M'
    } for i in range(0, num_males)] + [{
        'lastName': mock_names[i]['lastName'],
        'preferredName': mock_names[i]['nameFemale'],
        'gender': 'F'
    } for i in range(num_males, len(mock_names))]

id_counter = 10000001
lab_counter = 1
    
# for each student, generate remaining fields
for student in students:
    student['email'] = (student['preferredName'][0:1] + student['lastName'][0:3] + "@student.monash.edu").lower()
    student['wam'] = randint(50, 100)
    student['studentId'] = id_counter
    student['labCode'] = str(lab_counter % args.labs) + "_"
    id_counter += 1
    lab_counter = lab_counter + 1 if lab_counter+1 % args.labs != 0 else lab_counter + 2

print("SAMPLE FROM GENERATED STUDENTS\n##############################")
p.pprint(students[0:3])
print("\n")

###########################################
###        generate belbin data         ###
###########################################

belbin_options = ["people", "thinking", "action"]
belbin_data = []

for student in students:
    belbin_data.append({
        "studentId": student["studentId"],
        "belbinType": belbin_options[randint(0,2)]
    })

print("SAMPLE FROM GENERATED BELBIN\n##############################")
p.pprint(belbin_data[0:3])
print("\n")

###########################################
###        generate effort data         ###
###########################################

effort_data = []

for student in students:
    effort_data.append({
        "studentId": student["studentId"],
        "hourCommitment": randint(1, 7*24),
        "avgAssignmentMark": randint(0,100)
    })

print("SAMPLE FROM GENERATED EFFORT\n##############################")
p.pprint(effort_data[0:3])
print("\n")

###########################################
###     generate time and pref data     ###
###########################################

time_pref_data = []

for student in students:
    projects = [proj for proj in range(1, args.projects+1)]
    preferences = projects.copy()
    date = datetime.date.today().strftime("%m/%d/%Y")

    pref_entry = {
        "studentId": student["studentId"],
        "timeStamp": date + " " + str(randint(0,23)) + ":" + str(randint(0,59)) + ":" + str(randint(0,59))
    }

    for project in projects:
        pref_entry["Project " + str(project) + " Preference"] = preferences.pop(randint(0, len(preferences)-1))

    time_pref_data.append(pref_entry)

print("SAMPLE FROM GENERATED TIME & PREF\n##############################")
p.pprint(time_pref_data[0:3])
print("\n")

###########################################
###      export to respective CSVs      ###
###########################################

students_df = pd.DataFrame(data=students)
belbin_df = pd.DataFrame(data=belbin_data)
effort_df = pd.DataFrame(data=effort_data)
time_pref_df = pd.DataFrame(data=time_pref_data)

students_df.to_csv("students.csv", header=True, index=False, lineterminator="\n")
belbin_df.to_csv("belbin.csv", header=True, index=False, lineterminator="\n")
effort_df.to_csv("effort.csv", header=True, index=False, lineterminator="\n")
time_pref_df.to_csv("time_pref.csv", header=True, index=False, lineterminator="\n")

for file_name in ["students.csv", "belbin.csv", "effort.csv", "time_pref.csv"]:
    # obtained from https://community.alteryx.com/t5/Alteryx-Designer-Desktop-Discussions/Blank-Line-at-the-end-of-csv-file/td-p/1256551
    with open(file_name) as objFile:
        lines = objFile.readlines()
        last_line = lines[len(lines)-1]
        lines[len(lines)-1] = last_line.rstrip()
    with open(file_name, 'w') as objFile:    
        objFile.writelines(lines)
