import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Box, ChakraProvider, Container, Heading, extendTheme} from '@chakra-ui/react';
import { useAuth0 } from '@auth0/auth0-react';

import { MockAuth } from './helpers/mockAuth';
import UploadGroupScript from './pages/UploadGroupScript';
import CreateGroups from './pages/CreateGroups';
import HomePage from './pages/HomePage';
import NavBar from './components/shared/NavBar';
import Groups from './pages/Groups';
import Students from './pages/Students';
import UnitAnalytics from './pages/UnitAnalytics';
import GroupAnalytics from './pages/GroupAnalytics';
import ImportPage from './pages/ImportPage';

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
    "DEV": MockAuth,
    "TEST": useAuth0
  }

  const { isAuthenticated, loginWithRedirect } = authService[process.env.REACT_APP_AUTH]();

  return (
    <ChakraProvider theme={theme}>
      <BrowserRouter>
        <NavBar
          authenticated={isAuthenticated}
        />

        <Box pt="12vh" />

        <div className="App">
        {isAuthenticated && (
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/groups/:unitCode/:year/:period" element={<Groups />} />
            <Route path="/students/:unitCode/:year/:period" element={<Students />} />
            <Route path="/uploadGroupScript/:unitCode/:year/:period" element={<UploadGroupScript />} />
            <Route path="/createGroups/:unitCode/:year/:period" element={<CreateGroups/>} />
            <Route path="/uploadData/:unitCode/:year/:period" element={<ImportPage />} />
            <Route path="/unitAnalytics/:unitCode/:year/:period" element={<UnitAnalytics />} />
            <Route path="/groupAnalytics/:unitCode/:year/:period/:groupNumber" element={<GroupAnalytics />} />
          </Routes>
        )}
        {!isAuthenticated && (
          <Container centerContent>
            <Box height='100px'>

            </Box>
          <Heading as='h3' size='xl'>
            <button onClick={loginWithRedirect}><Heading as='h2' size='xl' variant='underline'>Login</Heading></button> to Create Groups!
          </Heading>
          </Container>
        )}
        </div>

      </BrowserRouter>
    </ChakraProvider>
  );
}

export default App;
