import { Text } from '@chakra-ui/react';
import { Doughnut, Bar } from 'react-chartjs-2';

const AnalyticsGraphPlotter = ({data}) => {

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

    const generateDoughnutChart = () => {
        return (
            <Doughnut
                data={{
                    labels: data['x'],
                    datasets: [{
                        label: data['y label'],
                        data: data['y'],
                        backgroundColor: generatePastelColors(data['x'].length),
                    }]
                }}

                options={{
                    responsive: true,
                    aspectRatio: 3.0,
                }}
            />
        )
    }

    const generateBarChart = () => {
        return (
            <Bar
                data={{
                    labels: data['x'].map(String),
                    datasets: [{
                        label: data['y label'],
                        data: data['y'],
                        backgroundColor: generatePastelColors(data['x'].length)
                    }]
                }}

                options={{
                    responsive: true,
                    aspectRatio: 1.5,
                }}
            />
        )
    }

    return(
        <div>
            <Text fontSize={'2xl'} fontWeight="bold">
                {data['title']}
            </Text>

            {data['type'] === 'doughnut' && (
                generateDoughnutChart()
            )}

            {data['type'] === 'bar' && (
                generateBarChart()
            )}
            <br />
        </div>
    )
}

export default AnalyticsGraphPlotter;