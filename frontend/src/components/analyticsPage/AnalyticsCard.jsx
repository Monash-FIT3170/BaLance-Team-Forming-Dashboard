import {
    Box,
    Card,
    CardBody,
    CardHeader,
    Center,
    Heading,
    Text
} from "@chakra-ui/react";

import AnalyticsGraphPlotter from "./AnalyticsGraphPlotter";

const AnalyticsCard = ({personalityTypeData}) => {
    const generateGraphs = () => {
        if (personalityTypeData['data'].length === 0) {
            return (
                <Center>
                    <Box bg='#E6EBF0' w='300px' p={4} alignContent="left">
                        <Center>
                            No data for {personalityTypeData['personality title']} has been uploaded.
                        </Center>
                    </Box>
                </Center>
            )
        }

        return personalityTypeData['data'].map((data) =>
            <AnalyticsGraphPlotter
                data={data}
            />
        )
    }

    return (
        <Center>
            <Box width="100%" maxWidth="800px" margin="20px">
                <Card padding="20px" border="1px">
                    <CardHeader>
                        <Heading style={{ marginTop: '-20px' }}>
                            {personalityTypeData['personality title']}
                        </Heading>
                        <br/>
                        <Text>{personalityTypeData['description']}</Text>
                    </CardHeader>

                    <CardBody>
                        {generateGraphs()}
                    </CardBody>
                </Card>
            </Box>
        </Center>
    );
}

export default AnalyticsCard;