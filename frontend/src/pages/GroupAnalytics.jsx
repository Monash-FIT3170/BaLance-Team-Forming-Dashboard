import { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import { Center } from '@chakra-ui/react';
import { useAuth0 } from '@auth0/auth0-react';
import { ArrowBackIcon } from '@chakra-ui/icons';
import {
    Chart as ChartJS,
    ArcElement,
    Tooltip,
    Legend,
    LinearScale,
    CategoryScale,
    BarController,
    BarElement,
} from 'chart.js';

import { MockAuth } from '../helpers/mockAuth';
import PageHeader from '../components/_shared/PageHeader';
import NavButton from '../components/_shared/NavButton';
import AnalyticsCard from '../components/analyticsPage/AnalyticsCard';

ChartJS.register(
    ArcElement,
    Tooltip,
    Legend,
    LinearScale,
    CategoryScale,
    BarController,
    BarElement
);

const UnitAnalytics = () => {
    let authService = {
        DEV: MockAuth,
        TEST: useAuth0,
    };

    const { getAccessTokenSilently } = authService[import.meta.env.VITE_REACT_APP_AUTH]();
    const { unitCode, year, period, groupNumber } = useParams();
    const [analytics, setAnalytics] = useState([]);

    useEffect(() => {
        getAccessTokenSilently().then((token) => {
            fetch(`/api/analytics/${unitCode}/${year}/${period}/${groupNumber}`, {
                headers: new Headers({
                    Authorization: `Bearer ${token}`,
                }),
            })
                .then((res) => res.json())
                .then((data) => {
                    console.log(data);
                    setAnalytics(data);
                })
                .catch((err) => {
                    console.error('Error fetching analytics:', err);
                });
        });
    }, []);

    return (
        <div>
            <PageHeader
                fontSize={'2xl'}
                pageDesc={`Group analytics: ${unitCode} ${period} ${year}`}
            />

            <Center>
                <NavButton
                    buttonIcon={<ArrowBackIcon />}
                    buttonText="Return to offering dashboard"
                    buttonUrl={`/students/${unitCode}/${year}/${period}`}
                />
            </Center>

            {analytics.map((data) => (
                <AnalyticsCard personalityTypeData={data} />
            ))}
        </div>
    );
};

export default UnitAnalytics;
