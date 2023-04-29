import GroupCard from "../components/GroupCard";
import React from "react";
import NavBar from "../components/NavBar";

function groups(){
    const data = [
         {
             "groupId": 123,
         "labId": 1,
             "groupNumber": 1,
             "members": [{"studentFirstName": "Luke", "studentLastName": "Bonso", "studentEmail": "lbon0008@student.monash.edu",
                         "wam": "HD", "status": "Active", "discPersonality": "DOMINANT"}, 
                         {"studentFirstName": "Matt", "studentLastName": "Gan", "studentEmail": "mgan0123@student.monash.edu",
                         "wam": "D", "status": "Active", "discPersonality": "STEADINESS AND INFLUENCE"},
                         {"studentFirstName": "Steve", "studentLastName": "Madds", "studentEmail": "smad0004@student.monash.edu",
                         "wam": "HD", "status": "Not Active", "discPersonality": "DOMINANT"},
                         {"studentFirstName": "Elsa", "studentLastName": "Grain", "studentEmail": "egra0005@student.monash.edu",
                         "wam": "C", "status": "Active", "discPersonality": "DOMINANT"}]
         },
     
         {
             "groupId": 456,
         "labId": 1,
             "groupNumber": 2,
             "members": [{"studentFirstName": "Jane", "studentLastName": "Smith", "studentEmail": "jsmi0015@student.monash.edu",
                         "wam": "HD", "status": "Not Active", "discPersonality": "DOMINANT"}, 
                         {"studentFirstName": "Sarah", "studentLastName": "Low", "studentEmail": "slow0028@student.monash.edu",
                         "wam": "HD", "status": "Active", "discPersonality": "CONSCIENTIOUSNESS"},
                         {"studentFirstName": "Maria", "studentLastName": "high", "studentEmail": "mhig0048@student.monash.edu",
                         "wam": "C", "status": "Not Active", "discPersonality": "DOMINANT"},
                         {"studentFirstName": "Matt", "studentLastName": "Higgins", "studentEmail": "mhig0448@student.monash.edu",
                         "wam": "C", "status": "Active", "discPersonality": "STEADINESS AND INFLUENCE"}]
         },
     
         {
             "groupId": 789,
         "labId": 2,
             "groupNumber": 3,
             "members": [{"studentFirstName": "John", "studentLastName": "Doe", "studentEmail": "jdoe0012@student.monash.edu",
                         "wam": "D", "status": "Active", "discPersonality": "CONSCIENTIOUSNESS"}, 
                         {"studentFirstName": "John", "studentLastName": "Smith", "studentEmail": "jsmi0006@student.monash.edu",
                         "wam": "HD", "status": "Active", "discPersonality": "CONSCIENTIOUSNESS"},
                         {"studentFirstName": "Jim", "studentLastName": "Jones", "studentEmail": "jjon0004@student.monash.edu",
                         "wam": "HD", "status": "Active", "discPersonality": "DOMINANT"},
                         {"studentFirstName": "Thomas", "studentLastName": "Main", "studentEmail": "tmai0008@student.monash.edu",
                         "wam": "D", "status": "Active", "discPersonality": "INFLUENCE"}]
         },
     
         {
             "groupId": 101,
         "labId": 3,
             "groupNumber": 4,
             "members": [{"studentFirstName": "Liz", "studentLastName": "Rey", "studentEmail": "lrey0011@student.monash.edu",
                         "wam": "P", "status": "Active", "discPersonality": "DOMINANT"}, 
                         {"studentFirstName": "Connor", "studentLastName": "Loyd", "studentEmail": "cloy0099@student.monash.edu",
                         "wam": "D", "status": "Active", "discPersonality": "INFLUENCE"},
                         {"studentFirstName": "James", "studentLastName": "Lonso", "studentEmail": "jlon0028@student.monash.edu",
                         "wam": "D", "status": "Not Active", "discPersonality": "CONSCIENTIOUSNESS"},
                         {"studentFirstName": "Anne", "studentLastName": "Stein", "studentEmail": "aste0018@student.monash.edu",
                         "wam": "C", "status": "Active", "discPersonality": "DOMINANT"}]
         }
         ];
     
  
    return (
    <div>
      <NavBar />
      <div className="groups">
        {data.map((group) => (
          <GroupCard props = {group} key = {group.id}/>
        ))}
      </div>
    </div>
    );
  };

  export default groups;