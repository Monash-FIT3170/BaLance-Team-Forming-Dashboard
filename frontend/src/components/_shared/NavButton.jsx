import {
    Button,
    HStack,
    Link,
    Spacer,
    Text
} from "@chakra-ui/react";

const NavButton = ({ buttonIcon, buttonText, buttonUrl, onClick }) => {
    return(
        <Link href={buttonUrl}>
            <Button>{/*<Button onClick={buttonUrl ? navigateToUrl : onClick}>*/}
                <HStack>
                    {buttonIcon}
                    <Spacer />
                    <Text>{buttonText}</Text>
                </HStack>
            </Button>
        </Link>

    );
}

export default NavButton;
