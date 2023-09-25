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
    Button,
    HStack,
    Spacer,
} from '@chakra-ui/react';
import { Link, useNavigate } from 'react-router-dom';
import { Doughnut, Bar } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, LinearScale, CategoryScale, BarController, BarElement } from 'chart.js';
import { ArrowBackIcon } from '@chakra-ui/icons';
import { MockAuth } from '../helpers/mockAuth';
import { useAuth0 } from '@auth0/auth0-react';
import PageHeader from "../components/shared/PageHeader";

ChartJS.register(ArcElement, Tooltip, Legend, LinearScale, CategoryScale, BarController, BarElement);

const UnitAnalytics = () => {

    let authService = {
        "DEV": MockAuth,
        "TEST": useAuth0
      }

    const { getAccessTokenSilently } = authService[process.env.REACT_APP_AUTH]();

    const navigate = useNavigate();

    const [analytics, setAnalytics] = useState([]);

    const { unitCode, year, period } = useParams();

    const navigateToOfferingDashboard = () => {
        navigate(`/students/${unitCode}/${year}/${period}`);
    };

    useEffect(() => {
        getAccessTokenSilently().then((token) => {
        fetch(`http://localhost:8080/api/analytics/${unitCode}/${year}/${period}`, {
            headers: new Headers({
                'Authorization': `Bearer ${token}`
            })
        })
            .then((res) => res.json())
            .then((data) => setAnalytics(data))
            .catch((err) => {
                console.error('Error fetching analytics:', err);
            });
    })}, []);

    console.log(analytics)

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
            <PageHeader
                fontSize={"2xl"}
                pageDesc={`Unit analytics: ${unitCode} ${period} ${year}`}
            />

            <Center>
                <Button onClick={navigateToOfferingDashboard}>
                    <HStack>
                        <ArrowBackIcon />
                        <Spacer />
                        <Text>Return to offering dashboard</Text>
                    </HStack>
                </Button>
            </Center>
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
