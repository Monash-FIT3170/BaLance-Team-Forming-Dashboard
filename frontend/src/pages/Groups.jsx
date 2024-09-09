import { useParams } from 'react-router';
import { useAuth0 } from '@auth0/auth0-react';
import { useState, useEffect } from 'react';
import { AddIcon, EditIcon, ViewIcon, DownloadIcon } from '@chakra-ui/icons';
import {
    HStack,
    Container,
    Flex,
    Center,
    VStack,
    Text,
    Select,
    Box,
    useToast,
    Spacer,
    Button,
} from '@chakra-ui/react';

import GroupCard from '../components/groupsPage/GroupCard';
import { MockAuth } from '../helpers/mockAuth';
import NavButton from '../components/_shared/NavButton';
import ToggleButtonGroup from '../components/_shared/ToggleButtonGroup';
import PageHeader from '../components/_shared/PageHeader';
import getToastSettings from '../components/_shared/ToastSettings';

function Groups() {
    const [groups, setGroups] = useState([]);
    const [filteredClass, setFilteredClass] = useState(['All']);

    let authService = {
        DEV: MockAuth,
        TEST: useAuth0,
    };

    const { getAccessTokenSilently } = authService[import.meta.env.VITE_REACT_APP_AUTH]();

    const { unitCode, year, period } = useParams();

    const toast = useToast();
    const getToast = (title, status) => {
        toast.closeAll();
        toast(getToastSettings(title, status));
    };

    useEffect(() => {
        getAccessTokenSilently().then((token) => {
            fetch(`${import.meta.env.VITE_BACKEND_URL}/api/groups/${unitCode}/${year}/${period}`, {
                method: 'get',
                headers: new Headers({
                    Authorization: `Bearer ${token}`,
                }),
            })
                .then((res) =>
                    res.json().then(function (res) {
                        setGroups(res);
                    })
                )
                .catch((err) => console.error(err));
        });
    }, []);

    const groupsDisplayBox = (
        <Box bg="#E6EBF0" w="60vw" p={4} alignContent="left">
            <Center>
                No groups have been created for this offering. Click "Create/Reconfigure
                Groups" to create groups for the offering.
            </Center>
        </Box>
    );
    const groupsDisplayContainer = (
        <Container className="groups" maxW="80vw">
            {groups.map((group) => {
                const cardKey = `${group.lab_number}_${group.group_number}`;
                if ((filteredClass == 'All') | (filteredClass == group.lab_number)) {
                    return (
                        <GroupCard
                            groupData={group}
                            numberOfGroups={groups.length}
                            key={cardKey}
                        />
                    );
                }
            })}
        </Container>
    );
    const groupsDisplay = groups.length === 0 ? groupsDisplayBox : groupsDisplayContainer;

    const classFilterOptions = [{ value: 'All', label: 'All labs' }];
    const foundClasses = [];
    for (const group of groups) {
        if (foundClasses.indexOf(group.lab_number) === -1) {
            foundClasses.push(group.lab_number);
            classFilterOptions.push({
                value: group.lab_number,
                label: `Lab ${group.lab_number}`,
            });
        }
    }

    function handleExportToCSV() {
        console.log('reached');
        const csvRows = [['Group', 'Current role', 'Full name', 'Username']];

        groups.forEach((group) => {
            group.students.forEach((student) => {
                const labNumber = group.lab_number;
                const groupNumber = group.group_number;
                const currentRole = 'Student';
                const fullName = `${student.preferred_name} ${student.last_name}`;
                const username = student.email_address.split('@', 1)[0];
                const groupName = `Lab${labNumber}Group${groupNumber}`;

                csvRows.push([groupName, currentRole, fullName, username]);
            });
        });
        const csvContent =
            'data:text/csv;charset=utf-8,' + csvRows.map((e) => e.join(',')).join('\n');
        try {
            const encodedUri = encodeURI(csvContent);
            const link = document.createElement('a');
            link.setAttribute('href', encodedUri);
            const fileName = `${unitCode}_${year}_${period}_groups.csv`;
            link.setAttribute('download', fileName);
            link.click();
        } catch (error) {
            getToast('Failed to download group data', 'error');
        }
    }

    // console.log(groups);
    const flexGapped = {
        display: 'flex',
        gap: '1rem',
    };

    return (
        <div>
            <PageHeader fontSize={'4xl'} pageDesc={`${unitCode} ${period} ${year}`} />

            <HStack justifyContent={'center'}>
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
                    buttonIcon={<ViewIcon />}
                />
            </HStack>
            <br />

            <Flex
                justifyContent={'space-between'}
                alignItems={'center'}
                maxWidth="78vw"
                mx="auto"
            >
                {groups.length > 0 ? (
                    <Button onClick={handleExportToCSV} style={flexGapped}>
                        <DownloadIcon />
                        <span>Export group data to .csv</span>
                    </Button>
                ) : (
                    <Spacer />
                )}
                <Spacer />
                <ToggleButtonGroup
                    leftButtonIsDisabled={true}
                    leftButtonUrl={`/groups/${unitCode}/${year}/${period}`}
                    leftButtonText="Groups"
                    rightButtonIsDisabled={false}
                    rightButtonUrl={`/students/${unitCode}/${year}/${period}`}
                    rightButtonText="Students"
                />
                <Spacer />
                <VStack>
                    <Center>
                        <Text fontWeight={'semibold'}>Show Students from Class:</Text>
                    </Center>
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
                    <br />
                </VStack>
            </Flex>

            <VStack>{groupsDisplay}</VStack>
        </div>
    );
}

export default Groups;
