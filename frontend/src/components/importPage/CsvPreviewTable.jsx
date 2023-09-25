import {Box, Center, Table, Tbody, Td, Th, Thead, Tr, useDisclosure} from "@chakra-ui/react";
import {DeleteIcon, EditIcon} from "@chakra-ui/icons";
import React, {useState} from "react";

const CsvPreviewTable = ({
    headerMap,
    profiles,
    setProfileToDelete,
    onDeleteProfileOpen,
    setCurrProfile
}) => {

    const {
        isOpen: isEditProfileOpen,
        onOpen: onEditProfileOpen,
        onClose: onEditProfileClose,
    } = useDisclosure();

    const [sortConfig, setSortConfig] = useState({ key: null, direction: 'ascending' });

    const sortedProfiles = [...profiles].sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
            return sortConfig.direction === 'ascending' ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
            return sortConfig.direction === 'ascending' ? 1 : -1;
        }
        return 0;
    });

    // Logic for table sorting by column
    const handleSort = (header) => {
        const key = header[0];
        if (sortConfig.key === key) {
            setSortConfig({
                ...sortConfig,
                direction: sortConfig.direction === 'ascending' ? 'descending' : 'ascending',
            });
        } else {
            setSortConfig({ key, direction: 'ascending' });
        }
    };

    const handleDeleteProfile = (studentId) => {
        const selectedProfile = profiles.find(
            (profile) => profile.studentId === studentId
        );
        setProfileToDelete(selectedProfile);
        onDeleteProfileOpen();
    };

    const renderHeader = () => {
        return (
            <Thead>
                <Tr>
                    {Object.keys(profiles[0]).map((key) => {
                        return (<td><b>{key.toUpperCase()}</b></td>)
                    })}
                </Tr>
            </Thead>
        )
    }

    const renderBody = () => {
        console.log(profiles)
        return (
            <Tbody>
                {profiles.map((profile) => (
                    <Tr>
                        {Object.keys(profile).map((key) => {return (<td>{profile[key]}</td>)})}
                        <Td>
                            <EditIcon
                                style={{ cursor: 'pointer' }}
                                onClick={() => {
                                    setCurrProfile(profile);
                                    onEditProfileOpen();
                                }}
                            />
                        </Td>
                        <Td>
                            <DeleteIcon
                                style={{ cursor: 'pointer', color: 'red' }}
                                onClick={() => {handleDeleteProfile(profile.studentId)}}
                            />
                        </Td>
                    </Tr>
                ))}
            </Tbody>
        )
    }

    return (
        (profiles.length === 0) ? (
            <Box bg='#E6EBF0' p={4} alignContent="center" width="80%">
                <Center>
                    No data uploaded.
                </Center>
            </Box>
        ):(
            <Table variant="striped" size="sm" maxWidth="90vw" marginBottom="3vh">
                {renderHeader()}
                {renderBody()}
            </Table>
        )
    )
}

export default CsvPreviewTable;