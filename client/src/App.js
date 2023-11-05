import logo from './logo.svg';
import './App.css';
import React, { StyleSheet, View } from 'react-native'

// logo
// Newly Opened
// opened boxes
// search for room
// sort by
// table of values

function App() {

  return (
    <div className="App">
      <table>
        <tr>
          <th>Status</th>
          <th>Room #</th>
          <th>Building</th>
        </tr>
        <tr>
          <th>
            <div style = {styles.ClosedStatusCircle}></div>
          </th>
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
