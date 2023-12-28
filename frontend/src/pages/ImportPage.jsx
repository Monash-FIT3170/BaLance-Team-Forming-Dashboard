import { useState } from 'react';
import { useParams } from 'react-router';
import { ArrowBackIcon } from "@chakra-ui/icons";
import {
    Flex,
    useDisclosure,
    Spacer,
    VStack,
    Center,
} from '@chakra-ui/react';

import csvHeaderMapping from "../helpers/csvHeaderMapping";
import DeleteProfileModal from '../components/importPage/DeleteProfileModal';
import ConfirmClearSelection from '../components/importPage/ConfirmClearSelection';
import UploadCSV from '../components/importPage/UploadCSV';
import CsvPreviewTable from "../components/importPage/CsvPreviewTable";
import NavButton from "../components/_shared/NavButton";
import PageHeader from "../components/_shared/PageHeader";
import Dropdown from "../components/_shared/Dropdown";
import AddStudentModal from "../components/importPage/AddStudentModal";
import EditStudentModal from "../components/importPage/EditStudentModal";

const ImportPage = () => {
    const [isFileChosen, setIsFileChosen] = useState(false);
    const [csvFile, setCsvFile] = useState(null);
    const [isClearModalOpen, setIsClearModalOpen] = useState(false);
    const [currProfile, setCurrProfile] = useState(null);
    const [profileToDelete, setProfileToDelete] = useState(null);
    const [dataType, setDataType] = useState('students')
    const [profiles, setProfiles] = useState([]);
    const [headerMap, setHeaderMap] = useState(csvHeaderMapping[dataType])

    const {
        isOpen: isDeleteProfileOpen,
        onOpen: onDeleteProfileOpen,
        onClose: onDeleteProfileClose,
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

    return (
        <VStack>
            <PageHeader
                fontSize={"2xl"}
                pageDesc={`Import data: ${unitCode} ${period} ${year}`}
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
                    width="60%"
                    isFileChosen={isFileChosen}
                    setIsFileChosen={setIsFileChosen}
                    csvFile={csvFile}
                    setCsvFile={setCsvFile}
                    setIsConfirmationClearOpen={setIsClearModalOpen}
                    csvHeaderType={dataType}
                    profiles={profiles}
                    setProfiles={setProfiles}
                    headerMap={headerMap}
                />
                <Spacer/>
                <Flex width="33%" flexDirection="column" justifyContent="flex-end">
                    <Dropdown
                        dropDownDesc={'Select the type of data to upload'}
                        options={['students', 'belbin', 'effort']}
                        width="100%"
                        onChange={(event) => {
                            console.log(dataType, event.target.value)
                            const selection = event.target.value;
                            setDataType(selection)
                            setHeaderMap(csvHeaderMapping[selection])
                        }}
                    />
                </Flex>
            </Flex>

            <AddStudentModal 
                unitCode={unitCode} 
                unitYear={year}
                unitPeriod={period}
                />

            <CsvPreviewTable
                headerMap={headerMap}
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
            <br/>
        </VStack>
    );
}

export default ImportPage;
