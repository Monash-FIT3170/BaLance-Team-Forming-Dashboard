import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import UnitCard from '../components/UnitCard';
import '../pages/UnitHomePage.css';

// Chakra imports
import {
  Flex,
  Button,
  Icon,
  Modal,
  ModalBody,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalCloseButton,
  useColorModeValue,
  useDisclosure,
  FormControl,
  FormLabel,
  Input,
  Select,
  Container,
} from '@chakra-ui/react';

import { PlusSquareIcon } from '@chakra-ui/icons';
import { Center, Heading } from '@chakra-ui/react';

function UnitPage() {
  let iconColor = useColorModeValue('brand.200', 'white');
  const { isOpen: isOpenAdd, onOpen: onOpenAdd, onClose: onCloseAdd } = useDisclosure();

  // useState hooks for this page
  const [units, setUnits] = useState([]);
  const [unitCode, setUnitCode] = useState('');
  const [unitName, setUnitName] = useState('');
  const [unitYearOffering, setUnitYearOffering] = useState('');
  const [unitSemesterOffering, setUnitSemesterOffering] = useState('');

  // handle submit unit and posting it to the backend
  const handleSubmitUnit = (event) => {
    event.preventDefault();
    console.log("adding unit")
    const unitObject = {
      unitCode: unitCode,
      unitName: unitName,
      year: unitYearOffering,
      period: unitSemesterOffering
    };

    fetch('http://localhost:8080/api/units/', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(unitObject),
    });

    let answer = window.confirm('Unit created successfully');
    if (answer) {
      onCloseAdd();
    }
  };

  // fetch unit data from the backend
  useEffect(() => {
    fetch('http://localhost:8080/api/units/')
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        setUnits(data);
      })
      .catch((err) => {
        console.error('Error fetching units:', err)
      })
  }, []);

  return (
    <div>
      <Center margin="40px">
        <Heading>Unit Home Page</Heading>

        {/* new unit button */}

        <Button
          w="40px"
          h="40px"
          align="right"
          justify="right"
          borderRadius="12px"
          style={{ position: 'absolute', top: 135, right: 10 }}
          me="12px"
        >
          <Icon
            w="50px"
            h="30px"
            as={PlusSquareIcon}
            color={iconColor}
            onClick={onOpenAdd}
          />
        </Button>

        {/* pop up when adding a new unit */}

        <Modal closeOnOverlayClick={false} isOpen={isOpenAdd} onClose={onCloseAdd}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>New Unit</ModalHeader>
            <ModalCloseButton />
            <hr></hr>
            <ModalBody pb={10}>
              <form id="create-unit" onSubmit={handleSubmitUnit}>
                <br></br>
                <FormControl isRequired>
                  <FormLabel>Unit Code </FormLabel>

                  {/* setting the unit details which uses the setter from the use state functions */}

                  <Input
                    mb="5"
                    value={unitCode}
                    onChange={(event) => {
                      setUnitCode(event.target.value);
                    }}
                  />
                  <FormLabel>Unit Name</FormLabel>
                  <Input
                    mb="5"
                    value={unitName}
                    onChange={(event) => setUnitName(event.target.value)}
                  />
                  <FormLabel>offering</FormLabel>

                  <Flex direction="row" spacing={4}>
                    <Input
                      placeholder="year"
                      mb="5"
                      value={unitYearOffering}
                      onChange={(event) => setUnitYearOffering(event.target.value)}
                    />

                    <Select
                      placeholder="Semester"
                      value={unitSemesterOffering}
                      onChange={(event) => setUnitSemesterOffering(event.target.value)}
                    >
                      <option value="S1">S1</option>
                      <option value="S2">S2</option>
                      <option value="FY">FY</option>
                    </Select>
                  </Flex>
                </FormControl>
              </form>
            </ModalBody>
            <ModalFooter>
              <Button onClick={onCloseAdd} colorScheme="red" mr={3}>
                Cancel
              </Button>
              <Button type="submit" colorScheme="green" form="create-unit">
                Create Unit
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </Center>

      {/* display the units from the data fetched from the backend */}

      <Container className="units" maxW="80vw">
        {units &&
          units.map((unit) => (
            <UnitCard
                {...unit}
                key={`${unit.unit_code}/${unit.unit_off_year}/${unit.unit_off_period}`}
                className="unit"
            />
          ))}
      </Container>
    </div>
  );
}

export default UnitPage;
