import React, { useState } from 'react';
import { FormLabel, VStack } from '@chakra-ui/react';
import Dropdown from './Dropdown';
import InputNumber from './InputNumber';

const MultipleDropdown = ({labelText}) => {
    // these two need to start the same 
    const [projectCount, setProjectCount] = useState(5); 
    const [options, setOptions] = useState([1,2,3,4,5]);
    const [preference, setPreference] = useState([1,1,1,1,1]);


    // This is for changing the number of projects 
    const changeProjectCount = (event) => {
        setProjectCount(parseInt(event));
        
        console.log("Project count: " + projectCount + "\n");
        console.log("event: " +event+"\n");

        let numbers = [];
        let pref = new Array(parseInt(event)).fill(1);

        for (let i = 1; i <= parseInt(event); i++) {
            numbers.push(i);
            if (i < preference.length){
                pref[i-1] = preference[i-1];
            }
        }
        setPreference(pref);
        setOptions(numbers);
        return;
    }

    const addPreference = (event, option) => {
        let temp = preference;
        temp[option - 1] = parseInt(event.target.value);
        setPreference(temp);
        console.log("Preferences: " + preference);
    }

    
    return (
        <div>
            <InputNumber 
                label="Number of Projects"
                defaultValue={5}
                min={1}
                value={projectCount}
                onChange={(event) => { changeProjectCount(event);}}
            />
            {options.map((option) => {
                return (
                    <div>
                        <FormLabel>{labelText} {option}</FormLabel>
                        <Dropdown 
                        placeholder={''}
                        options={options}
                        onChange={(event) => { addPreference(event, option);}}
                        />
                    </div>
                )
                
            })}
        </div>
    )
    
}

export default MultipleDropdown;

{/* <FormLabel>Preference for project 1</FormLabel>
<Dropdown 
    placeholder={'select'}
    required={true}
    options={options}
    onChange={(event) => { setPreferenceID(event.target.value);}}
/> */}