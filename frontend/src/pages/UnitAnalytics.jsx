import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useParams } from 'react-router';
import {
Box,
Card,
CardBody,
CardHeader,
Heading,
Center,
} from '@chakra-ui/react'
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Doughnut, Bar, Pie } from 'react-chartjs-2';
import Chart from 'chart.js/auto';
import { CategoryScale } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale);

const UnitAnalytics = () => {
const [analytics, setAnalytics] = useState([]);

const {
  unitCode,
  year,
  period
}= useParams()

    useEffect(() => {
        fetch(`http://localhost:8080/api/analytics/${unitCode}/${year}/${period}`, {
            method: 'GET'
        })
            .then((res) => res.json())
            .then((data) => {
                setAnalytics(data);
            })
            .catch((err) => {
                console.error('Error fetching analytics:', err);
            });
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
      {/* {analytics.map((item, index) => (
        <Center key={index}>
          <Box width="100%" maxWidth="800px" margin="20px">
            <Card padding="20px" border="1px">
              <CardHeader>
                <Heading style={{ marginTop: '-20px' }}>
                  {item['personality title']}
                </Heading>
              </CardHeader>
              <CardBody>
                {Array.isArray(item['categorical data']) ? (
                  item['categorical data'].map((categorical, catIndex) => (
                    <div key={catIndex}>
                      <h3 style={{ marginTop: '-30px', marginBottom: '15px' }}>{categorical.title}</h3>
                      <Doughnut
                        data={{
                          labels: categorical?.x || [],
                          datasets: [
                            {
                              data: categorical?.y || [],
                              backgroundColor: [
                                'orange',
                                'purple',
                                'blue',
                                'green',
                                'red',
                              ],
                            },
                          ],
                        }}
                        options={{
                            responsive: true,
                            aspectRatio: 3.0
                        }}
                      />
                      <br />
                    </div>
                  ))
                ) : (
                  <div>
                    {item['numerical data'] && (
                      <div>
                        {item['numerical data'].map((numericalItem, numIndex) => (
                          <div key={numIndex}>
                            <h3>{numericalItem.title}</h3>
                            <Bar
                              data={{
                                labels: numericalItem.x.map(String),
                                datasets: [
                                  {
                                    label: numericalItem['y label'],
                                    data: numericalItem.y,
                                    backgroundColor: 'blue',
                                  },
                                ],
                              }}
                              options={{
                                responsive: true,
                                aspectRatio: 1.5, // Adjust as needed
                              }}
                            />
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </CardBody>
            </Card>
          </Box>
        </Center>
      ))} */}
    </div>
  );
};

export default UnitAnalytics;