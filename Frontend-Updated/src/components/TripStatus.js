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
            fetchRides(props.rideData.rideId);
          //setSeconds(seconds => seconds + 1);
        }, 1000);
        return () => clearInterval(interval);
      }, []);
    // const state = ()=> {
    //     rideDetails= "",
    //     rideData=props.rideData
    // }
    //this.interval = window.setInterval(this.fetchRides, 1000);

    const fetchRides = async (rideId) => {
        try {
            console.log("fetch fetchRides");
            const response = await axios.get(`${URLs.baseURL}/users/ride/${rideId}`);

            if (response.data.success) {
                console.log(response.data.message);
                setRideDetails(response.data.message);
                // this.rideDetails = response.data.message.VehcileNum;
                // console.log(this.rideDetails);
                // vehicleno = response.data.message.VehcileNum;

            } else {
                //alert(response.data.message);
            }
        } catch (error) {
            console.log("Error with fetching Rides: ", error);
            alert(
                "Error with fetching Ride. Please check the console for more info."
            );
        }
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


