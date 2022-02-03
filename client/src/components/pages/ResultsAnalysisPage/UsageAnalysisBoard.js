import React, { useContext } from "react";
import { Paper, Typography } from "@material-ui/core";
import { Line } from 'react-chartjs-2';
import useWindowDimensions from "../../../customHooks/useWindowDimensions";

import { EditContext } from "../../contexts/EditContext";


const dateToday = new Date();

const myDate = {
    day: dateToday.getDate(),
    month: dateToday.getMonth()+1,
    year: dateToday.getFullYear()
}

const monthNbOfDays = {
    1: 31,
    2: ((myDate.year%4 === 0) && (myDate.year%100 !== 0)) || (myDate.year%400 === 0)? 29: 28,
    3: 31,
    4: 30,
    5: 31,
    6: 30,
    7: 31,
    8: 31,
    9: 30,
    10: 31,
    11: 30,
    12: 31
}

export function UsageAnalysisBoard(props) {

    const { width } = useWindowDimensions();
    const { userResponsesScoresAndReco } = useContext(EditContext);

    const userActivityDates = userResponsesScoresAndReco.map(userResponse => {
        return [].concat.apply([],[[userResponse.createdAt], userResponse.lastModified])
    })
    const mergedUserActivityDates = [].concat.apply([],userActivityDates);


    const monthBeforeMyDateMonth = (myDate.month === 1)? 12: myDate.month-1;
    const initialDate = (myDate.day-28 <= 0)? 1+monthNbOfDays[monthBeforeMyDateMonth]-(28-myDate.day): myDate.day-28;
    const labels = [];
    if (myDate.day-28 <= 0) {
        for (var i=initialDate; i<=monthNbOfDays[myDate.month-1]; i++) {
            var day = i<10? "0"+i: i;
            var month = myDate.month-1<10? "0"+(myDate.month-1): myDate.month-1;
            labels.push(day+"/"+month);
        }
        for (var i=1; i<=myDate.day; i++) {
            var day = i<10? "0"+i: i;
            var month = myDate.month<10? "0"+myDate.month: myDate.month;
            labels.push(day+"/"+month);
        }
    } else if (myDate.day-28 > 0) {
        for (var i=initialDate; i<=myDate.day; i++) {
            var day = i<10? "0"+i: i;
            var month = myDate.month<10? "0"+myDate.month: myDate.month;
            labels.push(day+"/"+month);
        }        
    }

    if (myDate.day-28 > 0) {
        const userActivity = mergedUserActivityDates.filter(userRecord => {
            const recordDate = {
                day: parseInt(userRecord.substring(8,10)),
                month: parseInt(userRecord.substring(5,7)),
                year: parseInt(userRecord.substring(0,4))
            }
            if ((recordDate.month === myDate.month) && (recordDate.day > initialDate)) {
                return true
            } else {
                return false
            }
        })
        var data = new Array(28).fill(0);
        for (var userRecord of userActivity) {
            const recordDay = parseInt(userRecord.substring(8,10));
            data[28-(myDate.day-recordDay)-1] += 1;
        }
    } else {
        const userActivity = mergedUserActivityDates.filter(userRecord => {
            const recordDate = {
                day: parseInt(userRecord.substring(8,10)),
                month: parseInt(userRecord.substring(5,7)),
                year: parseInt(userRecord.substring(0,4))
            }
            if (((recordDate.month === myDate.month) && (recordDate.day > 0)) || ((recordDate.month === myDate.month-1) && (recordDate.day >= initialDate))) {
                return true
            } else {
                return false
            }
        })
        var data = new Array(28).fill(0);
        for (var userRecord of userActivity) {
            const recordDay = parseInt(userRecord.substring(8,10));
            const recordMonth = parseInt(userRecord.substring(5,7));
            if (recordMonth === myDate.month) {
                data[28-(myDate.day-recordDay)-1] += 1;
            } else if (recordMonth === myDate.month-1) {
                data[recordDay-initialDate] += 1;
            }
        }
    }

    const dataForChart = {
        labels: labels,
        datasets: [
          {
            label: 'Activité des utilisateurs',
            backgroundColor: 'rgba(213,213,213,0.5)',
            borderColor: 'rgb(144, 208, 88)',
            pointBackgroundColor: 'rgba(179,181,198,1)',
            pointBorderColor: '#fff',
            pointHoverBackgroundColor: '#fff',
            pointHoverBorderColor: 'rgba(179,181,198,1)',
            data: data
          },
        ]
    };

    return (
        <Paper elevation={5} style={{width:"100%", padding:"30px"}}>
            <Typography component="h4" variant="h4">
                Activité des utilisateurs
            </Typography>
            <br/>
            <br/>
            
            <div style={{margin:"auto"}}>

                <Line
                    width={width<600?width-width/3:undefined}
                    height={275}
                    data={dataForChart}
                    options={{ 
                        legend: {
                            display: false
                        },
                        scales: {
                            xAxes: [{
                                display: true,
                                scaleLabel: {
                                    display: true,
                                    labelString: 'Date'
                                },
                                ticks: {
                                    fontSize: width<600? 9: 11
                                }
                            }],
                            yAxes: [{
                                display: true,
                                scaleLabel: {
                                    display: true,
                                    labelString: 'Nombre de modifications'
                                },
                                ticks: {
                                    fontSize: width<600? 9: 11
                                }
                            }]
                        }

                    }}
                />
            </div>

        </Paper>
    )
}
