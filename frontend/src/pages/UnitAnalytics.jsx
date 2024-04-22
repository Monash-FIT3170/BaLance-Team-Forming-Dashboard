import { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import { Center } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import { ArrowBackIcon } from '@chakra-ui/icons';
import { MockAuth } from '../helpers/mockAuth';
import { useAuth0 } from '@auth0/auth0-react';
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
          Authorization: `Bearer ${token}`,
        }),
      })
        .then((res) => res.json())
        .then((data) => setAnalytics(data))
        .catch((err) => {
          console.error('Error fetching analytics:', err);
        });
    });
  }, []);

  console.log(analytics);

  return (
    <div>
      <PageHeader
        fontSize={'2xl'}
        pageDesc={`Unit analytics: ${unitCode} ${period} ${year}`}
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
