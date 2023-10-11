import React, { useState, useEffect } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { useParams } from 'react-router';
import { HStack, Center, useDisclosure } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import { AddIcon, EditIcon, ViewIcon } from '@chakra-ui/icons';
import { MockAuth } from '../helpers/mockAuth';
import NavButton from "../components/shared/NavButton";
import ToggleButtonGroup from "../components/shared/ToggleButtonGroup";
import PageHeader from "../components/shared/PageHeader";
import StudentsPreviewTable from "../components/shared/StudentsPreviewTable";

function Students() {
    let authService = {
        "DEV": MockAuth,
        "TEST": useAuth0
    }

    const { getAccessTokenSilently } = authService[process.env.REACT_APP_AUTH]();
    const [students, setStudents] = useState([]);
    const [numberOfGroups, setNumberOfGroups] = useState(0);
    const cancelRef = React.useRef();
    const navigate = useNavigate();
    const {
        isOpen,
        onOpen,
        onClose
    } = useDisclosure();

    const {
        unitCode,
        year,
        period
    } = useParams();

    useEffect(() => {
        getAccessTokenSilently().then((token) => {
            // fetch students from the backend
            fetch(`http://localhost:8080/api/students/${unitCode}/${year}/${period}`,
                {
                    method: 'get',
                    headers: new Headers({
                        'Authorization': `Bearer ${token}`
                    })
                })
                .then((res) => res.json())
                .then((res) => {
                    setStudents(res);
                })
                .catch((err) => console.error(err));

            // fetch groups from the backend
            fetch(`http://localhost:8080/api/groups/${unitCode}/${year}/${period}`,
                {
                    method: 'get',
                    headers: new Headers({
                        'Authorization': `Bearer ${token}`
                    })
                })
                .then((res) => res.json())
                .then((res) => {
                    if (res.length > 0) {
                        setNumberOfGroups(res.length);                        
                        //addGroupToStudents(res);
                    }
                    
                })
                .catch((err) => console.error(err));
        })
    }, []);

    return (
        <div>
            <PageHeader
                fontSize={"4xl"}
                pageDesc={`${unitCode} ${period} ${year}`}
            />
            <HStack justifyContent={"center"}>
                <NavButton
                    buttonText="Import data"
                    buttonUrl={`/uploadData/${unitCode}/${year}/${period}`}
                    buttonIcon={<AddIcon />}
                />
                <NavButton
                    buttonText="Create/reconfigure groups"
                    buttonUrl={`/createGroups/${unitCode}/${year}/${period}`}
                    buttonIcon={<EditIcon />}
                />
                <NavButton
                    buttonText="View offering analytics"
                    buttonUrl={`/unitAnalytics/${unitCode}/${year}/${period}`}
                    buttonIcon={<ViewIcon/>}
                />
            </HStack>
            <br/><br/>
            <HStack margin="0px 20vw 5vh 20vw" justifyContent={'center'}>
                <ToggleButtonGroup
                    leftButtonIsDisabled={false}
                    leftButtonUrl={`/groups/${unitCode}/${year}/${period}`}
                    leftButtonText="Groups"
                    rightButtonIsDisabled={true}
                    rightButtonUrl={`/students/${unitCode}/${year}/${period}`}
                    rightButtonText="Students"
                />
            </HStack>
            <Center>
                <StudentsPreviewTable
                    students={students}
                    numberOfGroups={numberOfGroups}
                    page={'students'}
                    rowHeights={'20px'}
                />
            </Center>
        </div>
    );
}

export default Students;