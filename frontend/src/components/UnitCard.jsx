
//imports
import {
  Link,
  Flex,
  Button,
  Icon,
  Image,
  Text,
  Modal,
  ModalBody,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalCloseButton,
  useColorModeValue,
  useDisclosure,
} from '@chakra-ui/react';
import { AddIcon, EditIcon } from '@chakra-ui/icons';
import { IoEllipsisHorizontalSharp, IoTrashOutline } from 'react-icons/io5';
import { BrowserRouter, Routes, Route, useNavigate } from 'react-router-dom';

const UnitCard = (unit) => {

  //setting the colors of the card
  let boxBg = useColorModeValue('white !important', '#111c44 !important');
  let mainText = useColorModeValue('gray.800', 'white');
  let secondaryText = useColorModeValue('gray.600', 'gray.600');
  let iconBox = useColorModeValue('gray.100', 'whiteAlpha.200');
  let iconColor = useColorModeValue('brand.200', 'white');
  const {
    isOpen: isOpenDetails,
    onOpen: onOpenDetails,
    onClose: onCloseDetails,
  } = useDisclosure();

  //getting the unit details from the unit object
  const {
    unit_code,
    unit_name,
    unit_off_year,
    unit_off_period,
    enrollment_count
  } = unit

  const navigate = useNavigate();

  //navigate to the groups for the current unit if it is clicked
  const navigateToUnitOffering = () => navigate(`/groups/${unit_code}/${unit_off_year}/${unit_off_period}`);

  // handle delete unit and posting it to the backend
  const handleDeleteUnit = (event) => {
    event.preventDefault();
    console.log("deleting unit")
    

    fetch(`http://localhost:8080/api/units/${unit_code}/${unit_off_year}/${unit_off_period}`, {
      method: 'DELETE',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    });

    let answer = window.confirm('Unit deleted successfully');
    if (answer) {
      onCloseDetails();
    }
    window.location.reload();
  };

  return (
    <Flex
      borderRadius="20px"
      bg={boxBg}
      p="20px"
      h="345px"
      w={{ base: '315px', md: '345px' }}
      alignItems="center"
      direction="column"
    >
      <Flex w="100%" mb="18px">
        <Flex
          w="20px"
          h="40px"
          align="left"
          justify="left"
          borderRadius="20%"
          borderColor="black"
          me="12px"
        ></Flex>
        <Text
          my="auto"
          fontWeight="800"
          color={mainText}
          textAlign="center"
          fontSize="xl"
          me="auto"
        >
          {/* the unit name button */}
          <Button
            onClick={navigateToUnitOffering}
            style={{ fontWeight: 'bold', fontSize: '20px' }}
          >
            {unit_code}
          </Button>
        </Text>

        {/* the 3 dots button */}
        <Button
          w="38px"
          h="38px"
          align="right"
          justify="right"
          borderRadius="12px"
          me="12px"
          bg={iconBox}
          onClick={onOpenDetails}
        >
          <Icon w="24px" h="24px" as={IoEllipsisHorizontalSharp} color={iconColor} />
        </Button>

        {/* the popup when the 3 dots button is clicked, shows the unit details */}
        <Modal
          closeOnOverlayClick={false}
          isOpen={isOpenDetails}
          onClose={onCloseDetails}
          onClick={<Link to={this} onClick={isOpenDetails}></Link>}
        >
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>{unit_code}</ModalHeader>
            <ModalCloseButton />
            <ModalBody pb={6}>{`${enrollment_count} students enrolled`}</ModalBody>
            <ModalFooter>
              <Text
                my="auto"
                fontWeight="800"
                color={mainText}
                textAlign="left"
                fontSize="xl"
                me="auto"
              >
                <Button>
                  {' '}
                  <Icon as={EditIcon}></Icon>{' '}
                </Button>
              </Text>
              <Text
                my="auto"
                fontWeight="800"
                color={mainText}
                textAlign="left"
                fontSize="xl"
                me="auto"
              >
                <Button colorScheme = 'red' onClick={handleDeleteUnit} >
                  DELETE
                </Button>
              </Text>
              <Button onClick={onCloseDetails} mr={3}>
                Cancel
              </Button>
              <Button colorScheme="blue" onClick={onCloseDetails}>
                OK
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </Flex>

      {/* the button with the image and the faculty, when clicked will also bring to the groups for this unit */}
      <Button
        onClick={navigateToUnitOffering}
        style={{ display: 'inline-block', width: 'auto', height: 'auto' }}
      >
        <Image
          src="https://img.freepik.com/free-vector/gradient-purple-color-gradient-background-abstract-modern_343694-2243.jpg?w=740&t=st=1682246391~exp=1682246991~hmac=24a5e0adc73d36b09e5b9fc4b2b05aabd12bab82078f67b6556cb3800ca6d1e4"
          style={{
            height: '60%',
            width: '100%',
            display: 'flex',
            justifyContent: 'center',
          }}
          borderRadius="20px"
          mb="10px"
        />
        <Text
          fontWeight="600"
          color={secondaryText}
          textAlign="center"
          fontSize="l"
          w="80%"
        >
          {unit_name}
        </Text>
      </Button>
    </Flex>
  );
};
export default UnitCard;
