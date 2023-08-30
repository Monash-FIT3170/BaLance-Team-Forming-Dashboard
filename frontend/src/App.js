import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Box, ChakraProvider, Container, Heading, extendTheme} from '@chakra-ui/react';
import { useAuth0 } from '@auth0/auth0-react';
import { MockAuth } from './mockAuth/mockAuth';
import ImportStudents from './pages/ImportStudents';
import UploadGroupScript from './pages/UploadGroupScript';
import CreateGroups from './pages/CreateGroups';
import UnitHomePage from './pages/UnitHomePage';
import NavBar from './components/NavBar';
import Groups from './pages/Groups';
import Students from './pages/Students';
import Teachers from './pages/Teachers';
import BelbinImporter from './pages/ImportBelbin';
import InfoImporter from './pages/ImportStudentInfo';

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
            <Route path="/" element={<UnitHomePage />} />
            <Route path="/groups/:unitCode/:year/:period" element={<Groups />} />
            <Route path="/students/:unitCode/:year/:period" element={<Students />} />
            <Route path="/uploadStudents/:unitCode/:year/:period" element={<ImportStudents />} />
            <Route path="/uploadGroupScript/:unitCode/:year/:period" element={<UploadGroupScript />} />
            <Route path="/createGroups/:unitCode/:year/:period" element={<CreateGroups/>} />
            <Route path="/assigningPage" element={<Teachers />} />
            <Route path="/belbinImport/:unitCode/:year/:period" element={<BelbinImporter />} />
            <Route path="/infoImport/:unitCode/:year/:period" element={<InfoImporter />} />
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
