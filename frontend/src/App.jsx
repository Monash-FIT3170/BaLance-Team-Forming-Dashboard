import {
  BrowserRouter,
  Routes,
  Route,
  Link as RouterLink
} from 'react-router-dom';
import {
  Box,
  ChakraProvider,
  Container,
  Heading,
  extendTheme,
  Link
} from '@chakra-ui/react';
import { useAuth0 } from '@auth0/auth0-react';

import { MockAuth } from './helpers/mockAuth';
import UploadGroupScript from './pages/UploadGroupScript';
import CreateGroups from './pages/CreateGroups';
import HomePage from './pages/Units';
import LandingPage from './pages/LandingPage';
import LoginPage from './components/loginPage/LoginPage.jsx';
import ContributorsPage from './pages/ContributorsPage';
import NavBar from './components/_shared/NavBar';
import Groups from './pages/Groups';
import Students from './pages/Students';
import UnitAnalytics from './pages/UnitAnalytics';
import GroupAnalytics from './pages/GroupAnalytics';
import Import from './pages/Import';
import RegistrationPage from "./components/loginPage/RegistrationPage.jsx";
import FAQ from './pages/FAQ';
import UserDashboard from './pages/UserDashboard.jsx';

const theme = extendTheme({
  colors: {
    balance: {
      header_color: '#F0EDE7',
      logo_purple: '#24265D',
    },
  },
});

function App() {
  let authService = {
    DEV: MockAuth,
    TEST: useAuth0,
  };

  const { isAuthenticated, loginWithRedirect } =
    authService[import.meta.env.VITE_REACT_APP_AUTH]();

  return (
    <ChakraProvider theme={theme}>
      <BrowserRouter>
        <NavBar authenticated={isAuthenticated} />

        <Box pt="12vh" />

        <div className="App">
          {isAuthenticated && (
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/contributors" element={<ContributorsPage />} />
              <Route path="/faq" element={<FAQ />} />  
              <Route path="/home" element={<HomePage />} />
              <Route path="/groups/:unitCode/:year/:period" element={<Groups />} />
              <Route path="/students/:unitCode/:year/:period" element={<Students />} />
              <Route
                path="/uploadGroupScript/:unitCode/:year/:period"
                element={<UploadGroupScript />}
              />
              <Route
                path="/createGroups/:unitCode/:year/:period"
                element={<CreateGroups />}
              />
              <Route path="/uploadData/:unitCode/:year/:period" element={<Import />} />
              <Route
                path="/unitAnalytics/:unitCode/:year/:period"
                element={<UnitAnalytics />}
              />
              <Route
                path="/groupAnalytics/:unitCode/:year/:period/:groupNumber"
                element={<GroupAnalytics />}
              />
              <Route
                path="/login"
                element={<LoginPage />}
              />
              <Route
                path="/FAQ"
                element={<FAQ />}
              />
              <Route
                path="/login"
                element={<LoginPage />}
              />
              <Route
                path="/userInfo"
                element={<UserDashboard />}
              />
            </Routes>
          )}
          {!isAuthenticated && (
            <LandingPage/>
          )}
        </div>
      </BrowserRouter>
    </ChakraProvider>
  );
}

export default App;
