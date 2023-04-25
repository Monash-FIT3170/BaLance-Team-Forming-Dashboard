import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { ChakraProvider, extendTheme } from '@chakra-ui/react'
import Home from './pages/Home'
import DisplayUnitGroups from './pages/DisplayUnitGroups'
import UnitHomePage from './pages/UnitHomePage'
//import logo from './assets/logo.png';


const theme = extendTheme({
  colors: {
      balance: {
        header_color: "#F0EDE7",
        logo_purple: "#24265D"
    },

  }
}) 


function App() {
  return (
    <ChakraProvider theme={theme}>
      <div className="App">
        <BrowserRouter>
        
          <Routes>
            <Route path="/" element={<UnitHomePage />}/>
            <Route path="./DisplayUnitGroups" element={<DisplayUnitGroups />}/>
          </Routes>
        </BrowserRouter>
      </div>
    </ChakraProvider>

  );
}

export default App;
