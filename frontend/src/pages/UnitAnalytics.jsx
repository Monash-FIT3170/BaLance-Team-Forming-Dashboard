import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import {
    Box,
    Card,
    CardBody,
    CardHeader,
    Heading,
    Center,
} from '@chakra-ui/react';
import { Doughnut, Bar } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { CategoryScale } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale);

const UnitAnalytics = () => {
    const [analytics, setAnalytics] = useState([]);

    const { unitCode, year, period } = useParams();

    useEffect(() => {
        fetch(`http://localhost:8080/api/analytics/${unitCode}/${year}/${period}`)
            .then((res) => res.json())
            .then((data) => setAnalytics(data))
            .catch((err) => {
                console.error('Error fetching analytics:', err);
            });
    }, []);

    return (
        <div>
            {analytics.length === 0 ? (
                <Center>
                    <Heading>No analytics data available.</Heading>
                </Center>
            ) : (
                analytics.map((item, index) => (
                    <Center key={index}>
                        <Box width="100%" maxWidth="800px" margin="20px">
                            <Card padding="20px" border="1px">
                                <CardHeader>
                                    <Heading style={{ marginTop: '-20px' }}>
                                        {item['personality title']}
                                    </Heading>
                                </CardHeader>
                                <CardBody>
                                    {item.data.map((chartData, dataIndex) => (
                                        <div key={dataIndex}>
                                            <h3
                                                style={{
                                                    marginTop: dataIndex === 0 ? '0' : '15px',
                                                    marginBottom: '15px',
                                                }}
                                            >
                                                {chartData.title}
                                            </h3>
                                            {chartData.type === 'doughnut' && (
                                                <Doughnut
                                                    data={{
                                                        labels: chartData.x || [],
                                                        datasets: [
                                                            {
                                                                data: chartData.y || [],
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
                                                        aspectRatio: 3.0,
                                                    }}
                                                />
                                            )}
                                            {chartData.type === 'bar' && (
                                                <Bar
                                                    data={{
                                                        labels: chartData.x.map(String),
                                                        datasets: [
                                                            {
                                                                label: chartData['y label'],
                                                                data: chartData.y,
                                                                backgroundColor: 'blue',
                                                            },
                                                        ],
                                                    }}
                                                    options={{
                                                        responsive: true,
                                                        aspectRatio: 1.5,
                                                    }}
                                                />
                                            )}
                                            <br />
                                        </div>
                                    ))}
                                </CardBody>
                            </Card>
                        </Box>
                    </Center>
                ))
            )}
        </div>
    );
};

export default UnitAnalytics;
