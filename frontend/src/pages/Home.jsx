import { DragHandleIcon, CloseIcon, AddIcon } from '@chakra-ui/icons'
import { MdFilterList } from 'react-icons/md'
import {
    Card, CardBody, CardHeader, CardFooter, Table, Icon,
    Text, Heading, Center, Spacer, HStack, Button
} from "@chakra-ui/react"
import NavBar from "../components/NavBar.jsx"

class PageProps extends React.Component {
  render() {
    return (
      <h2>hello</h2>
    );
  }
}

const { Button } = chakraTheme.components

const theme = extendBaseTheme({
  components: {
    Button,
  },
})

function MyComponent(props) {
  return (
    <div>
      <h1>Unit Lists</h1>
      {props.componentInstance}
    </div>
  );
}

function Home() {
  return (
    <ChakraBaseProvider theme={theme}>
      <MyComponent componentInstance={<PageProps />} />
      
    </ChakraBaseProvider>
  );
}

export default Home;
