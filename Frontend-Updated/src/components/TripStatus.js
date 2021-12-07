import React, { useEffect, useState } from "react";
import ReactSpeedometer from "react-d3-speedometer";
import io from "socket.io-client";
import axios from "axios";
import URLs from "../URLs";
import { Page, Grid, Card, colors } from "tabler-react";
import ProgressBar from 'react-bootstrap/ProgressBar';
import ListGroup from 'react-bootstrap/ListGroup';

function TripStatus(props) {

    const [rideDetails, setRideDetails] = useState("");
    const [rideData, setRideData] = useState("");

   
   
    useEffect(() => {
        const interval = setInterval(() => {
           // setRideData(props.rideData);
            fetchRides();
          //setSeconds(seconds => seconds + 1);
        }, 1000);
        return () => clearInterval(interval);
      }, []);
    // const state = ()=> {
    //     rideDetails= "",
    //     rideData=props.rideData
    // }
    //this.interval = window.setInterval(this.fetchRides, 1000);

    const fetchRides = async () => {
        
            console.log("fetch fetchRides");
            var rideId = 86;
            const data = JSON.parse(sessionStorage.getItem('userRideDetails'));
            setRideDetails(data);
           
    };
    //fetchRides(rideData.rideId);
    return (

        <Card title={'Trip Status'}>
            <Card.Body>
                <ListGroup>
                    <ListGroup.Item>
                        <Grid.Row>
                            <Grid.Col>
                                {rideDetails.RideStatus}
                            </Grid.Col>
                            <Grid.Col >
                                <div style={{ paddingTop: "8px" }}>
                                    <ProgressBar variant="success" 
                                    now={rideDetails.RideStatus=="Booked"?0:rideDetails.RideStatus=="In Progress"?50:100} style={{ height: "7.5px" }} />
                                </div>
                            </Grid.Col>
                        </Grid.Row>
                    </ListGroup.Item>
                </ListGroup>
                {/* </Grid.Row> */}

            </Card.Body>

            {/* <Card.Footer className="text-muted">
                            Distance Travelled: {this.state.rideDetails.RideDistance}
                        </Card.Footer> */}
        </Card>

    );




}
export default TripStatus;


