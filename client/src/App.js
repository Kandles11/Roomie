import logo from './roomie_logo.svg';
import './App.css';
import React, { StyleSheet, View } from 'react-native'
import { Table } from 'react-table';

import ReactDOM from 'react-dom/client';
import { useState, useEffect, useMemo } from 'react';

import JsonDataDisplay from './RoomTable'

function App() {
  const [data, setPosts] = useState([]);
  
  useEffect(() => {
    fetch('http://localhost:4000/api/available/class/ECSW/Tuesday', {method: "GET"})
       .then((response) => response.json())
       .then((data) => {
          console.log(data);
          setPosts(data);
       })
       .catch((err) => {
          console.log("Not working");
       });
 }, []);

  

  return (
      <div className="App">
          <img src={logo} style={{
            height: 200,
          }}/>
          <div>{data ? <pre>{JSON.stringify(data, null, 2)}</pre> : 'Loading...'}</div>
          <input type = 'text' name = 'buildingSearch' value = 'Search for a building'/>
          <JsonDataDisplay />
      </div>
  );
}

const styles = StyleSheet.create({

  OpenStatusCircle: {
    width: 10,
    height: 10,
    borderRadius: 150 / 2,
    backgroundColor: '#3A9567',
  },

  ClosedStatusCircle: {
    width: 10,
    height: 10,
    borderRadius: 150 / 2,
    backgroundColor: '#D33834',
  }
});

export default App;