import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Box, ChakraProvider, Container, Heading, extendTheme } from '@chakra-ui/react';
import { useAuth0 } from '@auth0/auth0-react';

import { MockAuth } from './helpers/mockAuth';
import UploadGroupScript from './pages/UploadGroupScript';
import CreateGroups from './pages/CreateGroups';
import HomePage from './pages/Units';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage.jsx';
import ContributorsPage from './pages/ContributorsPage';
import FAQPage from './pages/FAQPage';
import NavBar from './components/_shared/NavBar';
import Groups from './pages/Groups';
import Students from './pages/Students';
import UnitAnalytics from './pages/UnitAnalytics';
import GroupAnalytics from './pages/GroupAnalytics';
import Import from './pages/Import';

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
              <Route path="/faq" element={<FAQPage />} />  
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
            </Routes>
          )}
          {!isAuthenticated && (
            <Container centerContent>
              <Box height="100px"></Box>
              <Heading as="h3" size="xl">
                <button onClick={loginWithRedirect}>
                  <Heading as="h2" size="xl" variant="underline">
                    Login
                  </Heading>
                </button>{' '}
                to Create Groups!
              </Heading>
            </Container>
          )}
        </div>
      </BrowserRouter>
    </ChakraProvider>
  );
}

export default App;
