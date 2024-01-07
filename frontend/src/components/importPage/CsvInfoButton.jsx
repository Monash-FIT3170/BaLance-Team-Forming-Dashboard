import { QuestionOutlineIcon } from '@chakra-ui/icons';
import {
    Popover,
    PopoverTrigger,
    PopoverContent,
    PopoverArrow,
    PopoverCloseButton,
    PopoverHeader,
    PopoverBody,
    IconButton,
} from '@chakra-ui/react';


const CsvInfoButton = ({infoHeader, infoText}) => {
    return (
        <Popover placement='top-start' trigger='hover'>
            <PopoverTrigger>
                <IconButton
                    isRound={true}
                    variant='ghost'
                    aria-label='Done'
                    fontSize='20px'
                    icon={<QuestionOutlineIcon />}
                />
            </PopoverTrigger>
            <PopoverContent width="30vw">
                <PopoverArrow />
                <PopoverCloseButton />
                <PopoverHeader>{infoHeader}</PopoverHeader>
                <PopoverBody>{infoText}</PopoverBody>
            </PopoverContent>
        </Popover>
    )
}

export default CsvInfoButton;