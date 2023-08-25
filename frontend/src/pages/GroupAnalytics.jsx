import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import {
    Box,
    Card,
    CardBody,
    CardHeader,
    Heading,
    Text,
    Center,
} from '@chakra-ui/react';
import { Doughnut, Bar } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { CategoryScale } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale);

const UnitAnalytics = () => {
    const [analytics, setAnalytics] = useState([]);

    const { unitCode, year, period, groupNumber, labNumber } = useParams();

    useEffect(() => {
        fetch(`http://localhost:8080/api/analytics/${unitCode}/${year}/${period}/${groupNumber}`)
            .then((res) => res.json())
            .then((data) => setAnalytics(data))
            .catch((err) => {
                console.error('Error fetching analytics:', err);
            });
    }, []);

    const generatePastelColors = (count) => {
        const colors = [];
        const baseHue = 200; // Start with a bluish hue
        const hueIncrement = 360 / count;

        for (let i = 0; i < count; i++) {
            const hue = (baseHue + i * hueIncrement) % 360;
            colors.push(`hsla(${hue}, 100%, 70%, 0.9)`);
        }

        return colors;
    };

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
                                    {console.log(Object.values(item))}
                                    <Text>{Object.values(item)[1]}</Text>
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
                                                                backgroundColor: generatePastelColors(
                                                                    chartData.x.length
                                                                ),
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
                                                                backgroundColor: generatePastelColors(
                                                                    chartData.x.length
                                                                )[0], // Use the first color for bars
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
