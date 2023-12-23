import {
    Icon,
    Text,
    HStack,
    LinkBox,
    LinkOverlay,
    Box,
    useDisclosure
} from '@chakra-ui/react';
import { FaTrash, FaUser } from 'react-icons/fa';
import DeleteModal from "./DeleteModal";

const UnitCard = (unit) => {
    const {
        unit_code,
        unit_name,
        unit_off_year,
        unit_off_period,
        enrolment_count
    } = unit

    const { isOpen, onOpen, onClose } = useDisclosure()

    return (
        <LinkBox w='300px' h='150px' borderWidth='1px' borderRadius='5px' backgroundColor='#E6EBF0'>
            <Box
                width='100%'
                height='1em'
                bg='red'
                borderRadius="5px 5px 0px 0px"
            />

            <HStack mt='10px'>
                <Icon
                    as={FaUser}
                    color="black"
                    boxSize="20px"
                    ml='12px'
                />
                <Text>
                    {enrolment_count}
                </Text>
                <Box w='200px'/>
                <Box as='a' color='teal.400' href='#' fontWeight='bold' onClick={() => {onOpen(); return false;}}>
                    <Icon
                        as={FaTrash}
                        color="black"
                        boxSize="20px"
                        mr='10px'
                    />
                </Box>
            </HStack>

            <Box width='90%' height='100%' ml='auto' mr='auto' mt='0.25em'>
                <LinkOverlay href={`/students/${unit_code}/${unit_off_year}/${unit_off_period}`}>
                    <Text fontSize='2xl' fontWeight='bold'  align='center' noOfLines={1}>
                        {`${unit_code} ${unit_off_year} ${unit_off_period}`}
                    </Text>
                </LinkOverlay>
                <Text noOfLines={1}>
                    {unit_name}
                </Text>
            </Box>

            <DeleteModal
                modalHeader='Delete unit'
                modalText='Are you sure you want to delete this unit?'
                apiEndpoint={`http://localhost:8080/api/units/${unit_code}/${unit_off_year}/${unit_off_period}`}
                onClose={onClose}
                isOpen={isOpen}
            />
        </LinkBox>
    );
};

export default UnitCard;
