import React, { useEffect, useState } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { MockAuth } from '../helpers/mockAuth';
import { useDisclosure, Spacer, Grid, Flex, VStack } from '@chakra-ui/react';
import UnitCard from '../components/unitHomePage/UnitCard';
import '../App.css';
import CreateUnitModal from '../components/unitHomePage/CreateUnitModal';
import PageHeader from '../components/shared/PageHeader';
import AddButton from '../components/shared/AddButton';

function UnitPage() {
  const [units, setUnits] = useState([]);
  let authService = {
    DEV: MockAuth,
    TEST: useAuth0,
  };

  const { getAccessTokenSilently } = authService[process.env.REACT_APP_AUTH]();

  const { isOpen: isAddOpen, onOpen: onAddOpen, onClose: onAddClose } = useDisclosure();

  const { isOpen: isNavOpen, onOpen: onNavOpen, onClose: onNavClose } = useDisclosure();

  useEffect(() => {
    getAccessTokenSilently().then((token) => {
      fetch('http://localhost:8080/api/units/', {
        method: 'get',
        headers: new Headers({
          Authorization: `Bearer ${token}`,
        }),
      })
        .then((res) => res.json())
        .then((data) => {
          setUnits(data);
        })
        .catch((err) => {
          console.error('Error fetching units:', err);
        });
    });
  }, []);

  return (
    <div>
      <Flex margin="40px">
        <Spacer />
        <Spacer />
        <PageHeader fontSize="4xl" pageDesc="Home" />
        <Spacer />
        <VStack>
          <Spacer />
          <AddButton buttonText="Add offering" onClick={onAddOpen} width="20vw" />
          <Spacer />
        </VStack>
      </Flex>

      <Grid
        templateColumns="repeat(3, 1fr)"
        gap={4}
        className="units"
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100%',
        }}
      >
        {units &&
          units.map((unit, index) => (
            <UnitCard
              {...unit}
              key={`${unit.unit_code}/${unit.unit_off_year}/${unit.unit_off_period}`}
              index={index}
              className="unit"
            />
          ))}
      </Grid>

      <CreateUnitModal isModalOpen={isAddOpen} onModalClose={onAddClose} />
    </div>
  );
}

export default UnitPage;
