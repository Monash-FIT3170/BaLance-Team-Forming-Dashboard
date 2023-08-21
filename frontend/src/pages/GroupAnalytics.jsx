import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useParams } from 'react-router';
import StudentRowGroupDisplay from '../components/StudentRowGroupDisplay';
import {
Card,
CardBody,
CardHeader,
Heading,
Center,
} from '@chakra-ui/react'

const GroupAnalytics = () =>{
    const {
        unitCode,
        year,
        period,
        lab_number,
        group_number
    } = useParams();

  return (
    <div>
       <Center>
       <Heading mt="20px" fontSize="30px">
          {unitCode} -  {period}, {year} : Lab {lab_number}, Group {group_number}
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
}
export default GroupAnalytics;