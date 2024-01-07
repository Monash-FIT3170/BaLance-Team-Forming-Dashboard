import { useEffect, useState } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import {
    useDisclosure,
    Grid,
    Box,
    Flex,
    Spacer,
    Center
} from '@chakra-ui/react';

import { MockAuth } from '../helpers/mockAuth';
import UnitCard from '../components/homePage/UnitCard';
import CreateUnitModal from '../components/homePage/CreateUnitModal';
import PageHeader from "../components/_shared/PageHeader";
import AddButton from "../components/_shared/AddButton";


function Units() {
    const [units, setUnits] = useState([]);
    let authService = {
        "DEV": MockAuth,
        "TEST": useAuth0
    }

    const { getAccessTokenSilently } = authService[process.env.REACT_APP_AUTH]();

    const {
        isOpen: isAddOpen,
        onOpen: onAddOpen,
        onClose: onAddClose
    } = useDisclosure();

    const {
        isOpen: isNavOpen,
        onOpen: onNavOpen,
        onClose: onNavClose,
    } = useDisclosure();

    useEffect(() => {
        getAccessTokenSilently().then((token) => {
            fetch('http://localhost:8080/api/units/', {
                    method: 'get',
                    headers: new Headers({
                        'Authorization': `Bearer ${token}`
                    })
                })
                .then((res) => res.json())
                .then((data) => {
                    setUnits(data);
                })
                .catch((err) => {
                        console.error('Error fetching units:', err)
                    }
                )
        })
    }, []);

    return (
        <div>
            <Box w='100%' mt='10px' mb='50px'>
                <Flex>
                    <Box w='200px' ml='4em'/>
                    <Spacer/>
                    <PageHeader
                        fontSize="4xl"
                        pageDesc="Home"
                    />
                    <Spacer/>
                    <Box mt='1.2em' mr='4em' w='200px'>
                        <AddButton
                            buttonText="Add offering"
                            onClick={onAddOpen}
                            width={{
                                sm: "150px",
                                md: "200px"
                            }}
                        />
                    </Box>
                </Flex>
            </Box>

            <Center>
                <Grid
                    templateColumns={{
                        base: "repeat(1, 1fr)",
                        sm: "repeat(2, 1fr)",
                        md: "repeat(3, 1fr)",
                        lg: "repeat(4, 1fr)"
                    }}
                    gap={5}
                    className="units"
                >
                    {units && units.map((unit) => (
                        <UnitCard
                            {...unit}
                            key={`${unit.unit_code}/${unit.unit_off_year}/${unit.unit_off_period}`}
                            className="unit"
                        />
                    ))}
                </Grid>
            </Center>


            <CreateUnitModal
                isModalOpen={isAddOpen}
                onModalClose={onAddClose}
            />
        </div>
    );
}

export default Units;
