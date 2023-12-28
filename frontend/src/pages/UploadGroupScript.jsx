import { useState } from 'react';
import { ArrowForwardIcon, ArrowBackIcon } from '@chakra-ui/icons';
import { useParams } from 'react-router-dom';
import { useNavigate, useLocation } from 'react-router-dom';
import { MockAuth } from '../helpers/mockAuth';
import { useAuth0 } from '@auth0/auth0-react';
import {
	Box,
	Text,
	Button,
	Alert,
	AlertIcon,
	VStack
} from '@chakra-ui/react';

import UploadPy from '../components/uploadScriptPage/UploadPy';
import PageHeader from "../components/_shared/PageHeader";
import NavButton from "../components/_shared/NavButton";
import ToggleButtonGroup from "../components/_shared/ToggleButtonGroup";

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

	const navigateToOfferingDashboard = () => {
        navigate(`/groups/${unitCode}/${year}/${period}`);
    };

	return (
		<Box>
			<PageHeader
				fontSize={"2xl"}
				pageDesc={`Configure groups: ${unitCode} ${period} ${year}`}
			/>

			<VStack>
				<NavButton
					buttonIcon={<ArrowBackIcon />}
					buttonText="Return to offering dashboard"
					buttonUrl={`/students/${unitCode}/${year}/${period}`}
				/>
				<Box h='1em'/>
				<ToggleButtonGroup
					leftButtonIsDisabled={false}
					leftButtonUrl={`/createGroups/${unitCode}/${year}/${period}`}
					leftButtonText='in-built strats'
					rightButtonIsDisabled={true}
					rightButtonUrl={`/uploadGroupScript/${unitCode}/${year}/${period}`}
					rightButtonText='custom scripts'
				/>
				<Box h='1em'/>
				<Alert w='25em' status="info" borderRadius="md">
					<AlertIcon />
					<Text>
						Please upload a Python script (.py) that will be used for custom group formation
					</Text>
				</Alert>
				<Box w='25em' pt='1em'>
					<UploadPy pyFile={pyFile} handleUpload={handleUpload}/>
				</Box>
			</VStack>

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
	);
}

export default UploadGroupScript;
