import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { ChakraProvider, extendTheme } from '@chakra-ui/react'
import Home from './pages/Home'
import DisplayUnitGroups from './pages/DisplayUnitGroups'
import groups from './pages/groups'
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
      <div className="App">
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Home />}/>
            <Route path = "/test" element ={<groups />}/>
            <Route path="/groups" element={<DisplayUnitGroups />}/>
          </Routes>
        </BrowserRouter>
      </div>
    </ChakraProvider>

  );
}

export default App;
