import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { ChakraProvider, extendTheme } from '@chakra-ui/react'
import Home from './pages/Home'
import DisplayUnitGroups from './pages/DisplayUnitGroups'
import logo from './assets/logo.png';


const theme = extendTheme({
  colors: {
      header_color: {
        500: "#F0EDE7"
    },
  }
}) 


function App() {
  return (
    <ChakraProvider theme={theme}>
      <div className="App">
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Home />}/>
            <Route path="/groups" element={<DisplayUnitGroups />}/>
          </Routes>
        </BrowserRouter>
      </div>
    </ChakraProvider>

  );
}

export default App;
