import GroupCard from "../components/GroupCard";
import { useParams } from 'react-router';
import React, { useState, useEffect} from "react";
import { Button, ButtonGroup, HStack, Spacer, Container, Heading, Center, Icon } from "@chakra-ui/react"
import { MdFilterAlt } from 'react-icons/md'
import { Link, useNavigate } from "react-router-dom";

function Groups() {
  const {unitID}  = useParams();

  const navigate = useNavigate();

  const handleUploadClick = () => {
    navigate('/uploadStudents');
  };


  const [state, setState] = useState([])
  const [allGroups, setAllGroups] = useState([])
  const [hasError, setHasError] = useState(false)


  useEffect(() => {
    const summary = [];

      fetch("http://localhost:8080/api/groups/" + unitID).then(
          res => res.json().then(
            function (res){
              setState(res);

              for(let i = 0; i < res.length; i++){
                summary.push({labId : res[i].labId, groupNumber : res[i].groupNumber, groupId: res[i].groupId});
              }

              setAllGroups(summary);

            }
          )
      ).catch(err => setHasError(true))
  }, [])


  return (
    <div>
      <Heading alignContent={"center"}>
        <Center margin="10">{unitID}</Center>
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
            <Link to={'/students/' + unitID}>
              <Button margin="0px 2px">Students</Button>
            </Link>
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

      <Container className="groups" maxW="80vw">
        {state.map((group) => (
          <GroupCard props={group} key={group.id} allIds = {allGroups} />
        ))}
      </Container>
    </div>
  );
};

export default Groups;