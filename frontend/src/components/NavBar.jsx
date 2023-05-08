import { Image, Container } from "@chakra-ui/react";
import logo from '../assets/logo_separated.png';
import { useNavigate } from "react-router-dom";


export default function NavBar() {
    const navigate = useNavigate();

    const handleClick = () => {
    navigate('/');
  };
    return (
        <Container display="flex" p="5" maxH="15vh" minW="100vw" bgColor="balance.header_color" centerContent overflow="hidden">
            <button onClick={handleClick}>  <Image height="10vh" src={logo} alt="BaLance: Team Forming Dashboard" /></button>
        </Container>
    )

}