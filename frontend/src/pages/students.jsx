import React, { useState, useEffect } from "react";
import { useParams } from 'react-router';
import { Stack, Button, ButtonGroup, Table, Tr, Th, Thead, Tbody, HStack, Spacer, Center, Heading, TagLeftIcon, Icon } from "@chakra-ui/react"
import { MdFilterAlt } from 'react-icons/md'
import StudentRow2 from "../components/StudentRowStudentDisplay";
import NavBar from "../components/NavBar";
import { Link } from "react-router-dom";

function Students() {
    const { unitID } = useParams();
    
    const [allStudents, setStudents] = useState([])
    const [allGroups,setAllGroups] = useState([])
    const [hasError, setHasError] = useState(false)


    useEffect(() => {
        const labs = [];

        fetch("http://localhost:8080/api/students/" + unitID).then(
            res => res.json().then(
                res => setStudents(res)
            )
        ).catch(err => setHasError(true))
        fetch("http://localhost:8080/api/groups/" + unitID).then(
                res => res.json().then(
                    function(){
                        for(let i = 0; i < res.length; i++){
                            labs.push({labId : res[i].labId, groupNumber : res[i].groupNumber, groupId: res[i].groupId});
                          }
                        setAllGroups(labs)
                    }
                )
        )
    }, [])

    return (
        <div>

            <Heading alignContent={"center"}>
                <Center margin="10">{unitID}</Center>
            </Heading>

            <HStack margin="0px 0px 5vh 0px">

                <Spacer /><Spacer /><Spacer /><Spacer /><Spacer /><Spacer /><Spacer /><Spacer /><Spacer />

                <HStack m="40px">
                    <Spacer />
                    <ButtonGroup colorScheme='#282c34' variant='outline' size='lg'>
                        <Link to={'/groups/' + unitID}>
                            <Button margin="0px 2px">Groups</Button>
                        </Link>
                        <Button margin="0px 2px" isDisabled={true}>Students</Button>
                    </ButtonGroup>
                    <Spacer />
                </HStack>

                <Spacer /><Spacer /><Spacer /><Spacer /><Spacer /><Spacer />

                <HStack >
                    <Spacer />
                    <Button colorScheme='gray' >
                        Filter Properties<Icon margin="0px 0px 0px 10px" as={MdFilterAlt}></Icon>
                    </Button>
                </HStack>

                <Spacer />

            </HStack>

            <Center>
                <Table variant='striped' width="80vw">
                    <Thead>
                        <Tr>
                            <Th>Name</Th>
                            <Th>Email Address</Th>
                            <Th>Class Number</Th>
                            <Th>Group Number</Th>
                        </Tr>
                    </Thead>
                    <Tbody>
                        {allStudents.map((student) => (
                            <StudentRow2 props={student} key={student.id} allLabs = {labs} />
                        ))}
                    </Tbody>
                </Table>
            </Center>

        </div>
    );
};

export default Students;