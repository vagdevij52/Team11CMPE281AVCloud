import React from "react";
import ReactSpeedometer from "react-d3-speedometer";
import io from "socket.io-client";
import axios from "axios";
import URLs from "../URLs";
import { Page, Grid, Card, colors,ProgressCard } from "tabler-react";

export default class Direction extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            direction: "",
            color:"",
            width:"",
            rideData:this.props.rideData
        };
        this.fetchSensorData = async (rideId) => {
            try {
                console.log("fetch sensordata");
                const response = await axios.get(`${URLs.baseURL}/users/sensordata/${rideId}`);
                if (response.data.success) {
                    var data = response.data.message[0];
                    console.log(data);
                    this.setState({ direction: data['Heading Direction'] });
                    this.setState({ color: data['Heading Direction']=='W'?"red":data['Heading Direction']=='E'?"yellow":data['Heading Direction']=='S'?"green":data['Heading Direction']=='N'?'green':'orange' });
                    this.setState({ width: 100});
                    console.log("fetch sensordata");

                } else {
                    //alert(response.data.message);
                }
            } catch (error) {
                console.log("Error with fetching rides: ", error);
                alert(
                    "Error with fetching ride. Please check the console for more info."
                );
            }
        };
    }
    componentDidMount = async () => {
        const socket = io("http://localhost:3001/socket", {
            transports: ['websocket']
        });
        socket.on("newSensorData", (sensordata) => {
            console.log(this.state.sensorData);
            console.log(sensordata);
            var data=sensordata;  
            //this.setState({ speed: sensordata['Heading Direction'] });
            this.setState({ direction: data['Heading Direction'] });
            this.setState({ color: data['Heading Direction']=='W'?"red":data['Heading Direction']=='E'?"yellow":data['Heading Direction']=='S'?"green":data['Heading Direction']=='N'?'blue':'orange' });
            this.setState({ width: 100});
            console.log(this.state.sensorData);
        });
        await this.fetchSensorData(this.state.rideData.rideId);
    };

    render() {
        return (
            <Grid.Row>
                <Grid.Col width={30}>
                  
                        <ProgressCard
                            header="Vehicle Direction"
                            content={this.state.direction}
                            progressColor={this.state.color}
                            progressWidth={this.state.width}
                        />
                  
                </Grid.Col>
            </Grid.Row>
        );
    }

}


