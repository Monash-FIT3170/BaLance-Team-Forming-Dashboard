import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { ChakraProvider } from '@chakra-ui/react'
import Home from './pages/Home'
import DisplayUnitGroups from './pages/DisplayUnitGroups'
import logo from './assets/logo.png';

function App() {
  return (
    <ChakraProvider>
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
