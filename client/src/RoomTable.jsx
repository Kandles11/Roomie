import React from 'react'
import { StyleSheet } from 'react-native'
import { useState, useEffect } from 'react';
function JsonDataDisplay(){
    var today = new Date();
    var finalHours;
    var finalMinutes;
    if (today.getHours() < 10){
        finalHours = "0" + today.getHours().toString();
    }
    if (today.getMinutes() < 10){
        finalMinutes = "0" + today.getMinutes().toString();
    }
    var time = finalHours + ":" + finalMinutes;
    var time = "10:45";
    console.log("Time: " + time);
    const [data, setPosts] = useState([]);
    
    var building;
    building = "HH"
    var fetchAddress = "http://localhost:4000/api/available/class/" + building + "/Tuesday";

    useEffect(() => {
        fetch(fetchAddress, {method: "GET"})
        .then((response) => response.json())
        .then((data) => {
            console.log(data);
            setPosts(data);
        })
        .catch((err) => {
            console.log("Not working");
        });
    }, []);

    const JsonData = data;
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
                    <td>
                    {(data.startTime <= time && data.endTime >= time) &&
                        <div style = {styles.ClosedStatusCircle}></div>
                    }
                    {(data.startTime > time || data.endTime < time) &&
                        <div style = {styles.OpenStatusCircle}></div>
                    }
                    
                    </td>
                    
                    <td>{data.room}</td>
                    <td>{building}</td>
                </tr>
            )
        }
    )

    //<div>{data ? <pre>{JSON.stringify(data, null, 2)}</pre> : 'Loading...'}</div>
    //<div style = {styles.ClosedStatusCircle}></div>

    /*
    {data.status == true &&
                        <div style = {styles.OpenStatusCircle}></div>
                    }
                    {data.status == false &&
                        <div style = {styles.ClosedStatusCircle}></div>
                    }
                    <td>{data.room}</td>
                    <td>{data.building}</td>
                    */
 
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