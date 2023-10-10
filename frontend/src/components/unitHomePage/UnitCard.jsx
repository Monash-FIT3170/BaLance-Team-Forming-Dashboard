//imports
import {
  Box,
  Link,
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
  VStack,
  HStack,
  Spacer,
  Center,
  useToast,
} from '@chakra-ui/react';
import { FaTrash } from 'react-icons/fa';
import { FaUser } from 'react-icons/fa'; // Import the person icon
import getToastSettings from '../shared/ToastSettings';
import { IoEllipsisHorizontalSharp } from 'react-icons/io5';
import { useNavigate } from 'react-router-dom';
import { MockAuth } from '../../helpers/mockAuth';
import { useAuth0 } from '@auth0/auth0-react';

const UnitCard = (unit) => {
  //setting the colors of the card
  const topBoxColor = useColorModeValue('#24265D', 'gray.700');

  let boxBg = useColorModeValue('gray.600');
  let mainText = useColorModeValue('gray.800', 'white');
  let secondaryText = useColorModeValue('gray.600', 'gray.600');
  let iconBox = useColorModeValue('#F1EFEF');
  let iconColor = useColorModeValue('brand.200', 'white');
  let authService = {
    DEV: MockAuth,
    TEST: useAuth0,
  };

  const { getAccessTokenSilently } = authService[process.env.REACT_APP_AUTH]();

  const toast = useToast();
  const getToast = (title, status) => {
    toast.closeAll();
    toast(getToastSettings(title, status));
  };

  const {
    isOpen: isOpenDetails,
    onOpen: onOpenDetails,
    onClose: onCloseDetails,
  } = useDisclosure();

  //getting the unit details from the unit object
  const { unit_code, unit_name, unit_off_year, unit_off_period, enrolment_count } = unit;

  const navigate = useNavigate();

  //navigate to the groups for the current unit if it is clicked
  const navigateToUnitOffering = () =>
    navigate(`/students/${unit_code}/${unit_off_year}/${unit_off_period}`);

  // handle delete unit and posting it to the backend
  const handleDeleteUnit = (event) => {
    getAccessTokenSilently().then((token) => {
      fetch(
        `http://localhost:8080/api/units/${unit_code}/${unit_off_year}/${unit_off_period}`,
        {
          method: 'DELETE',
          headers: new Headers({
            Authorization: `Bearer ${token}`,
          }),
        }
      );
      getToast('Unit deleted successfully', 'success');
      setTimeout(() => {
        onCloseDetails();
        window.location.reload();
      }, 1500);
    });
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center' }}>
      <Box
        as="button"
        onClick={navigateToUnitOffering}
        style={{
          width: '360px',
          height: '160px',
          backgroundColor: '#E6EBF0',
          borderRadius: '5px',
          display: 'flex',
          flexDirection: 'column',
          position: 'relative',
        }}
        className="mx-auto"
      >
        <Box
          style={{
            width: '100%',
            height: '16px',
            backgroundColor: topBoxColor,
            borderTopLeftRadius: '5px',
            borderTopRightRadius: '5px',
          }}
        ></Box>
        <VStack flexGrow={1} width="100%" >
          <HStack width="100%">
            <Icon
              as={FaUser}
              color="black"
              boxSize="20px" // Adjust as needed for icon size
            //   alignSelf="flex-start"
              margin={2}
            />
            <Text>0</Text>
            <Icon
              as={FaTrash}
              color="black"
              boxSize="20px" // Adjust as needed for icon size
              style={{
                marginLeft: "280px"
               }}
            />
          </HStack>
          {/* content here */}
        </VStack>
      </Box>
    </div>
  );
};
export default UnitCard;
