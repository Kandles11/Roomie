import logo from './roomie_logo.svg';
import './App.css';
import React, { StyleSheet } from 'react-native'

import RoomTable from './RoomTable'
import Options from './Options';
import SearchBar from './SearchBar';

function App() {
  return (
      <div className="App">
          <img src={logo} style={{
            height: 200,
          }}/>
          
          <SearchBar />
          
          <RoomTable />
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