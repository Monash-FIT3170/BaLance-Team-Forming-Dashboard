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

  const [hasError, setHasError] = useState(false);

  const [unitCode, setUnitCode] = useState('');

  const [unitName, setUnitName] = useState('');

  const [unitYearOffering, setUnitYearOffering] = useState('');

  const [unitSemesterOffering, setUnitSemesterOffering] = useState('');

  const handleSubmitUnit = (event) => {
    event.preventDefault();

    console.log('POSTING data');
    const unitObject = {
      unitCode: unitCode,
      unitFaculty: unitName,
    };

    console.log(unitObject);

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

  useEffect(() => {
    fetch('http://localhost:8080/api/units/')
      .then((res) => res.json())
      .then((data) => {
        setUnits(data);
      })
      .catch((err) => {
        setHasError(true);
        console.error('Error fetching units:', err);
      });
  }, []);

  return (
    <div>
      <Center margin="40px">
        <Heading>Unit Home Page</Heading>
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
                  <Input
                    mb="5"
                    value={unitCode}
                    onChange={(event) => {
                      console.log('AAAAAA');
                      console.log(event.target.value);
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
                      <option value="option1">Semester 1</option>
                      <option value="option2">Semester 2</option>
                      <option value="option3">Full-Year</option>
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

      <Container className="units" maxW="80vw">
        {console.log(units)}
        {units &&
          units.map((unit) => (
            <UnitCard {...unit} key={unit.unitCode} className="unit" />
          ))}
      </Container>
    </div>
  );
}

export default UnitPage;
