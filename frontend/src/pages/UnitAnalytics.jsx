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
const data = [
  {
    "personality title": "Belbin team roles",
    "description": "Personalities using Belbin team roles",
    "categorical data": [
      {
        "title": "Belbin team roles distribution",
        "x label": "Personality type",
        "y label": "Number of students",
        "x": ["thinking", "action", "people"],
        "y": [50, 50, 25]
      }
    ],
    "categorical data": [
      {
        "title": "Belbin team roles distribution",
        "x label": "Personality type",
        "y label": "Number of students",
        "x": ["thinking", "action", "people"],
        "y": [50, 50, 25]
      }
    ]
  },
  {
    "personality title": "Student Effort",
    "description": "How much effort is put to a unit and marks obtained",
    "categorical data": [
      {
        "title": "Average hour commitment to the unit",
        "x label": "Average hour commitment",
        "y label": "Number of students",
        "x": ["0-4", "4-8", "8-12", "12+"],
        "y": [5, 10, 20, 30, 15]
      },
      {
        "title": "Average assignment mark distribution",
        "x label": ["Average assignment marks"],
        "y label": ["Number of students"],
        "x": ["N", "P", "C", "D", "HD"],
        "y": [10, 10, 20, 30, 15]
      }
    ],
    "numerical data": [
      {
        "title": "Distribution of marks per hour",
        "x label": "Marks per hour",
        "y label": "Number of students",
        "x": [0.2, 0.5, 0.6, 0.8, 1.2],
        "y": [10, 15, 17, 22, 7]
      }
    ]
  }
]
const UnitAnalytics = () => {
  const { unitCode, year, period } = useParams();
  return (
    <div>
       <Center>
       <Heading mt="20px" fontSize="30px">
          {unitCode} -  {period}, {year}
       </Heading>
       </Center>
       <Center>
       <Heading as="h2" fontSize="2xl" mt="10px">
          Personality Distribution
       </Heading>
       </Center>
      {data.map((item, index) => (
        <Center key={index}>
          <Box width="100%" maxWidth="400px" margin="20px">
            <Card padding="20px" border="2px">
              <CardHeader>
                <Heading as="h2" fontSize="xl">
                  {item['personality title']}
                </Heading>
              </CardHeader>
              <CardBody>
                {Array.isArray(item['categorical data']) ? (
                  item['categorical data'].map((categorical, catIndex) => (
                    <div key={catIndex}>
                      <h3>{categorical.title}</h3>
                      <Doughnut
                        data={{
                          labels: categorical?.x || [],
                          datasets: [
                            {
                              data: categorical?.y || [],
                              backgroundColor: [
                                'pink',
                                'purple',
                                'blue',
                                'yellow',
                                'red',
                              ],
                            },
                          ],
                        }}
                      />
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
      ))}
    </div>
  );
};

export default UnitAnalytics;