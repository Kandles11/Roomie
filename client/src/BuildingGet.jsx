import React from 'react'
import { StyleSheet } from 'react-native'
import { useState, useEffect } from 'react';
import Dropdown from "react-dropdown";


function BuildingGet(){
    const [value, setValue] = useState("");
    return (
        <div>
            <Dropdown
                options={["Option 1", "Option 2", "Option 3"]}
                value={value}
                onChange={setValue}
            />
        </div>
    );
    
}

export default BuildingGet;