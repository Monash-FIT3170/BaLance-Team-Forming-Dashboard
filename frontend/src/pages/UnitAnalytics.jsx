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
import { useNavigate } from 'react-router-dom';
import { Doughnut, Bar } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, LinearScale, CategoryScale, BarController, BarElement } from 'chart.js';
import { ArrowBackIcon } from '@chakra-ui/icons';
import { MockAuth } from '../helpers/mockAuth';
import  Plotter  from '../components/Plotter';
import { useAuth0 } from '@auth0/auth0-react';
import PageHeader from "../components/shared/PageHeader";
import NavButton from "../components/shared/NavButton";

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


    return (
        <div>
            <PageHeader
                fontSize={"2xl"}
                pageDesc={`Unit analytics: ${unitCode} ${period} ${year}`}
            />

            <Center>
                <NavButton
                    buttonIcon={<ArrowBackIcon />}
                    buttonText="Return to offering dashboard"
                    buttonUrl={`/students/${unitCode}/${year}/${period}`}
                />
            </Center>

            {analytics.length === 0 ? (
                <Center>
                    <Heading>No analytics data available.</Heading>
                </Center>
            ) : (
                analytics.map((item, index) => (
                    <Plotter 
                        item = {item}
                        index = {index}
                    ></Plotter>
                ))
            )}
        </div>
    );
};

export default UnitAnalytics;
