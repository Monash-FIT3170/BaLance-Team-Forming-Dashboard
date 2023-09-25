import React from 'react';
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

const PyInfoButton = ({ infoHeader, infoText }) => {
  return (
    <Popover placement='top-start'>
      <PopoverTrigger>
        <IconButton
          isRound={true}
          variant='ghost'
          aria-label='Info'
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
  );
};

export default PyInfoButton;
