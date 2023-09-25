import GroupCard from '../components/groupsPage/GroupCard';
import { useParams } from 'react-router';
import { useAuth0 } from '@auth0/auth0-react';
import React, { useState, useEffect } from 'react';
import {
    Button,
    ButtonGroup,
    HStack,
    Container,
    Heading,
    Center,
    useDisclosure,
    VStack,
    Text,
    Select,
    Box,
    useToast, Spacer,
} from '@chakra-ui/react';

import getToastSettings from '../components/shared/ToastSettings';
import { Link, useNavigate } from 'react-router-dom';
import { AddIcon, EditIcon, ViewIcon, DownloadIcon } from '@chakra-ui/icons';
import { MockAuth } from '../helpers/mockAuth';
import NavButton from "../components/shared/NavButton";
import ToggleButtonGroup from "../components/shared/ToggleButtonGroup";
import PageHeader from "../components/shared/PageHeader";

function Groups() {
    const [groups, setGroups] = useState([]);
    const [filteredClass, setFilteredClass] = useState(["All"]);

    let authService = {
        "DEV": MockAuth,
        "TEST": useAuth0
    }

    const { getAccessTokenSilently } = authService[process.env.REACT_APP_AUTH]();

    // Confirmation popup for shuffling groups
    const {
        isOpen,
        onOpen,
        onClose
    } = useDisclosure();

    // Retrieve route parameters
    const {
        unitCode,
        year,
        period
    } = useParams();

    const toast = useToast();
    const getToast = (title, status) => {
        toast.closeAll();
        toast(getToastSettings(title, status))
    }

    useEffect(() => {
        getAccessTokenSilently().then((token) => {
            fetch(`http://localhost:8080/api/groups/${unitCode}/${year}/${period}`,
                {
                    method: 'get',
                    headers: new Headers({
                        'Authorization': `Bearer ${token}`
                    })
                })
                .then((res) =>
                    res.json().then(function (res) {
                        setGroups(res);
                    })
                )
                .catch((err) => console.error(err));
        });
    }, []);

    let groupsDisplay = groups.length === 0 ?
        <Box bg='#E6EBF0' w='60vw' p={4} alignContent="center">
            <Center>
                No groups have been created for this offering. Click "Create/Reconfigure Groups" to create groups for the offering.
            </Center>
        </Box>
        :
        <Container className="groups" maxW="80vw">
            {groups.map((group) => {
                const cardKey = `${group.lab_number}_${group.group_number}`;
                console.log(typeof (filteredClass), typeof (group.lab_number))
                if (filteredClass == "All" | filteredClass == group.lab_number) {
                    return (<GroupCard groupData={group} numberOfGroups={groups.length} key={cardKey} />);
                }
            })}
        </Container>

    const classFilterOptions = [{ value: "All", label: "All labs" }]
    const foundClasses = []
    for (const group of groups) {
        if (foundClasses.indexOf(group.lab_number) === -1) {
            foundClasses.push(group.lab_number)
            classFilterOptions.push({ value: group.lab_number, label: `Lab ${group.lab_number}` })
        }
    }

    const handleExportToCSV = () => {
        /* creating the csv */
        const csvRows = [["Lab Number", "Group Number", "Student ID(s)"]];
        let newRow = [];
        for (const group of groups) {
            newRow.push(group.lab_number);
            newRow.push(group.group_number);
            for (const student of group.students) {
                newRow.push(student.student_id);
            }
            csvRows.push(newRow);
            newRow = [];
        }
        let csvContent = "data:text/csv;charset=utf-8,"
            + csvRows.map(e => e.join(",")).join("\n");

        /* downloading the csv file */
        try {
            var encodedUri = encodeURI(csvContent);
            var link = document.createElement("a");
            link.setAttribute("href", encodedUri);
            const file_name = `${unitCode}_${year}_${period}_groups.csv`;
            link.setAttribute("download", file_name);
            document.body.appendChild(link); // Required for FF
            link.click();
            getToast("Your group data is being downloaded...", "info")
        } catch (error) {
            console.log(error);
        }

        console.log("should have downloaded")
    };

    useEffect(() => {
        fetch(`http://localhost:8080/api/groups/${unitCode}/${year}/${period}`)
            .then((res) =>
                res.json().then(function (res) {
                    console.log(res)
                    setGroups(res);
                })
            )
            .catch((err) => console.error(err));
    }, []);

    return (
        <div>
            <PageHeader
                fontSize={"4xl"}
                pageDesc={`${unitCode} ${period} ${year}`}
            />

            <HStack justifyContent={"center"}>
                <NavButton
                    buttonText="Import student data"
                    buttonUrl={`/uploadData/${unitCode}/${year}/${period}`}
                    buttonIcon={<AddIcon />}
                />
                <NavButton
                    buttonText="Create/reconfigure groups"
                    buttonUrl={`/createGroups/${unitCode}/${year}/${period}`}
                    buttonIcon={<EditIcon />}
                />
                <NavButton
                    buttonText="View unit analytics"
                    buttonUrl={`/unitAnalytics/${unitCode}/${year}/${period}`}
                    buttonIcon={<ViewIcon/>}
                />
            </HStack>
            <br/>

            <HStack margin="0px 20vw 5vh 20vw" justifyContent={'space-between'} alignItems={"center"} maxW="80vw">
                {groups.length > 0 && (
                    <NavButton
                        buttonText="Export group data to .csv"
                        buttonIcon={<DownloadIcon/>}
                        onClick={handleExportToCSV}
                    />
                )}

                <ToggleButtonGroup
                    leftButtonIsDisabled={true}
                    leftButtonUrl={`/groups/${unitCode}/${year}/${period}`}
                    leftButtonText="Groups"
                    rightButtonIsDisabled={false}
                    rightButtonUrl={`/students/${unitCode}/${year}/${period}`}
                    rightButtonText="Students"
                />

                <VStack>
                    <Center><Text fontWeight={"semibold"}>Show Students from Class:</Text></Center>
                    <Select
                        value={filteredClass}
                        onChange={(event) => setFilteredClass(event.target.value)}
                    >
                        {classFilterOptions?.map((option) => (
                            <option key={option.value} value={option.value}>
                                {option.label}
                            </option>
                        ))}
                    </Select>
                </VStack>
            </HStack>

            <Center>
                <VStack>
                    {groupsDisplay}
                </VStack>
            </Center>
        </div>
    );
}

export default Groups;
