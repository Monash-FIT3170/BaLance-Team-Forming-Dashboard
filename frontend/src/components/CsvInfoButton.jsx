import * as React from 'react';
import {
    Box, Text, Flex, Button, Input, Icon, HStack, Popover,
    PopoverTrigger,
    PopoverContent,
    PopoverArrow,
    PopoverCloseButton,
    PopoverHeader,
    PopoverBody,
    IconButton,
} from '@chakra-ui/react';
import { FiUploadCloud } from 'react-icons/fi';
import { QuestionOutlineIcon } from '@chakra-ui/icons';


export const CsvInfoButton = ({infoHeader, infoText}) => {
    return (
        <Popover placement='top-start'>
            <PopoverTrigger>
                <IconButton
                    isRound={true}
                    variant='ghost'
                    aria-label='Done'
                    fontSize='20px'
                    icon={<QuestionOutlineIcon />}
                />
            </PopoverTrigger>
            <PopoverContent>
                <PopoverArrow />
                <PopoverCloseButton />
                <PopoverHeader>{infoHeader}</PopoverHeader>
                <PopoverBody>{infoText}</PopoverBody>
            </PopoverContent>
        </Popover>
    )
}
