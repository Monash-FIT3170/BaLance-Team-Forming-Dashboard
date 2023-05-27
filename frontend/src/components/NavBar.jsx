import { Image, Container } from '@chakra-ui/react';
import logo from '../assets/logo_separated.png';
import { useNavigate } from 'react-router-dom';

export default function NavBar() {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate('/');
  };
  return (
    <Container
      as="header"
      pos="fixed"
      top={0}
      left={0}
      w="100%"
      display="flex"
      p="5"
      maxH="12vh"
      minW="100vw"
      bgColor="balance.header_color"
      centerContent
      overflow="hidden"
      zIndex={999}
    >
      <button onClick={handleClick}>
        {' '}
        <Image height="8vh" src={logo} alt="BaLance: Team Forming Dashboard" />
      </button>
    </Container>
  );
}

