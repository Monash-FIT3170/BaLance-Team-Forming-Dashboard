import React from "react";
import { Stack, Button, ButtonGroup, Table, Tr, Th, Thead, Tbody } from "@chakra-ui/react"
import StudentRow2 from "../components/StudentRow2";
import NavBar from "../components/NavBar";

function Students(){
    const data =  [{
        "studentFirstName": "Luke", "studentLastName": "Bonso", "studentEmail": "lbon0008@student.monash.edu",
        "wam": "HD", "status": "Active", "discPersonality": "DOMINANT", "labId" :"1", "groupNumber":"1"
    },
    {
        "studentFirstName": "Matt", "studentLastName": "Gan", "studentEmail": "mgan0123@student.monash.edu",
        "wam": "D", "status": "Active", "discPersonality": "STEADINESS AND INFLUENCE","labId" :"1", "groupNumber":"1"
    },
    {
        "studentFirstName": "Steve", "studentLastName": "Madds", "studentEmail": "smad0004@student.monash.edu",
        "wam": "HD", "status": "Not Active", "discPersonality": "DOMINANT","labId" :"4", "groupNumber":"3"
    },
    {
        "studentFirstName": "Elsa", "studentLastName": "Grain", "studentEmail": "egra0005@student.monash.edu",
        "wam": "C", "status": "Active", "discPersonality": "DOMINANT","labId" :"4", "groupNumber":"3"
    },
    {
        "studentFirstName": "Jane", "studentLastName": "Smith", "studentEmail": "jsmi0015@student.monash.edu",
        "wam": "HD", "status": "Not Active", "discPersonality": "DOMINANT","labId" :"4", "groupNumber":"1"
    },
    {
        "studentFirstName": "Sarah", "studentLastName": "Low", "studentEmail": "slow0028@student.monash.edu",
        "wam": "HD", "status": "Active", "discPersonality": "CONSCIENTIOUSNESS","labId" :"1", "groupNumber":"1"
    },
    {
        "studentFirstName": "Maria", "studentLastName": "high", "studentEmail": "mhig0048@student.monash.edu",
        "wam": "C", "status": "Not Active", "discPersonality": "DOMINANT","labId" :"1", "groupNumber":"1"
    },
    {
        "studentFirstName": "Matt", "studentLastName": "Higgins", "studentEmail": "mhig0448@student.monash.edu",
        "wam": "C", "status": "Active", "discPersonality": "STEADINESS AND INFLUENCE","labId" :"1", "groupNumber":"1"
    },
    {
        "studentFirstName": "John", "studentLastName": "Doe", "studentEmail": "jdoe0012@student.monash.edu",
        "wam": "D", "status": "Active", "discPersonality": "CONSCIENTIOUSNESS","labId" :"3", "groupNumber":"1"
    },
    {
        "studentFirstName": "John", "studentLastName": "Smith", "studentEmail": "jsmi0006@student.monash.edu",
        "wam": "HD", "status": "Active", "discPersonality": "CONSCIENTIOUSNESS","labId" :"2", "groupNumber":"3"
    },
    {
        "studentFirstName": "Jim", "studentLastName": "Jones", "studentEmail": "jjon0004@student.monash.edu",
        "wam": "HD", "status": "Active", "discPersonality": "DOMINANT","labId" :"3", "groupNumber":"2"
    },
    {
        "studentFirstName": "Thomas", "studentLastName": "Main", "studentEmail": "tmai0008@student.monash.edu",
        "wam": "D", "status": "Active", "discPersonality": "INFLUENCE","labId" :"3", "groupNumber":"3"
    },
    {
        "studentFirstName": "Liz", "studentLastName": "Rey", "studentEmail": "lrey0011@student.monash.edu",
        "wam": "P", "status": "Active", "discPersonality": "DOMINANT","labId" :"1", "groupNumber":"1"
    },
    {
        "studentFirstName": "Connor", "studentLastName": "Loyd", "studentEmail": "cloy0099@student.monash.edu",
        "wam": "D", "status": "Active", "discPersonality": "INFLUENCE","labId" :"2", "groupNumber":"1"
    },
    {
        "studentFirstName": "James", "studentLastName": "Lonso", "studentEmail": "jlon0028@student.monash.edu",
        "wam": "D", "status": "Not Active", "discPersonality": "CONSCIENTIOUSNESS","labId" :"1", "groupNumber":"3"
    },
    {
        "studentFirstName": "Anne", "studentLastName": "Stein", "studentEmail": "aste0018@student.monash.edu",
        "wam": "C", "status": "Active", "discPersonality": "DOMINANT","labId" :"1", "grupNumber":"2"
    }];

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