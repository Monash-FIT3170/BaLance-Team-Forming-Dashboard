import React from "react";
// Chakra imports
import {
  Flex,
  Button,
  Icon,
  Image,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
import { AddIcon } from "@chakra-ui/icons";
import { Center, Heading } from "@chakra-ui/react"
import { IoEllipsisHorizontalSharp } from "react-icons/io5";
import NavBar from "../components/NavBar.jsx"

function UnitPage(){
    let boxBg = useColorModeValue("white !important", "#111c44 !important");
    let mainText = useColorModeValue("gray.800", "white");
    let secondaryText = useColorModeValue("gray.600", "gray.600");
    let iconBox = useColorModeValue("gray.100", "whiteAlpha.200");
    let iconColor = useColorModeValue("brand.200", "white");
    
  return(
    <div>
      <NavBar />
        <Center margin="40px">
          <Heading>Unit Home Page</Heading>
          
          {/* <Button
              w='30px'
              h='40px'
              alignContent='right'
              borderRadius='12px'
              me='12px'>
                <Icon w='24px' h='24px'as={AddIcon} color={iconColor}/>
            </Button> */}
          
          <br />
        </Center>
        </div>
  );
}export default UnitPage;