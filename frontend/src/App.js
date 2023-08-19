import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Box, ChakraProvider, extendTheme } from '@chakra-ui/react';
import { useAuth0 } from '@auth0/auth0-react';

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

  const { loginWithRedirect, logout, user, isAuthenticated, getAccessTokenSilently } = useAuth0();

  return (
    <ChakraProvider theme={theme}>
      {!isAuthenticated && (
        <button onClick={loginWithRedirect}>Login</button>
      )}
      {isAuthenticated && (
      <BrowserRouter>
        <NavBar />
        <Box pt="12vh" />
        <div className="App">
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
        </div>
        <button onClick={logout}>Logout</button>
      </BrowserRouter>
      )}
    </ChakraProvider>
  );
}

export default App;
