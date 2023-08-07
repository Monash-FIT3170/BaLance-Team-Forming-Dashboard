import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router';
import {
  Table,
  Thead,
  Select,
  Tr,
  Th,
  Tbody,
  Button,
  ButtonGroup,
  HStack,
  Spacer,
  Heading,
  Center,
  useDisclosure,
  Text,
  VStack,
  Box,
} from '@chakra-ui/react';
import StudentRowStudentDisplay from '../components/StudentRowStudentDisplay';
import { Link, useNavigate } from 'react-router-dom';
import { ShuffleGroups } from '../components/ShuffleGroups';
import { AddIcon, EditIcon } from '@chakra-ui/icons';

function BelbinImporter(){

    return(
        <div>
            Here
        </div>

    )
}

export default BelbinImporter;