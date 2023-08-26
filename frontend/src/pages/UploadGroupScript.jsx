import React, { useState, useEffect } from 'react';
import {
	Box,
	Text,
	Flex,
	IconButton,
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
import PyInfoButton from '../components/PyInfoButton'; // Import your PyInfoButton component
import UploadPy from '../components/UploadPy'; // Import your UploadPy component
import { useNavigate, useLocation } from 'react-router-dom'; // Import the useNavigate hook

function UploadGroupScript() {
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
		// Handle the file submission here, e.g., send it to the server
		if (pyFile) {
			const formData = new FormData();
			formData.append('pythonFile', pyFile); // Changed to 'pythonFile' here

			try {
				const response = await fetch(
					`http://localhost:8080/api/groups/${unitCode}/${year}/${period}/uploadScript`,
					{
						method: 'POST',
						body: formData
						// Note: fetch, by default, detects the form data and sets the correct content type
					}
				);

				if (response.ok) {
					console.log('File uploaded successfully.');
					// Optionally navigate the user to another page or show a success message.
				} else {
					console.error('Error uploading the script:', await response.text());
					// Optionally show an error message to the user.
				}
			} catch (error) {
				console.error('Error uploading the script:', error);
				// Optionally show an error message to the user.
			}
		} else {
			console.log('No file uploaded.');
		}
	};

	const navigateToOfferingDashboard = () => {
		navigate(`/createGroups/${unitCode}/${year}/${period}`);
	};

	return (
		<Box padding="4">
			<Button onClick={navigateToOfferingDashboard}>
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
								sure the script adheres to the requirements.
							</Text>
						</Alert>
					</Center>
					<PyInfoButton
						infoHeader=".py file format"
						infoText="Accepted .py files should contain the necessary script for custom group formation."
					/>
					<Center>
						<UploadPy pyFile={pyFile} handleUpload={handleUpload} />
					</Center>
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
