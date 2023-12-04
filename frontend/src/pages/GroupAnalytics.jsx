import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import {
    Center,

} from '@chakra-ui/react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, LinearScale, CategoryScale, BarController, BarElement } from 'chart.js';
import { ArrowBackIcon } from '@chakra-ui/icons';
import { MockAuth } from '../helpers/mockAuth';
import { useAuth0 } from '@auth0/auth0-react';
import PageHeader from "../components/shared/PageHeader";
import NavButton from "../components/shared/NavButton";
import AnalyticsCard from "../components/analyticsPage/AnalyticsCard";

ChartJS.register(ArcElement, Tooltip, Legend, LinearScale, CategoryScale, BarController, BarElement);

const UnitAnalytics = () => {
    let authService = {
        "DEV": MockAuth,
        "TEST": useAuth0
    }

    const { getAccessTokenSilently } = authService[process.env.REACT_APP_AUTH]();
    const { unitCode, year, period, groupNumber } = useParams();
    const [analytics, setAnalytics] = useState([]);


    useEffect(() => {
        getAccessTokenSilently().then((token) => {
            fetch(`http://localhost:8080/api/analytics/${unitCode}/${year}/${period}/${groupNumber}`, {
                headers: new Headers({
                    'Authorization': `Bearer ${token}`
                })
            })
            .then((res) => res.json())
            .then((data) => {
                console.log(data)
                setAnalytics(data)
            })
            .catch((err) => {
                console.error('Error fetching analytics:', err);
            });
    })}, []);


    return (
        <div>
            <PageHeader
                fontSize={"2xl"}
                pageDesc={`Group analytics: ${unitCode} ${period} ${year}`}
            />

            <Center>
                <NavButton
                    buttonIcon={<ArrowBackIcon />}
                    buttonText="Return to offering dashboard"
                    buttonUrl={`/students/${unitCode}/${year}/${period}`}
                />
            </Center>

            {analytics.map((data, index) => (
                <AnalyticsCard
                    personalityTypeData={data}
                    index={index}
                />
            ))}
        </div>
    );
};

export default UnitAnalytics;
