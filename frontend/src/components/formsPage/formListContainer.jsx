import { 
    Tr,
    Td,
    Button,
} from '@chakra-ui/react';
import { CloseIcon, EmailIcon } from "@chakra-ui/icons";

const FormListContainer = ({ forms }) => { 
    return (forms.map((form) => (
        <Tr key={form.id}>
            <Td>{form.type}</Td>
            <Td>{form.url}</Td>
            <Td>
                <Button onClick={() => handleCopy(form.url)}>
                    Copy Link
                </Button>
            </Td>
            <Td>
                <Button
                    leftIcon={<EmailIcon />}
                    onClick={() => {
                        const confirmed = window.confirm("This will email the form link to ALL students in this unit. Do you wish to continue?");
                        if (confirmed) {
                            sendForms(form.url);
                        }
                    }}>
                    Email to All Students
                </Button>
            </Td>
            <Td>
                <Button
                    leftIcon={<CloseIcon />}
                    onClick={() => {
                        const confirmed = window.confirm("This will close the associated google form, no responses will be accepted after. Do you wish to continue?");
                        if (confirmed) {
                            closeForms(form.id, form.type);
                        }
                    }}>
                    Close Form
                </Button>
            </Td>
        </Tr>
    )))
}


export default FormListContainer;