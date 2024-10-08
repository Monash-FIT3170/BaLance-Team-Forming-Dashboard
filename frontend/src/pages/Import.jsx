import { useState } from 'react';
import { useParams } from 'react-router';
import { AddIcon, ArrowBackIcon } from '@chakra-ui/icons';
import {
  Flex,
  Spacer,
  VStack,
  Center,
  HStack,
  Text,
  Button,
  useDisclosure,
} from '@chakra-ui/react';

import csvHeaderMapping from '../helpers/csvHeaderMapping';
import { Dropdown, NavButton, PageHeader } from '../components/_shared';
import {
  DeleteProfileModal,
  ConfirmClearSelection,
  UploadCSV,
  CsvPreviewTable,
  AddProfileModal,
  EditProfileModal,
} from '../components/importPage';
import CsvInfoButton from '../components/importPage/CsvInfoButton';

const Import = () => {
  const [isFileChosen, setIsFileChosen] = useState(false);
  const [csvFile, setCsvFile] = useState(null);
  const [isClearModalOpen, setIsClearModalOpen] = useState(false);
  const [currProfile, setCurrProfile] = useState(null);
  const [profileToDelete, setProfileToDelete] = useState(null);
  const [dataType, setDataType] = useState('students');
  const [profiles, setProfiles] = useState([]);
  const [headerMap, setHeaderMap] = useState(csvHeaderMapping[dataType]);

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
    isOpen: isAddProfileOpen,
    onOpen: onAddProfileOpen,
    onClose: onAddProfileClose,
  } = useDisclosure();

  const { unitCode, year, period } = useParams();
  const generateInfoDesc = () => {
    if (!headerMap) return null;
    const headers = Object.keys(headerMap);
    const requiredHeaders = headers.map((header) => header).join(', ');
    const desc = `Upload a CSV file containing ${dataType} data with the following required headers: ${requiredHeaders}`;
    return <p>{desc}</p>;
  };
  return (
    <VStack>
      <PageHeader
        fontSize={'2xl'}
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
        <Spacer />
        <Flex width="33%" flexDirection="column" justifyContent="flex-end">
          <div>
            <CsvInfoButton
              infoHeader={'.csv file format'}
              infoText={generateInfoDesc()}
            />
          </div>

          <Dropdown
            dropDownDesc={'Select the type of data to upload'}
            options={['students', 'belbin', 'effort', 'times']}
            // width="100%"
            onChange={(event) => {
              const selection = event.target.value;
              setDataType(selection);
              setHeaderMap(csvHeaderMapping[selection]);
            }}
          />
        </Flex>
      </Flex>

      <Button width="80%" onClick={onAddProfileOpen} colorScheme="gray" margin-left="20">
        <HStack>
          <AddIcon />
          <Spacer />
          <Text>Manually add an entry</Text>
        </HStack>
      </Button>

      <CsvPreviewTable
        headerMap={headerMap}
        profiles={profiles}
        setProfileToDelete={setProfileToDelete}
        onDeleteProfileOpen={onDeleteProfileOpen}
        onEditProfileOpen={onEditProfileOpen}
        setCurrProfile={setCurrProfile}
        onChange={(event) => {
          alert(event);
        }}
      />

      <ConfirmClearSelection
        isClearModalOpen={isClearModalOpen}
        setIsClearModalOpen={setIsClearModalOpen}
        setCsvFile={setCsvFile}
        setIsFileChosen={setIsFileChosen}
        setProfiles={setProfiles}
      />

      {/* MODALS FOR MANUALLY ADDING ENTRIES */}
      <AddProfileModal
        dataType={dataType}
        setProfilesList={setProfiles}
        profilesList={profiles}
        isOpen={isAddProfileOpen}
        onClose={onAddProfileClose}
      />
      <DeleteProfileModal
        isOpen={isDeleteProfileOpen}
        onClose={onDeleteProfileClose}
        profileToDelete={profileToDelete}
        setProfileToDelete={setProfileToDelete}
        profiles={profiles}
        setProfiles={setProfiles}
      />
      <EditProfileModal
        dataType={dataType}
        currProfile={currProfile}
        setProfilesList={setProfiles}
        profilesList={profiles}
        isOpen={isEditProfileOpen}
        onClose={onEditProfileClose}
      />
      <br />
    </VStack>
  );
};

export default Import;
