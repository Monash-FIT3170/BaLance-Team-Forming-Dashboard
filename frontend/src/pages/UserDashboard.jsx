import { useAuth0 } from "@auth0/auth0-react";
import { EmailIcon } from "@chakra-ui/icons";
import { Badge, Box, Container, HStack, Heading, Image, VStack,Text } from "@chakra-ui/react";
import React from "react";

const UserDashboard = () => {
  const { user, isAuthenticated, isLoading } = useAuth0();

  if (isLoading) {
    return <div>Loading ...</div>;
  }

  return (
    isAuthenticated && (
      <Container maxW="container.md" py={10}>
      <Box bg={"white"} p={6} borderRadius="lg" boxShadow="md">
        <VStack spacing={6} align="center">
          <Image
            borderRadius="full"
            boxSize="150px"
            src={user.picture}
            alt={user.name}
            border="4px solid"
            borderColor="blue.400"
          />
          <VStack spacing={2} textAlign="center">
            <Heading as="h2" size="xl" color={"black"}>
              {user.name}
            </Heading>
            <Badge colorScheme="blue" fontSize="md">
              {user.nickname || "User"}
            </Badge>
          </VStack>
          <HStack>
            <EmailIcon color="blue.500" />
            <Text color={"black"}>{user.email}</Text>
          </HStack>
          {user.email_verified && (
            <Badge colorScheme="green">Email Verified</Badge>
          )}
        </VStack>
      </Box>
    </Container>
    )
  );
};

export default UserDashboard;