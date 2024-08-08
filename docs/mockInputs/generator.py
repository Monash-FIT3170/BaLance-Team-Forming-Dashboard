#!/usr/bin/python
from datetime import datetime, timedelta
from random import randint
from uuid import uuid4
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

# response = requests.post(mockaroo_endpoint, params=endpoint_params, json=endpoint_body)

# if not response.ok:
#     raise Exception("Call to Mockaroo API returned response NOT ok")

response = [{'lastName': 'Wormleighton', 'nameFemale': 'Evanne', 'nameMale': 'Sutherland'}, {'lastName': 'Bromby', 'nameFemale': 'Stormie', 'nameMale': 'Whitman'}, {'lastName': 'Bolliver', 'nameFemale': 'Wally', 'nameMale': 'Clarence'}, {'lastName': 'Marling', 'nameFemale': 'Marylee', 'nameMale': 'Randal'}, {'lastName': 'Whitnall', 'nameFemale': 'Dacia', 'nameMale': 'Valdemar'}, {'lastName': 'Bonde', 'nameFemale': 'Michal', 'nameMale': 'Welsh'}, {'lastName': 'Huckle', 'nameFemale': 'Hildy', 'nameMale': 'Land'}, {'lastName': 'Tarbert', 'nameFemale': 'Tracy', 'nameMale': 'Coleman'}, {'lastName': 'Cocklin', 'nameFemale': 'Beret', 'nameMale': 'Chilton'}, {'lastName': 'Cammidge', 'nameFemale': 'Lucine', 'nameMale': 'Basilius'}, {'lastName': 'McFayden', 'nameFemale': 'Sharona', 'nameMale': 'Olivier'}, {'lastName': 'Bente', 'nameFemale': 'Zita', 'nameMale': 'Garner'}, {'lastName': 'Rawstorne', 'nameFemale': 'Krista', 'nameMale': 'Flory'}, {'lastName': 'Robotham', 'nameFemale': 'Merna', 'nameMale': 'Hermy'}, {'lastName': 'Furmenger', 'nameFemale': 'Clemmie', 'nameMale': 'Kain'}, {'lastName': 'Maffin', 'nameFemale': 'Sissie', 'nameMale': 'Mackenzie'}, {'lastName': 'Crinion', 'nameFemale': 'Edee', 'nameMale': 'Arnie'}, {'lastName': 'Howen', 'nameFemale': 'Anna-diana', 'nameMale': 'Enoch'}, {'lastName': 'Peasee', 'nameFemale': 'Reina', 'nameMale': 'Hill'}, {'lastName': 'Szymonowicz', 'nameFemale': 'Orella', 'nameMale': 'Drew'}, {'lastName': 'Batalini', 'nameFemale': 'Dasie', 'nameMale': 'Lion'}, {'lastName': 'Matushevitz', 'nameFemale': 'Phyllys', 'nameMale': 'Kenon'}, {'lastName': 'Cromer', 'nameFemale': 'Chantal', 'nameMale': 'Germaine'}, {'lastName': 'Nairne', 'nameFemale': 'Julietta', 'nameMale': 'Rockwell'}, {'lastName': 'Money', 'nameFemale': 'Kassie', 'nameMale': 'Rocky'}, {'lastName': 'Spight', 'nameFemale': 'Nedi', 'nameMale': 'Glynn'}, {'lastName': "M'Quharge", 'nameFemale': 'Lurline', 'nameMale': 'Gran'}, {'lastName': 'Elsop', 'nameFemale': 'Fenelia', 'nameMale': 'Delainey'}, {'lastName': 'Pawlik', 'nameFemale': 'Joeann', 'nameMale': 'Gard'}, {'lastName': 'Challice', 'nameFemale': 'Adelheid', 'nameMale': 'Spenser'}, {'lastName': 'Glamart', 'nameFemale': 'Jennilee', 'nameMale': 'Penrod'}, {'lastName': 'Watterson', 'nameFemale': 'Emmaline', 'nameMale': 'Jasen'}, {'lastName': 'Wastling', 'nameFemale': 'Peria', 'nameMale': 'Maxim'}, {'lastName': 'Waycot', 'nameFemale': 'Georgianne', 'nameMale': 'Weidar'}, {'lastName': 'Wolfarth', 'nameFemale': 'Kaja', 'nameMale': 'Shepperd'}, {'lastName': 'Janikowski', 'nameFemale': 'Rachael', 'nameMale': 'Pascale'}, {'lastName': 'Burston', 'nameFemale': 'Rozalie', 'nameMale': 'Enrique'}, {'lastName': 'Lye', 'nameFemale': 'Sidoney', 'nameMale': 'Rock'}, {'lastName': 'Gaynor', 'nameFemale': 'Claudelle', 'nameMale': 'Dolf'}, {'lastName': 'Mollnar', 'nameFemale': 'Rosanna', 'nameMale': 'Randie'}, {'lastName': 'Scamel', 'nameFemale': 'Delcina', 'nameMale': 'Gaspard'}, {'lastName': 'Tettersell', 'nameFemale': 'Simone', 'nameMale': 'Alex'}, {'lastName': 'Nerval', 'nameFemale': 'Tessie', 'nameMale': 'Pernell'}, {'lastName': 'Spaule', 'nameFemale': 'Teddy', 'nameMale': 'Herb'}, {'lastName': 'Pickthorn', 'nameFemale': 'Alla', 'nameMale': 'Aldon'}, {'lastName': "D'eath", 'nameFemale': 'Madelina', 'nameMale': 'Ricky'}, {'lastName': 'Jedrys', 'nameFemale': 'Wrennie', 'nameMale': 'Harley'}, {'lastName': 'Crennan', 'nameFemale': 'Harri', 'nameMale': 'Bowie'}, {'lastName': 'Miliffe', 'nameFemale': 'Sibeal', 'nameMale': 'Benedict'}, {'lastName': 'Gubbins', 'nameFemale': 'Florencia', 'nameMale': 'Haze'}]

# determine ratio of female to male
num_males = round(float(randint(0, 100))/100 * args.rows)

students = [{
        'lastName': response[i]['lastName'],
        'preferredName': response[i]['nameMale'],
        'gender': 'M'
    } for i in range(0, num_males)] + [{
        'lastName': response[i]['lastName'],
        'preferredName': response[i]['nameFemale'],
        'gender': 'F'
    } for i in range(num_males, len(response))]

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

print(len(students))
print(len(response))

students_df = pd.DataFrame(data=students)
belbin_df = pd.DataFrame(data=belbin_data)
effort_df = pd.DataFrame(data=effort_data)
time_pref_df = pd.DataFrame(data=time_pref_data)

students_df.to_csv("students.csv", header=True, index=False, lineterminator="\n")
belbin_df.to_csv("belbin.csv", header=True, index=False, lineterminator="\n")
effort_df.to_csv("effort.csv", header=True, index=False, lineterminator="\n")
time_pref_df.to_csv("time_pref.csv", header=True, index=False, lineterminator="\n")
