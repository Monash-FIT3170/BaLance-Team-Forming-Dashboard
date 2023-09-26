import React, { useState } from 'react';
import {
	Box,
	Text,
	Button,
	Center,
	Alert,
	AlertIcon,
	FormControl,
	HStack,
	Spacer,
	FormLabel,
	NumberInput,
	NumberInputField,
	NumberDecrementStepper,
	NumberIncrementStepper,
	FormHelperText,
	Divider,
	VStack,
	NumberInputStepper
} from '@chakra-ui/react';
import { ArrowForwardIcon, ArrowBackIcon } from '@chakra-ui/icons';
import { useParams } from 'react-router-dom';
import { useNavigate, useLocation } from 'react-router-dom';
import { MockAuth } from '../helpers/mockAuth';
import { useAuth0 } from '@auth0/auth0-react';
import PyInfoButton from '../components/uploadScriptPage/PyInfoButton';
import UploadPy from '../components/uploadScriptPage/UploadPy';

function UploadGroupScript() {
	let authService = {
        "DEV": MockAuth,
        "TEST": useAuth0
    }
	const { getAccessTokenSilently } = authService[process.env.REACT_APP_AUTH]();
	const [ scriptContent, setScriptContent ] = useState('');
	const [ pyFile, setPyFile ] = useState(null);
	const { unitCode, year, period } = useParams();
	const navigate = useNavigate();
  	const location = useLocation();

// Extract groupDetails or set it to default values
const groupDetails = location.state?.groupDetails || { groupSize: 2, variance: 1 };

// Destructure groupSize and variance from groupDetails
const { groupSize: initialGroupSize, variance: initialVariance } = groupDetails;

// Use the initial values in useState
const [groupSize, setGroupSize] = useState(initialGroupSize);
const [variance, setVariance] = useState(initialVariance);


	const handleUpload = (e) => {
		e.preventDefault();
		const uploadedFile = e.target.files[0];
		setPyFile(uploadedFile);

		// Read the content of the file
		const reader = new FileReader();
		reader.onload = (event) => {
			setScriptContent(event.target.result);
		};
		reader.readAsText(uploadedFile);
	};

	const handleSubmit = async () => {
		if (pyFile) {
			// Read the file content
			const reader = new FileReader();
			reader.readAsText(pyFile);
			reader.onload = async (event) => {
				const scriptContent = event.target.result;
				console.log(scriptContent);
	
				getAccessTokenSilently().then((token) => {
					fetch(`http://localhost:8080/api/groups/${unitCode}/${year}/${period}/uploadScript`, {
						method: 'POST',
						headers: new Headers({
							'Authorization': `Bearer ${token}`,
							'Accept': 'application/json',
							'Content-Type': 'application/json'
						}),
						body: JSON.stringify({ scriptContent }),
					})
					.then(response => {
						if (response.ok) {
							console.log('Script executed successfully.');
							navigateToOfferingDashboard();
						} else {
							return response.text().then(responseText => {
								console.error('Error executing the script:', responseText);
								alert(responseText);
							});
						}
					})
					.catch(error => {
						console.error('Error executing the script:', error);
						// Optionally show an error message to the user.
					});
				});
			};
		} else {
			console.log('No file selected.');
		}
	};
	
	

	const navigateToCreateGroupsDashboard = () => {
		navigate(`/createGroups/${unitCode}/${year}/${period}`);
	};

	const navigateToOfferingDashboard = () => {
        navigate(`/groups/${unitCode}/${year}/${period}`);
    };

	return (
		<Box padding="4">
			<Button onClick={navigateToCreateGroupsDashboard}>
				<ArrowBackIcon />
				Return to Create Groups Page
			</Button>
			<Center>
				<Box width="80%">
					<Text fontSize="2xl" fontWeight="bold" textAlign="center" mb={4}>
						Upload Group Script to: {`${unitCode} - ${period} ${year}, **CAMPUS**`}
					</Text>

					{/* UI for Group Size Selection */}
					<FormControl isRequired>
						<HStack w="100%">
							<Box fontSize="19" w="40vw">
								<Text fontWeight="semibold">Step 2: Select an ideal group size</Text>
								<Text>Choose the ideal size for each group.</Text>
								<Text>
									Note: it is possible that not all of the groups are the ideal size, depending on the
									number of students in the offering.
								</Text>
							</Box>
							<Spacer />
							<VStack>
								<FormLabel>Group Size</FormLabel>
								<NumberInput
									w="12vw"
									min="2"
									value={groupSize}
									onChange={(valueString) => setGroupSize(parseInt(valueString))}
								>
									<NumberInputField />
									<NumberInputStepper>
										<NumberIncrementStepper />
										<NumberDecrementStepper />
									</NumberInputStepper>
								</NumberInput>
								<FormHelperText>Minimum group size is 2</FormHelperText>
							</VStack>
						</HStack>

						<Divider marginY="1vh" />

						{/* UI for Variance Selection */}
						<HStack w="100%">
							<Box fontSize="19" w="40vw">
								<Text fontWeight="semibold">Step 3: Select a variance value (recommended 1)</Text>
								<Text>Choose how big or small you would like the variance in group size to be.</Text>
								<Text>We recommend this value to be 1.</Text>
							</Box>
							<Spacer />
							<VStack>
								<FormLabel>Variance</FormLabel>
								<NumberInput
									w="12vw"
									min="1"
									value={variance}
									onChange={(valueString) => setVariance(parseInt(valueString))}
								>
									<NumberInputField />
									<NumberInputStepper>
										<NumberIncrementStepper />
										<NumberDecrementStepper />
									</NumberInputStepper>
								</NumberInput>
								<FormHelperText>Minimum variance is 1</FormHelperText>
							</VStack>
						</HStack>
					</FormControl>

					<Divider marginY="1vh" />

					<Center>
						<Alert status="info" borderRadius="md">
							<AlertIcon />
							<Text>
								Please upload a Python script (.py) that will be used for custom group formation. Make
								sure the script adheres to the following requirements:
								<Center>
									<ul>
										<li>The script should be written in Python.</li>
										<li>The main function or processing logic should be encapsulated under if __name__ == "__main__":.</li>
										<li>The script should accept input in JSON format as a command-line argument. (This will contain the student data.)</li>
										<li>The script should output results in JSON format to stdout.</li>
										<li>Avoid using external libraries.</li>
									</ul>
								</Center>
							</Text>
						</Alert>
					</Center>
					<Center>
						<UploadPy pyFile={pyFile} handleUpload={handleUpload}/>
					</Center>
          {scriptContent && (
          <>
            <h3>Script Preview:</h3>
            <pre>{scriptContent}</pre>
          </>
          )}
					{pyFile && (
						<Button mt={4} colorScheme="green" leftIcon={<ArrowForwardIcon />} onClick={handleSubmit}>
							Upload Script
						</Button>
					)}
				</Box>
			</Center>
		</Box>
	);
}

export default UploadGroupScript;
