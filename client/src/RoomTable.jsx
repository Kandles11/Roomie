
import React from 'react'
import { StyleSheet } from 'react-native'
function JsonDataDisplay(){
    const JsonData = [
        {
            "status": true,
            "room": 1.345,
            "building": "ECSW"
        },
        {
            "status": false,
            "room": 1.564,
            "building": "UTD"
        }
    ];
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
    const DisplayData=JsonData.map(
        (data)=>{
            return(
                <tr>
                    {data.status == true &&
                        <div style = {styles.OpenStatusCircle}></div>
                    }
                    {data.status == false &&
                        <div style = {styles.ClosedStatusCircle}></div>
                    }
                    <td>{data.room}</td>
                    <td>{data.building}</td>
                </tr>
            )
        }
    )
 
    return(
        <div>
            <table class="table table-striped">
                <thead>
                    <tr>
                    <th>Status</th>
                    <th>Room #</th>
                    <th>Building</th>
                    </tr>
                </thead>
                <tbody>
                 
                    
                    {DisplayData}
                    
                </tbody>
            </table>
             
        </div>
    )
 }
 
 export default JsonDataDisplay;