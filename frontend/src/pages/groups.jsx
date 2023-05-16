import GroupCard from "../components/GroupCard";
import React from "react";
import { Button, ButtonGroup, HStack, Spacer, Container, Heading, Center, Icon, useDisclosure, AlertDialog, AlertDialogBody, AlertDialogFooter, AlertDialogHeader, AlertDialogContent, AlertDialogOverlay, AlertDialogCloseButton, } from "@chakra-ui/react"
import { MdFilterAlt } from 'react-icons/md'
import {BiShuffle} from 'react-icons/bi'
import NavBar from "../components/NavBar";
import { Link, useNavigate } from "react-router-dom";

const unitID = 'FIT2099_CL_S1_ON-CAMPUS';

function Groups() {
  const navigate = useNavigate();

  // Confirmation popup for shuffling groups
  const { isOpen, onOpen, onClose } = useDisclosure()
  const cancelRef = React.useRef()

  const handleUploadClick = () => {
    navigate('/uploadStudents');
  };

  const handleShuffleGroups= () => {
    // API call to create groups from scratch - will automatically delete existing groups first
    
    fetch('http://localhost:8080/api/groups/' + unitID, 
      {
        method: 'POST', 
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({groupSize: 2, variance: 1})
      }).
     then(
      res => res.json().then(
        res => console.log(res)
      )
     )

    // Close confirmation dialog
    onClose();
  }

  const data = [
    {
      "groupId": 123,
      "labId": 1,
      "groupNumber": 1,
      "members": [{
        "studentFirstName": "Luke", "studentLastName": "Bonso", "studentEmail": "lbon0008@student.monash.edu",
        "wam": "HD", "status": "Active", "discPersonality": "DOMINANT"
      },
      {
        "studentFirstName": "Matt", "studentLastName": "Gan", "studentEmail": "mgan0123@student.monash.edu",
        "wam": "D", "status": "Active", "discPersonality": "STEADINESS AND INFLUENCE"
      },
      {
        "studentFirstName": "Steve", "studentLastName": "Madds", "studentEmail": "smad0004@student.monash.edu",
        "wam": "HD", "status": "Not Active", "discPersonality": "DOMINANT"
      },
      {
        "studentFirstName": "Elsa", "studentLastName": "Grain", "studentEmail": "egra0005@student.monash.edu",
        "wam": "C", "status": "Active", "discPersonality": "DOMINANT"
      }]
    },

    {
      "groupId": 456,
      "labId": 1,
      "groupNumber": 2,
      "members": [{
        "studentFirstName": "Jane", "studentLastName": "Smith", "studentEmail": "jsmi0015@student.monash.edu",
        "wam": "HD", "status": "Not Active", "discPersonality": "DOMINANT"
      },
      {
        "studentFirstName": "Sarah", "studentLastName": "Low", "studentEmail": "slow0028@student.monash.edu",
        "wam": "HD", "status": "Active", "discPersonality": "CONSCIENTIOUSNESS"
      },
      {
        "studentFirstName": "Maria", "studentLastName": "high", "studentEmail": "mhig0048@student.monash.edu",
        "wam": "C", "status": "Not Active", "discPersonality": "DOMINANT"
      },
      {
        "studentFirstName": "Matt", "studentLastName": "Higgins", "studentEmail": "mhig0448@student.monash.edu",
        "wam": "C", "status": "Active", "discPersonality": "STEADINESS AND INFLUENCE"
      }]
    },

    {
      "groupId": 789,
      "labId": 2,
      "groupNumber": 3,
      "members": [{
        "studentFirstName": "John", "studentLastName": "Doe", "studentEmail": "jdoe0012@student.monash.edu",
        "wam": "D", "status": "Active", "discPersonality": "CONSCIENTIOUSNESS"
      },
      {
        "studentFirstName": "John", "studentLastName": "Smith", "studentEmail": "jsmi0006@student.monash.edu",
        "wam": "HD", "status": "Active", "discPersonality": "CONSCIENTIOUSNESS"
      },
      {
        "studentFirstName": "Jim", "studentLastName": "Jones", "studentEmail": "jjon0004@student.monash.edu",
        "wam": "HD", "status": "Active", "discPersonality": "DOMINANT"
      },
      {
        "studentFirstName": "Thomas", "studentLastName": "Main", "studentEmail": "tmai0008@student.monash.edu",
        "wam": "D", "status": "Active", "discPersonality": "INFLUENCE"
      }]
    },

    {
      "groupId": 101,
      "labId": 3,
      "groupNumber": 4,
      "members": [{
        "studentFirstName": "Liz", "studentLastName": "Rey", "studentEmail": "lrey0011@student.monash.edu",
        "wam": "P", "status": "Active", "discPersonality": "DOMINANT"
      },
      {
        "studentFirstName": "Connor", "studentLastName": "Loyd", "studentEmail": "cloy0099@student.monash.edu",
        "wam": "D", "status": "Active", "discPersonality": "INFLUENCE"
      },
      {
        "studentFirstName": "James", "studentLastName": "Lonso", "studentEmail": "jlon0028@student.monash.edu",
        "wam": "D", "status": "Not Active", "discPersonality": "CONSCIENTIOUSNESS"
      },
      {
        "studentFirstName": "Anne", "studentLastName": "Stein", "studentEmail": "aste0018@student.monash.edu",
        "wam": "C", "status": "Active", "discPersonality": "DOMINANT"
      }]
    }
  ];


  return (
    <div>
      <Heading alignContent={"center"}>
        <Center margin="10">{"FIT3170 - Software Engineering Practice (S1, 2023)"}</Center>
      </Heading>

      <HStack margin="0px 0px 5vh 0px">

        <Spacer />
        <Button onClick={handleUploadClick} colorScheme='gray' >
            Upload Students
        </Button>
        <Spacer /><Spacer /><Spacer /><Spacer /><Spacer /><Spacer />
        <HStack m="40px">
          <Spacer />
          <ButtonGroup colorScheme='#282c34' variant='outline' size='lg'>
            <Button margin="0px 2px" isDisabled={true}>Groups</Button>
            <Link to='/students'>
              <Button margin="0px 2px">Students</Button>
            </Link>
          </ButtonGroup>
          <Spacer />
        </HStack>

        <Spacer /><Spacer />

        <HStack >
          <Spacer />

          <Button colorScheme='gray' onClick={onOpen}>
            Shuffle Groups<Icon margin="0px 0px 0px 10px" as={BiShuffle}></Icon>
          </Button>

          <AlertDialog
            isOpen={isOpen}
            leastDestructiveRef={cancelRef}
            onClose={onClose}
          >
            <AlertDialogOverlay>
              <AlertDialogContent>
                <AlertDialogHeader fontSize='lg' fontWeight='bold'>
                  Shuffle Groups
                </AlertDialogHeader>

                <AlertDialogBody>
                  Are you sure? This will delete all existing groups.
                </AlertDialogBody>

                <AlertDialogFooter>
                  <Button ref={cancelRef} onClick={onClose}>
                    Cancel
                  </Button>
                  <Button colorScheme='green' onClick={handleShuffleGroups} ml={3}>
                    Shuffle
                  </Button>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialogOverlay>
          </AlertDialog>

          <Button colorScheme='gray' >
            Filter Properties<Icon margin="0px 0px 0px 10px" as={MdFilterAlt}></Icon>
          </Button>
        </HStack>

        <Spacer />

      </HStack>

      <Container className="groups" maxW="80vw">
        {data.map((group) => (
          <GroupCard props={group} key={group.id} />
        ))}
      </Container>
    </div>
  );
};

export default Groups;