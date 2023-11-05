import React from 'react'
import { StyleSheet } from 'react-native'
import { useState, useEffect } from 'react';
function RoomTable(){
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
    building = "ECSW"
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

    const classData = data;
    let roomList = [];
    let classAvail = [];

    for (let i = 0; i < classData.length; i++)
    {
        if (!roomList.includes(classData[i].room))
        {
            roomList.push(classData[i].room);
            let availStatus = (classData[i].startTime <= time && classData[i].endTime >= time) ? 1 : 0;
            classAvail.push({room: classData[i].room, type: availStatus});
        }
        else
        {
            let replacedClassIndex = classAvail.findIndex(i => i.room == classData[i] && i.type == 0);
            if (replacedClassIndex != -1)
            {
                classAvail[replacedClassIndex].type = (classData[i].startTime <= time && classData[i].endTime >= time) ? 1 : 0;
            } 
        }
    }

    console.log(classAvail);











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
        },

        MotionStatusCircle: {
            width: 10,
            height: 10,
            borderRadius: 150/2,
            backgroundColor: '#FAFD3A',
        }
      });

    const DisplayData=classAvail.map(
        (data)=>{
            return(
                <tr>
                    <td>
                        {(data.type == 1) &&
                            <div style = {styles.ClosedStatusCircle}></div>
                        }
                        {(data.type == 0) &&
                            <div style = {styles.OpenStatusCircle}></div>
                        }
                    </td>
                    
                    <td>{data.room}</td>
                    <td>{building}</td>
                    <td>
                        {(data.type == 1) &&
                            "Class"
                        }
                    </td>
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
                    <th>Details</th>
                    </tr>
                </thead>
                <tbody>
                
                    {DisplayData}
                    
                </tbody>
            </table>
             
        </div>
    )
}
 
export default RoomTable;