import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useParams } from 'react-router';
import {
Card,
CardBody,
CardHeader,
Heading,
Center,
} from '@chakra-ui/react'

const UnitAnalytics = () => {
    //for pie charts
    const [categoricalData, setCategoricalData] = useState({});

    //for bar graphs
    const [numericalData, setNumericalData] = useState({});

    const {
        unitCode,
        year,
        period
    } = useParams();

    useEffect(() => {
        // fetch personality data
        fetch('../analytics.json')
        .then((res) => res.json())
        .then((data) => {
            const { categorical, numerical } = data;
            setCategoricalData(categorical);
            setNumericalData(numerical);
        })
        .catch((err) => console.error(err));
    }, []);

  return (
    <div>
       <Center>
       <Heading mt="20px">
          {unitCode} -  {period}, {year}
       </Heading>
       </Center>
       <Center>
       <Heading as="h2" fontSize="2xl" mt="10px">
          Personality Distribution
       </Heading>
       </Center>
       <Center>
       <Card height="200px" width="1000px" border="2px" margin="15px">
       <CardHeader>
       </CardHeader>
       <CardBody margin="15px">
       </CardBody>
    </Card>
    </Center>

    <Center>
        <Card height="200px" width="1000px" border="2px" margin="15px">
         <CardHeader>
        </CardHeader>
        <CardBody margin="15px">
        </CardBody>
        </Card>
    </Center>
   </div>
  );
};
export default UnitAnalytics;