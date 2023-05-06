import GroupCard from "../components/GroupCard";
import React from "react";
import {Stack, Button, ButtonGroup} from "@chakra-ui/react"
import NavBar from "../components/NavBar";

function Students(){
    const data = [
         {"studentFirstName": "Luke", "studentLastName": "Bonso", "studentEmail": "lbon0008@student.monash.edu",
                         "wam": "HD", "status": "Active", "discPersonality": "DOMINANT"}, 
        {"studentFirstName": "Matt", "studentLastName": "Gan", "studentEmail": "mgan0123@student.monash.edu",
                         "wam": "D", "status": "Active", "discPersonality": "STEADINESS AND INFLUENCE"},
        {"studentFirstName": "Steve", "studentLastName": "Madds", "studentEmail": "smad0004@student.monash.edu",
                         "wam": "HD", "status": "Not Active", "discPersonality": "DOMINANT"},
        {"studentFirstName": "Elsa", "studentLastName": "Grain", "studentEmail": "egra0005@student.monash.edu",
                         "wam": "C", "status": "Active", "discPersonality": "DOMINANT"},
        {"studentFirstName": "Jane", "studentLastName": "Smith", "studentEmail": "jsmi0015@student.monash.edu",
                         "wam": "HD", "status": "Not Active", "discPersonality": "DOMINANT"}, 
        {"studentFirstName": "Sarah", "studentLastName": "Low", "studentEmail": "slow0028@student.monash.edu",
                         "wam": "HD", "status": "Active", "discPersonality": "CONSCIENTIOUSNESS"},
        {"studentFirstName": "Maria", "studentLastName": "high", "studentEmail": "mhig0048@student.monash.edu",
                         "wam": "C", "status": "Not Active", "discPersonality": "DOMINANT"},
        {"studentFirstName": "Matt", "studentLastName": "Higgins", "studentEmail": "mhig0448@student.monash.edu",
                         "wam": "C", "status": "Active", "discPersonality": "STEADINESS AND INFLUENCE"},
        {"studentFirstName": "John", "studentLastName": "Doe", "studentEmail": "jdoe0012@student.monash.edu",
                         "wam": "D", "status": "Active", "discPersonality": "CONSCIENTIOUSNESS"}, 
        {"studentFirstName": "John", "studentLastName": "Smith", "studentEmail": "jsmi0006@student.monash.edu",
                         "wam": "HD", "status": "Active", "discPersonality": "CONSCIENTIOUSNESS"},
        {"studentFirstName": "Jim", "studentLastName": "Jones", "studentEmail": "jjon0004@student.monash.edu",
                         "wam": "HD", "status": "Active", "discPersonality": "DOMINANT"},
        {"studentFirstName": "Thomas", "studentLastName": "Main", "studentEmail": "tmai0008@student.monash.edu",
                         "wam": "D", "status": "Active", "discPersonality": "INFLUENCE"},
        {"studentFirstName": "Liz", "studentLastName": "Rey", "studentEmail": "lrey0011@student.monash.edu",
                         "wam": "P", "status": "Active", "discPersonality": "DOMINANT"}, 
        {"studentFirstName": "Connor", "studentLastName": "Loyd", "studentEmail": "cloy0099@student.monash.edu",
                         "wam": "D", "status": "Active", "discPersonality": "INFLUENCE"},
        {"studentFirstName": "James", "studentLastName": "Lonso", "studentEmail": "jlon0028@student.monash.edu",
                         "wam": "D", "status": "Not Active", "discPersonality": "CONSCIENTIOUSNESS"},
        {"studentFirstName": "Anne", "studentLastName": "Stein", "studentEmail": "aste0018@student.monash.edu",
                         "wam": "C", "status": "Active", "discPersonality": "DOMINANT"}]
     
    return (
    <div>
      <NavBar />
      <Stack direction='row' spacing={4} align='center' margin="20px">
        <ButtonGroup colorScheme='#282c34' variant='outline' size='lg'>
          <Button>
            Groups
          </Button>
          <Button>
            Students
          </Button>
        </ButtonGroup>
      </Stack>
      <div className="groups">
        {data.map((group) => (
          <GroupCard props = {group} key = {group.id}/>
        ))}
      </div>
    </div>
    );
  };

  export default Groups;