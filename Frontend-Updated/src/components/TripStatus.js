import React from "react";
import ReactSpeedometer from "react-d3-speedometer";
import io from "socket.io-client";
import axios from "axios";
import URLs from "../URLs";
import { Page, Grid, Card, colors } from "tabler-react";
import ProgressBar from 'react-bootstrap/ProgressBar';
import ListGroup from 'react-bootstrap/ListGroup';

export default class TripStatus extends React.Component {

    constructor(props)
    {
        super(props);
        this.state={
            rideStatus:'Booked'
        }
    }
   
    componentDidMount = async () => {
        const socket = io(+URLs.socketURL+"/socket", {
          transports: ['websocket']
        });
        socket.on("newStatusData", (statusData) => {
          
          console.log(statusData);
          this.setState({ rideStatus: statusData.Status });          
        });
        
      };
    render(){
    return (

        <Card title={'Trip Status'}>
            <Card.Body>
                <ListGroup>
                    <ListGroup.Item>
                        <Grid.Row>
                            <Grid.Col>
                                {this.state.rideStatus}
                            </Grid.Col>
                            <Grid.Col >
                                <div style={{ paddingTop: "8px" }}>
                                    <ProgressBar variant="success" 
                                    now={this.state.rideStatus=="Booked"?0:this.state.rideStatus=="In Progress"?50:100} style={{ height: "7.5px" }} />
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
}



