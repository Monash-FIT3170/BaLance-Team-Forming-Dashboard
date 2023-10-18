import * as React from 'react';
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
import { QuestionOutlineIcon } from '@chakra-ui/icons';


export const CsvInfoButton = ({infoHeader, infoText}) => {
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
