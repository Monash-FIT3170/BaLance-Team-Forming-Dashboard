import { useAuth0 } from '@auth0/auth0-react';
import { useParams } from 'react-router';
import { HStack, Center } from '@chakra-ui/react';
import { useState, useEffect } from 'react';
import { AddIcon, EditIcon, ViewIcon, RepeatIcon, CheckIcon} from '@chakra-ui/icons';
import { Button, Text, Spacer} from '@chakra-ui/react';

import { MockAuth } from '../helpers/mockAuth';
import { getBelbinResponse, getEffortResponse, getPreferenceResponse } from '../../../backend/googleFormsAPI';
import NavButton from '../components/_shared/NavButton';
import ToggleButtonGroup from '../components/_shared/ToggleButtonGroup';
import PageHeader from '../components/_shared/PageHeader';
import StudentsPreviewTable from '../components/_shared/StudentsPreviewTable';

function preparePersonalityData(belbinResponses, effortResponses) {
  
  const belbinData = belbinResponses.map(([studentId, belbinType]) => ({
    studentId,
    belbinType,
  }));
  const effortData = effortResponses.map(([studentId, effort]) => ({
    studentId,
    effort,
  }));

  const personalityData = [
    {
      students: belbinData,
      testType: 'belbin'
    },
    {
      students: effortData,
      testType: 'effort'
    }
  ];

  return personalityData
}

async function pushData() {
  belbinResponses = getBelbinResponse(auth, '1wAmNlhVdovg0ULG2SH3HIsnHMcJoJ55i8LVnm7QP9qE');
  effortResponses = getEffortResponse(auth, '1gaVlsQARmiYYTmgr3wezZdWFJxVcyrWAaFpX5QleVy8');
  preferenceResponses = getPreferenceResponse(auth, '1BPup6OBO3qyp3Tob2fpTZloGHPuvbzzmFADdNI_NcTg');

  personalityData = preparePersonalityData(belbinResponses, effortResponses)

  for (const data of personalityData) {
    getAccessTokenSilently().then((token) => {
      fetch(
        `http://localhost:8080/api/students/personality/${unitCode}/${year}/${period}`,
        {
          method: 'POST',
          headers: new Headers({
            Authorization: `Bearer ${token}`,
            Accept: 'application/json',
            'Content-Type': 'application/json',
          }),
          body: JSON.stringify({students: data.students, testType: data.testType}),
        }
      )
      .then((response) => {
        if (response.ok) {
          getToast('Your data has been imported successfully!', 'success');
        } else {
          return response.text().then((responseText) => {
            getToast('There was an error importing your file!', 'error');
              throw new Error('Error sending data to the REST API');
          });
        }
      })
      .catch((error) => {
        console.error('Error sending data to the REST API:', error);
        // Optionally show an error message to the user.
      });
    });
  }

};

function Students() {
  let authService = {
    DEV: MockAuth,
    TEST: useAuth0,
  };

  const { getAccessTokenSilently } = authService[import.meta.env.VITE_REACT_APP_AUTH]();
  const [students, setStudents] = useState([]);
  const [numberOfGroups, setNumberOfGroups] = useState(0);

  const { unitCode, year, period } = useParams();

  useEffect(() => {
    getAccessTokenSilently().then((token) => {
      // fetch students from the backend
      fetch(`http://localhost:8080/api/students/${unitCode}/${year}/${period}`, {
        method: 'get',
        headers: new Headers({
          Authorization: `Bearer ${token}`,
        }),
      })
        .then((res) => res.json())
        .then((res) => {
          setStudents(res);
        })
        .catch((err) => console.error(err));

      // fetch groups from the backend
      fetch(`http://localhost:8080/api/groups/${unitCode}/${year}/${period}`, {
        method: 'get',
        headers: new Headers({
          Authorization: `Bearer ${token}`,
        }),
      })
        .then((res) => res.json())
        .then((res) => {
          if (res.length > 0) {
            setNumberOfGroups(res.length);
          }
        })
        .catch((err) => console.error(err));
    });
  }, []);

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
      <HStack justifyContent={'center'} marginTop={'10px'}>
        <Button onClick={pushData}>
          <HStack>
            <CheckIcon />
            <Spacer />
            <Text>Save Responses</Text>
          </HStack>
        </Button>
      </HStack>
      <br />
      <br />
      <HStack margin="0px 20vw 5vh 20vw" justifyContent={'center'}>
        <ToggleButtonGroup
          leftButtonIsDisabled={numberOfGroups < 1}
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
