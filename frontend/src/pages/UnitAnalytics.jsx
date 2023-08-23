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
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Pie } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend);
const data = {
    labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
    datasets: [
      {
        label: '# of Votes',
        data: [12, 19, 3, 5, 2, 3],
        backgroundColor: [
          'rgba(255, 99, 132, 0.2)',
          'rgba(54, 162, 235, 0.2)',
          'rgba(255, 206, 86, 0.2)',
          'rgba(75, 192, 192, 0.2)',
          'rgba(153, 102, 255, 0.2)',
          'rgba(255, 159, 64, 0.2)',
        ],
        borderColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(75, 192, 192, 1)',
          'rgba(153, 102, 255, 1)',
          'rgba(255, 159, 64, 1)',
        ],
        borderWidth: 1,
      },
    ],
    options: {
        responsive: true
    },
};

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
        <Pie data={data} />
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