import React, { useState } from 'react';
import { useParams } from 'react-router';
import DeleteProfileModal from '../components/importPage/DeleteProfileModal';
import ConfirmClearSelection from '../components/importPage/ConfirmClearSelection';
import UploadCSV from '../components/importPage/UploadCSV';
import {
    Flex,
    useDisclosure,
    Spacer,
    VStack,
    Center,
} from '@chakra-ui/react';
import CsvPreviewTable from "../components/importPage/CsvPreviewTable";
import NavButton from "../components/shared/NavButton";
import PageHeader from "../components/shared/PageHeader";
import AddButton from "../components/shared/AddButton";
import DropdownDynamic from "../components/shared/DropdownDynamic";
import AddStudentModal from "../components/importPage/AddStudentModal";
import EditStudentModal from "../components/importPage/EditStudentModal";
import {ArrowBackIcon} from "@chakra-ui/icons";

const ImportPage = () => {
    const [isFileChosen, setIsFileChosen] = useState(false);
    const [csvFile, setCsvFile] = useState(null);
    const [isClearModalOpen, setIsClearModalOpen] = useState(false);
    const [currProfile, setCurrProfile] = useState(null);
    const [profileToDelete, setProfileToDelete] = useState(null);
    const [dataType, setDataType] = useState(null)
    const [profiles, setProfiles] = useState([]);

    const {
        isOpen: isDeleteProfileOpen,
        onOpen: onDeleteProfileOpen,
        onClose: onDeleteProfileClose,
    } = useDisclosure();

    const {
        isOpen: isAddProfileOpen,
        onOpen: onAddProfileOpen,
        onClose: onAddProfileClose,
    } = useDisclosure();

    const {
        isOpen: isEditProfileOpen,
        onOpen: onEditProfileOpen,
        onClose: onEditProfileClose,
    } = useDisclosure();

    const {
        unitCode,
        year,
        period
    } = useParams();

    const headers = [] // todo, this is in UploadCSV and used in csvtable

    return (
        <VStack>
            <PageHeader
                fontSize={"2xl"}
                pageDesc={`Import student data: ${unitCode} ${period} ${year}`}
            />
            <Center>
                <NavButton
                    buttonIcon={<ArrowBackIcon />}
                    buttonText="Return to offering dashboard"
                    buttonUrl={`/students/${unitCode}/${year}/${period}`}
                />
            </Center>

            <Flex width="80%">
                <UploadCSV
                    infoButtonHeader={".csv file format"}
                    infoButtonText={"include the following headers: TODO"}
                    width="60%"
                    isFileChosen={isFileChosen}
                    csvFile={csvFile}
                    setIsConfirmationClearOpen={setIsClearModalOpen}
                    setIsFileChosen={setIsFileChosen}
                    csvHeaderType={dataType}
                />
                <Spacer/>
                <Flex width="33%" flexDirection="column" justifyContent="flex-end">
                    <DropdownDynamic
                        placeholder={'select data type'}
                        options={['students', 'belbin', 'effort']}
                        width="100%"
                        setState={setDataType}
                    />
                </Flex>
            </Flex>

            <AddButton
                onClick={onAddProfileOpen}
                buttonText={"Add an entry"}
                width="80%"
            />
            <CsvPreviewTable
                headers={headers}
                profiles={profiles}
                setProfileToDelete={setProfileToDelete}
                onDeleteProfileOpen={onDeleteProfileOpen}
                setCurrProfile={setCurrProfile}
            />

            <ConfirmClearSelection
                isClearModalOpen={isClearModalOpen}
                setIsClearModalOpen={setIsClearModalOpen}
                setCsvFile={setCsvFile}
                setIsFileChosen={setIsFileChosen}
                setProfiles={setProfiles}
            />
            <DeleteProfileModal
                isModalOpen={isDeleteProfileOpen}
                onDeleteProfileClose={onDeleteProfileClose}
                profileToDelete={profileToDelete}
                setProfileToDelete={setProfileToDelete}
                profiles={profiles}
                setProfiles={setProfiles}
            />
            <EditStudentModal
                isEditProfileOpen={isEditProfileOpen}
                onEditProfileClose={onEditProfileOpen}
                currProfile={currProfile}
                setCurrProfile={setCurrProfile}
                profiles={profiles}
                setProfiles={setProfiles}
            />
        </VStack>
    );
}

export default ImportPage;
