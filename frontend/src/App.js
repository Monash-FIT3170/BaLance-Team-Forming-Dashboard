import { BrowserRouter, Routes, Route } from 'react-router-dom';
import {Box, ChakraProvider, extendTheme} from '@chakra-ui/react';
import ImportClass from './pages/ImportClass';

import UnitHomePage from './pages/UnitHomePage';
import NavBar from './components/NavBar';
import Groups from './pages/groups';
import Students from './pages/students';
import AssigningPage from './pages/AssigningPage';

const theme = extendTheme({
  colors: {
    balance: {
      header_color: '#F0EDE7',
      logo_purple: '#24265D',
    },
  },
});

function App() {
  return (
    <ChakraProvider theme={theme}>
      <BrowserRouter>
        <NavBar />
        <Box pt="12vh"/>
        <div className="App">
          <Routes>
            <Route path="/" element={<UnitHomePage />} />
            <Route path="/groups/:unitID/*" element={<Groups />} />
            <Route path="/students/:unitID" element={<Students />} />
            <Route path="/uploadStudents/:unitID" element={<ImportClass />} />
            <Route path="/assigningPage" element={<AssigningPage />} />
          </Routes>
        </div>
      </BrowserRouter>
    </ChakraProvider>
  );
}

export default App;
