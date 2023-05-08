import { Image, Container } from "@chakra-ui/react";
import logo from '../assets/logo_separated.png';



export default function NavBar() {

    return (
        <Container display="flex" p="5" maxH="15vh" minW="100vw" bgColor="balance.header_color" centerContent overflow="hidden">
            <button><Image height="10vh" src={logo} alt="BaLance: Team Forming Dashboard" /></button>
        </Container>
    )

}