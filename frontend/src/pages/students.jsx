import React, { useState, useEffect } from "react";
import { Stack, Button, ButtonGroup, Table, Tr, Th, Thead, Tbody, HStack, Spacer, Center, Heading, TagLeftIcon, Icon } from "@chakra-ui/react"
import { MdFilterAlt } from 'react-icons/md'
import StudentRow2 from "../components/StudentRowStudentDisplay";
import NavBar from "../components/NavBar";
import { Link } from "react-router-dom";

function Students() {
    
  const [data, setData] = useState([])
  const [hasError, setHasError] = useState(false)


  useEffect(() => {
      fetch("http://localhost:8080/api/students/FIT2085_CL_S1_ON-CAMPUS").then(
          res => res.json().then(
            res => setData(res)
          )
      ).catch(err => setHasError(true))
  }, [])

    return (
        <div>

            <Heading alignContent={"center"}>
                <Center margin="10">{"FIT3170 - Software Engineering Practice (S1, 2023)"}</Center>
            </Heading>

            <HStack margin="0px 0px 5vh 0px">

                <Spacer /><Spacer /><Spacer /><Spacer /><Spacer /><Spacer /><Spacer /><Spacer /><Spacer />

                <HStack m="40px">
                    <Spacer />
                    <ButtonGroup colorScheme='#282c34' variant='outline' size='lg'>
                        <Link to='/groups'>
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
                            <Th></Th>
                            <Th>Name</Th>
                            <Th>Email Address</Th>
                            <Th>Class Number</Th>
                            <Th>Group Number</Th>
                        </Tr>
                    </Thead>
                    <Tbody>
                        {data.map((student) => (
                            <StudentRow2 props={student} key={student.id} />
                        ))}
                    </Tbody>
                </Table>
            </Center>

        </div>
    );
};

export default Students;