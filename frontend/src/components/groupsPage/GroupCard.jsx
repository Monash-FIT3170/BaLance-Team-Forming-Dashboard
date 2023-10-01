import { Spacer, HStack, VStack, Box } from '@chakra-ui/react';
import { ViewIcon } from "@chakra-ui/icons";
import { useParams } from 'react-router';
import StudentsPreviewTable from "../shared/StudentsPreviewTable";
import NavButton from "../shared/NavButton";
import PageHeader from "../shared/PageHeader";

const GroupCard = ({groupData, numberOfGroups}) => {
    const {
        lab_number,
        group_number,
        students
    } = groupData;

    const {
        unitCode,
        year,
        period
    } = useParams();

    return (
        <Box
            border="1px"
            marginTop="20px"
            marginBottom="20px"
            borderRadius={'8px'}
            boxShadow="0 2px 4px rgba(0, 0, 0, 0.1)"
            overflowX="auto"
        >
            <VStack>
                <HStack justifyContent="space-between" width="90%">
                    <PageHeader
                        fontSize="4xl"
                        pageDesc={`Lab: ${lab_number}, Group ${group_number}`}
                    />
                    <Spacer/>
                    <NavButton
                        buttonText="View group analytics"
                        buttonIcon={<ViewIcon/>}
                        buttonUrl={`/groupAnalytics/${unitCode}/${year}/${period}/${lab_number}/${group_number}`}
                    />
                </HStack>
                <Spacer/>
                <Box marginBottom={'10px'}>
                    <StudentsPreviewTable
                        students={students}
                        page={'groups'}
                        rowHeights={'50px'}
                    />
                </Box>
            </VStack>
        </Box>
    );
};

export default GroupCard;
