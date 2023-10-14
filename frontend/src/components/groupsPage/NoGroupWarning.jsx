import * as React from 'react';
import {
    Popover,
    PopoverTrigger,
    PopoverContent,
    PopoverArrow,
    PopoverCloseButton,
    PopoverBody,
    IconButton,
    Icon,
} from '@chakra-ui/react';
import { WarningIcon } from '@chakra-ui/icons';


export const NoGroupInfo = () => {
    return (
        <Popover placement='top-start' trigger='hover'>
            <PopoverTrigger>
                <WarningIcon
                    fontSize='20px'
                    color={'red'}
                />
            </PopoverTrigger>
            <PopoverContent width="15vw">
                <PopoverArrow />
                <PopoverCloseButton />
                <PopoverBody>This student is currently not assigned to a group!</PopoverBody>
            </PopoverContent>
        </Popover>
    )
}
