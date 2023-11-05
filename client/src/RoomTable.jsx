import React from 'react'
import { StyleSheet } from 'react-native'
import { useState, useEffect } from 'react';
function RoomTable() {
    var today = new Date();
    var finalHours;
    var finalMinutes;
    if (today.getHours() < 10) {
        finalHours = "0" + today.getHours().toString();
    }
    if (today.getMinutes() < 10) {
        finalMinutes = "0" + today.getMinutes().toString();
    }
    var time = finalHours + ":" + finalMinutes;
    var time = "11:15";
    console.log("Time: " + time);
    const [data, setPosts] = useState([]);
    const [resData, setPostsR] = useState([]);
    const [motData, setPostsM] = useState([]);


    var building;
    building = "ECSW"
    var fetchAddress = "http://localhost:4000/api/available/class/" + building + "/Tuesday";
    var resAddress = "http://localhost:4000/api/available/reserve/" + building + "/2023-11-04";

    useEffect(() => {
        fetch(fetchAddress, { method: "GET" })
            .then((response) => response.json())
            .then((data) => {
                console.log(data);
                setPosts(data);
            })
            .catch((err) => {
                console.log("Not working");
            });

        fetch(resAddress, { method: "GET" })
            .then((response) => response.json())
            .then((resData) => {
                console.log(resData);
                setPostsR(resData);
            })
            .catch((err) => {
                console.log("Not working");
            });

        fetch("http://localhost:4000/api/motion/ECSW", { method: "GET" })
            .then((response) => response.json())
            .then((motData) => {
                console.log("MOTION DATA")
                console.log(motData);
                setPostsM(motData);
            })
            .catch((err) => {
                console.log("Not working");
            });
    }, []);

    const classData = data;
    const reserveData = resData;
    const motionData = motData;
    let roomList = [];
    let classAvail = [];

    for (let i = 0; i < classData.length; i++) {
        if (!roomList.includes(classData[i].room)) {
            roomList.push(classData[i].room);
            let availStatus = (classData[i].startTime <= time && classData[i].endTime >= time) ? 1 : 0;
            classAvail.push({ room: classData[i].room, type: availStatus });
        }
        else {
            let replacedClassIndex = classAvail.findIndex(i => i.room == classData[i] && i.type == 0);
            if (replacedClassIndex != -1) {
                classAvail[replacedClassIndex].type = (classData[i].startTime <= time && classData[i].endTime >= time) ? 1 : 0;
            }
        }
    }

    for (let i = 0; i < reserveData.length; i++) {
        if (!roomList.includes(reserveData[i].room)) {
            roomList.push(reserveData[i].room);
            let availStatus = (reserveData[i].startTime <= time && reserveData[i].endTime >= time) ? 2 : 0;
            classAvail.push({ room: reserveData[i].room, type: availStatus });
        }
        else {
            let replacedClassIndex = classAvail.findIndex(i => i.room == reserveData[i] && i.type == 0);
            if (replacedClassIndex != -1) {
                classAvail[replacedClassIndex].type = (reserveData[i].startTime <= time && reserveData[i].endTime >= time) ? 1 : 0;
            }
        }
    }


    if (motionData[0] != null) {
        classAvail.push({ room: motionData[0].room, type: 3 })
    }
    else {
        classAvail.push({ room: "2.115", type: 0 })
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
            borderRadius: 150 / 2,
            backgroundColor: '#FFD300',
        },

        cell: {
            padding: "12px",
            // margin: 20
        }
    });

    const DisplayData = classAvail.map(
        (data) => {
            return (
                <tr >
                    <td style={styles.cell}>
                        {(data.type == 1) &&
                            <div style={styles.ClosedStatusCircle}></div>
                        }
                        {(data.type == 3) &&
                            <div style={styles.MotionStatusCircle}></div>
                        }
                        {(data.type == 0) &&
                            <div style={styles.OpenStatusCircle}></div>
                        }
                    </td>

                    <td style={styles.row}>{data.room}</td>
                    <td style={styles.row}>{building}</td>
                    <td style={styles.row}>
                        {(data.type == 1) &&
                            "Class"
                        }
                        {(data.type == 3) &&
                            "Motion Detected"
                        }
                    </td>
                </tr>
            )
        }
    )

    return (
        <div>
            <table class="table table-striped" >
                <thead>
                    <tr style={{ margin: "30px" }}>
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