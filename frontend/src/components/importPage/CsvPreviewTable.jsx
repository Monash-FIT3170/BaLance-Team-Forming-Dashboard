import {Table, Tbody, Td, Th, Thead, Tr, useDisclosure} from "@chakra-ui/react";
import {DeleteIcon, EditIcon} from "@chakra-ui/icons";
import React, {useState} from "react";


const CsvPreviewTable = ({headers, profiles}) => {

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

    return (
        <div>
            <Table variant="striped" size="sm" maxWidth="90vw" marginBottom="3vh">
                <Thead>
                    <Tr>
                        {headers.map((header) => (
                            <Th key={header[0]} onClick={() => handleSort(header)}>
                                {header[1]}
                                {sortConfig.key === header[0] && (
                                    <span>{sortConfig.direction === 'ascending' ? '▲' : '▼'}</span>
                                )}
                            </Th>
                        ))}
                    </Tr>
                </Thead>

                <Tbody>
                    {profiles.map((profile) => (
                        <Tr key={profile.studentId}>
                            {
                                headers.map((h) => {
                                    return <td>{profile[h[0]]}</td>
                                })
                            }
                            <Td>
                                {/* FIXME */}
                                {/*<EditIcon*/}
                                {/*    style={{ cursor: 'pointer' }}*/}
                                {/*    onClick={() => {*/}
                                {/*        setCurrProfile(profile);*/}
                                {/*        onEditProfileOpen();*/}
                                {/*    }}*/}
                                {/*/>*/}
                            </Td>
                            <Td>
                                {/* FIXME */}
                                {/*<DeleteIcon*/}
                                {/*    style={{ cursor: 'pointer', color: 'red' }}*/}
                                {/*    onClick={() => handleDeleteProfile(profile.studentId)}*/}
                                {/*/>*/}
                            </Td>
                        </Tr>
                    ))}
                </Tbody>
            </Table>
        </div>
    )
}

export default CsvPreviewTable;