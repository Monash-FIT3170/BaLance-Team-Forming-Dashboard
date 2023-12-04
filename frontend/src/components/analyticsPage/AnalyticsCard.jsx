import {Box, Card, CardBody, CardHeader, Center, Heading, Text} from "@chakra-ui/react";
import {Bar, Doughnut} from "react-chartjs-2";
import React from "react";

const AnalyticsCard = ({personalityTypeData, index}) => {

    const generatePastelColors = (count) => {
        const colors = [];
        const baseHue = 200; // Start with a bluish hue
        const hueIncrement = 360 / count;

        for (let i = 0; i < count; i++) {
            const hue = (baseHue + i * hueIncrement) % 360;
            colors.push(`hsla(${hue}, 100%, 70%, 0.9)`);
        }

        return colors;
    };

    return (
        <Center key={index}>
            <Box width="100%" maxWidth="800px" margin="20px">
                <Card padding="20px" border="1px">
                    <CardHeader>
                        <Heading style={{ marginTop: '-20px' }}>
                            {personalityTypeData['personality title']}
                        </Heading>
                        <Text>{Object.values(personalityTypeData)[1]}</Text>
                    </CardHeader>
                    <CardBody>
                        {personalityTypeData.data.map((chartData, dataIndex) => (
                            <div key={dataIndex}>
                                <h3
                                    style={{
                                        marginTop: dataIndex === 0 ? '0' : '15px',
                                        marginBottom: '15px',
                                    }}
                                >
                                    {chartData.title}
                                </h3>
                                {chartData.type === 'doughnut' && (
                                    <Doughnut
                                        data={{
                                            labels: chartData.x || [],
                                            datasets: [
                                                {
                                                    data: chartData.y || [],
                                                    backgroundColor: generatePastelColors(
                                                        chartData.x.length
                                                    ),
                                                },
                                            ],
                                        }}
                                        options={{
                                            responsive: true,
                                            aspectRatio: 3.0,
                                        }}
                                    />
                                )}
                                {chartData.type === 'bar' && (
                                    <Bar
                                        data={{
                                            labels: chartData.x.map(String),
                                            datasets: [
                                                {
                                                    label: chartData['y label'],
                                                    data: chartData.y,
                                                    backgroundColor: generatePastelColors(
                                                        chartData.x.length
                                                    )[0], // Use the first color for bars
                                                },
                                            ],
                                        }}
                                        options={{
                                            responsive: true,
                                            aspectRatio: 1.5,
                                        }}
                                    />
                                )}
                                <br />
                            </div>
                        ))}
                    </CardBody>
                </Card>
            </Box>
        </Center>
    );
}

export default AnalyticsCard;