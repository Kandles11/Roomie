import logo from './logo.svg';
import './App.css';
import React, { StyleSheet, View } from 'react-native'
import Table from "react-table";

import ReactDOM from 'react-dom/client';
import { useState } from 'react';


// logo
// Newly Opened
// opened boxes
// search for room
// sort by
// table of values

function App() {
  const [data, setData] = useState([
    {
      status: true,
      room: "1.130",
      building: "ECSW",
    }
  ]);
  const open = [true];
  return (
    <div className="App">
      <Table>
        data = {data}
        columns = {[
          {
            dataField: "room",
            label: "Room #"
          },
          
        ]}
      </Table>
      <table>
        <tr>
          <th>Status</th>
          <th>Room #</th>
          <th>Building</th>
        </tr>
        <tr>
          <th>
            {open[0] == true &&
              <div style = {styles.OpenStatusCircle}></div>
            }
            {open[0] == false &&
              <div style = {styles.ClosedStatusCircle}></div>
            }
          </th>
          <th style = {{textAlign: 'left'}}>1.355</th>
          <th style = {{textAlign: 'left'}}>ECSW</th>
        </tr>
      </table>
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