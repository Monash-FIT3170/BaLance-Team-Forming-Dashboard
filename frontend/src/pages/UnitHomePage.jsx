import React, { useEffect, useState } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { MockAuth } from '../helpers/mockAuth';
import {
    HStack,
    Button,
    Icon,
    useColorModeValue,
    useDisclosure,
    Spacer,
    useToast,
    Grid
} from '@chakra-ui/react';
import { AddIcon } from '@chakra-ui/icons';
import { Center, Heading } from '@chakra-ui/react';
import UnitCard from '../components/unitHomePage/UnitCard';
import '../App.css';
import CreateUnitModal from "../components/unitHomePage/CreateUnitModal";
import PageHeader from "../components/shared/PageHeader";

function UnitPage() {
    let authService = {
        "DEV": MockAuth,
        "TEST": useAuth0
    }
    const { getAccessTokenSilently } = authService[process.env.REACT_APP_AUTH]();


    let iconColor = useColorModeValue('brand.200', 'white');
    const { isOpen: isOpenAdd, onOpen: onAddOpen, onClose: onAddClose } = useDisclosure();

    const [units, setUnits] = useState([]);



    // fetch unit data from the backend
    useEffect(() => {
        getAccessTokenSilently().then((token) => {
            fetch('http://localhost:8080/api/units/',
                {
                    method: 'get',
                    headers: new Headers({
                        'Authorization': `Bearer ${token}`
                    })
                }).then((res) => res.json())
                .then((data) => {
                    console.log(data);
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
            <Center margin="40px">
                <PageHeader
                    fontSize="4x;"
                    pageDesc="Home"
                />

                <Button
                    align="right"
                    justify="right"
                    borderRadius="12px"
                    style={{ position: 'absolute', top: 135, right: 10 }}
                    me="12px"
                    onClick={onAddOpen}
                >
                    <HStack>
                        <p>Add Offering</p>
                        <Spacer />
                        <Icon
                            margin-left="10%"
                            as={AddIcon}
                            color={iconColor}
                        />
                    </HStack>
                </Button>

                <CreateUnitModal
                    isOpenAdd={isOpenAdd}
                    onCloseAdd={onAddClose}
                />
            </Center>

            {/* display the units from the data fetched from the backend */}
            <Grid templateColumns="repeat(3, 1fr)" gap={4} className="units">
                {units &&
                    units.map((unit) => (
                        <UnitCard
                            {...unit}
                            key={`${unit.unit_code}/${unit.unit_off_year}/${unit.unit_off_period}`}
                            className="unit"
                        />
                    ))}
            </Grid>
        </div>
    );
}

export default UnitPage;
