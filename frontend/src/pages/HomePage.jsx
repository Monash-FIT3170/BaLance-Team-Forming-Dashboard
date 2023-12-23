import { useEffect, useState } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import {
    useDisclosure,
    Grid,
    AbsoluteCenter,
    Box
} from '@chakra-ui/react';

import { MockAuth } from '../helpers/mockAuth';
import UnitCard from '../components/unitHomePage/UnitCard';
import CreateUnitModal from '../components/unitHomePage/CreateUnitModal';
import PageHeader from "../components/shared/PageHeader";
import AddButton from "../components/shared/AddButton";


function UnitPage() {
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
            fetch('http://localhost:8080/api/units/',
                {
                    method: 'get',
                    headers: new Headers({
                        'Authorization': `Bearer ${token}`
                    })
                }).then((res) => res.json())
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
            <Box w='100%' mt='50px' mb='50px'>
                <AbsoluteCenter>
                    <PageHeader
                        fontSize="4xl"
                        pageDesc="Home"
                    />
                </AbsoluteCenter>

                <Box ml='auto' mr='4em' w='200px'>
                    <AddButton
                        buttonText="Add offering"
                        onClick={onAddOpen}
                        width="200px"
                    />
                </Box>
            </Box>

            <Grid templateColumns="repeat(4, 1fr)" gap={4} className="units" ml={'5em'} mr={'5em'}>
                {units && units.map((unit) => (
                    <UnitCard
                        {...unit}
                        key={`${unit.unit_code}/${unit.unit_off_year}/${unit.unit_off_period}`}
                        className="unit"
                    />
                ))}
            </Grid>

            <CreateUnitModal
                isModalOpen={isAddOpen}
                onModalClose={onAddClose}
            />
        </div>
    );
}

export default UnitPage;
