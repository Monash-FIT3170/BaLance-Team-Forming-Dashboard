import {
    Box,
    Card,
    CardBody,
    CardHeader,
    Heading,
    Text,
    Center,
} from '@chakra-ui/react';
import { Doughnut, Bar } from 'react-chartjs-2';


const Plotter = ({item, index}) =>{

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

    return(
    <Center key={index}>
        <Box width="100%" maxWidth="800px" margin="20px">
            <Card padding="20px" border="1px">
                <CardHeader>
                    <Heading style={{ marginTop: '-20px' }}>
                        {item['personality title']}
                    </Heading>
                    <Text>{Object.values(item)[1]}</Text>
                </CardHeader>
                <CardBody>
                    {item.data.map((chartData, dataIndex) => (
                        
                        <div key={dataIndex}>
                            <h3
                                style={{
                                    marginTop: dataIndex === 0 ? '0' : '15px',
                                    marginBottom: '15px',
                                }}
                            >
                                {chartData.title}
                            </h3>
                            {chartData.x.length === 0 && (
                                <Text>No Data, Please Upload {item['personality title']} Data To See Visualisation</Text>
                            )}
                            {chartData.type === 'doughnut' && chartData.x.length !== 0 &&(
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
                            {chartData.type === 'bar' && chartData.x.length !== 0 &&(
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
    </Center>)

  }

  export default Plotter;