
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
    VStack,
    HStack,
    Spacer,
    Center,
    useToast,
} from '@chakra-ui/react';
import { BsTrash } from 'react-icons/bs';
import getToastSettings from '../ToastSettings'
import { IoEllipsisHorizontalSharp } from 'react-icons/io5';
import { BrowserRouter, Routes, Route, useNavigate } from 'react-router-dom';
import { MockAuth } from '../../mockAuth/mockAuth';
import { useAuth0 } from '@auth0/auth0-react';

const UnitCard = (unit) => {

    //setting the colors of the card
    let boxBg = useColorModeValue('white !important', '#111c44 !important');
    let mainText = useColorModeValue('gray.800', 'white');
    let secondaryText = useColorModeValue('gray.600', 'gray.600');
    let iconBox = useColorModeValue('gray.100', 'whiteAlpha.200');
    let iconColor = useColorModeValue('brand.200', 'white');
    let authService = {
        "DEV": MockAuth,
        "TEST": useAuth0
    }

    const { getAccessTokenSilently } = authService[process.env.REACT_APP_AUTH]();

    const toast = useToast();
    const getToast = (title, status) => {
        toast.closeAll();
        toast(getToastSettings(title, status))
    }

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
        enrolment_count
    } = unit

    const navigate = useNavigate();

    //navigate to the groups for the current unit if it is clicked
    const navigateToUnitOffering = () => navigate(`/students/${unit_code}/${unit_off_year}/${unit_off_period}`);

    // handle delete unit and posting it to the backend
    const handleDeleteUnit = (event) => {
        getAccessTokenSilently().then((token) => {
            fetch(`http://localhost:8080/api/units/${unit_code}/${unit_off_year}/${unit_off_period}`, {
                method: 'DELETE',
                headers: new Headers({
                    'Authorization': `Bearer ${token}`
                })
            });
            getToast('Unit deleted successfully', 'success');
            setTimeout(() => {
                onCloseDetails();
                window.location.reload();
            }, 1500);
        })
    }

    return (
        <VStack marginX="2vw" width="26vw">
            <HStack width="100%" marginX="0">
                <Text
                    my="auto"
                    fontWeight="800"
                    color={mainText}
                    textAlign="center"
                    fontSize="xl"
                    me="auto"
                    width="90%"
                >
                    {/* the unit name button */}
                    <Button
                        onClick={navigateToUnitOffering}
                        style={{ fontWeight: 'bold', fontSize: '20px', width: "100%" }}
                    >
                        {`${unit_code} - ${unit_off_period}, ${unit_off_year}`}
                    </Button>
                </Text>
                {/* the 3 dots button */}
                <Button
                    maxW="10%"
                    align="right"
                    justify="right"
                    bg={iconBox}
                    onClick={onOpenDetails}
                >
                    <Icon w="1.5em" h="1.5em" as={IoEllipsisHorizontalSharp} color={iconColor} />
                </Button>
            </HStack>

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

                    <ModalBody>
                        <VStack>
                            <p>{`${unit_off_year}, Semester ${unit_off_period}`}</p>
                        </VStack>
                    </ModalBody>

                    <ModalFooter>
                        <HStack>
                            <Spacer />
                            <Text
                                my="auto"
                                fontWeight="800"
                                color={mainText}
                                textAlign="right"
                                fontSize="xl"
                                me="auto"
                            >
                                <Button colorScheme='red' onClick={handleDeleteUnit} >
                                    <HStack>
                                        <Text>Remove Offering</Text>
                                        <Icon as={BsTrash}></Icon>
                                    </HStack>
                                </Button>
                            </Text>
                        </HStack>

                    </ModalFooter>
                </ModalContent>
            </Modal>

            {/* the button with the image and the faculty, when clicked will also bring to the groups for this unit */}
            <Button
                onClick={navigateToUnitOffering}
                style={{ display: 'inline-block', width: '100%', height: 'auto', marginBottom: "5vh" }}
            >
                <Center>
                    <VStack marginY="2vh">
                        <Text
                            fontWeight="600"
                            color={secondaryText}
                            textAlign="center"
                            fontSize="l"
                            w="80%"
                        >
                            {unit_name}
                        </Text>
                        <Image
                            src="https://img.freepik.com/free-vector/gradient-purple-color-gradient-background-abstract-modern_343694-2243.jpg?w=740&t=st=1682246391~exp=1682246991~hmac=24a5e0adc73d36b09e5b9fc4b2b05aabd12bab82078f67b6556cb3800ca6d1e4"
                            style={{
                                height: 'auto',
                                width: '80%',
                                display: 'flex',
                                justifyContent: 'center',
                            }}
                            borderRadius="20px"
                        />
                    </VStack>

                </Center>


            </Button>
        </VStack>
    );
};
export default UnitCard;
