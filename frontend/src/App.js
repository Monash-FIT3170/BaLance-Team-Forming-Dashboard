import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { ChakraProvider, extendTheme } from '@chakra-ui/react'
import Home from './pages/Home'
import DisplayUnitGroups from './pages/DisplayUnitGroups'
import UnitHomePage from './pages/UnitHomePage'
import NavBar from './components/NavBar'
import Groups from './pages/groups'
import Students from './pages/students'
//import logo from './assets/logo.png';


const theme = extendTheme({
  colors: {
      balance: {
        header_color: "#F0EDE7",
        logo_purple: "#24265D"
    },

  }
}) 

//test
function App() {
  return (
    <ChakraProvider theme={theme}>
      <NavBar/>
      <div className="App">
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<UnitHomePage />}/>
            <Route path="./DisplayUnitGroups" element={<DisplayUnitGroups />}/>
            <Route path="/" element={<Home />}/>
            <Route path="/groups" element={<Groups />}/>
            <Route path="/students" element={<Students />}/>
          </Routes>
        </BrowserRouter>
      </div>
    </ChakraProvider>

  );
}

export default App;
