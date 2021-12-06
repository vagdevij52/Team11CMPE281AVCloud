import * as React from "react";
import { Page, Grid, Card, colors } from "tabler-react";
import Chart from "react-apexcharts";
import io from "socket.io-client";
import axios from "axios";
import URLs from "../URLs";
import ListGroup from 'react-bootstrap/ListGroup';
export default class SensorData extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      sensorData: "",
      xData: [],
      rideDetails: "",
      isCollided: "No",
      isBrakesApplied: "No",
      vehicleCount: 0,
      rideData:this.props.rideData
    }
    this.fetchSensorData = async (rideId) => {
      try {
        console.log("fetch sensordata");
        const response = await axios.get(`${URLs.baseURL}/users/sensordata/${rideId}`);
        if (response.data.success) {
          var data = response.data.message[0];
          var collisiondata = data.Collision.filter(item => item != 0);
          this.setState({ sensorData: data });
          this.setState({ isCollided: collisiondata.length > 0 ? 'Yes' : 'No' });
          console.log("fetch sensordata");
          var brakes = data.Brake.filter(ih => ih[0] == 1 && ih[1] == 0 && ih[2] == 1).map(n => n);
          this.setState({ isBrakesApplied: brakes.length > 0 ? 'Yes' : 'No' });
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
      this.setState({ sensorData: sensordata });
      var collisiondata = sensordata.Collision.filter(item => item != 0);
      //this.setState({ sensorData: data});          
      this.setState({ isCollided: collisiondata.length > 0 ? 'Yes' : 'No' });
      console.log("fetch sensordata");
      var brakes = sensordata.Brake.filter(ih => ih[0] == 1 && ih[1] == 0 && ih[2] == 1).map(n => n);
      this.setState({ isBrakesApplied: brakes.length > 0 ? 'Yes' : 'No' });
      console.log(this.state.sensorData);
    });
    await this.fetchSensorData(this.state.rideData.rideId);
  };

  render() {
    return (
      <Grid.Row>
        <Grid.Col width={11}>
          <Card title={'Sensor Data'} style={{ width: '28rem' }}>
            <ListGroup>
              <ListGroup.Item variant="secondary">
                <Grid.Row>
                  <Grid.Col>
                    {'Weather'}
                  </Grid.Col>
                  <Grid.Col>{this.state.sensorData.Weather}</Grid.Col>
                </Grid.Row>
              </ListGroup.Item>
              <ListGroup.Item variant="secondary">
                <Grid.Row>
                  <Grid.Col>
                    {'Lighting'}
                  </Grid.Col>
                  <Grid.Col>{this.state.sensorData.Lighting}</Grid.Col>
                </Grid.Row>
              </ListGroup.Item>
              <ListGroup.Item variant="secondary">
                <Grid.Row>
                  <Grid.Col>
                    {'Latitude'}
                  </Grid.Col>
                  <Grid.Col>{this.state.sensorData['Location x']}</Grid.Col>
                </Grid.Row>
              </ListGroup.Item>
              <ListGroup.Item variant="secondary">
                <Grid.Row>
                  <Grid.Col>
                    {'Longitude'}
                  </Grid.Col>
                  <Grid.Col>{this.state.sensorData['Location y']}</Grid.Col>
                </Grid.Row>
              </ListGroup.Item>
              <ListGroup.Item variant="secondary">
                <Grid.Row>
                  <Grid.Col>
                    {'Collision'}
                  </Grid.Col>
                  <Grid.Col>{this.state.isCollided}</Grid.Col>
                </Grid.Row>
              </ListGroup.Item>
              <ListGroup.Item variant="secondary">
                <Grid.Row>
                  <Grid.Col>
                    {'Heading'}
                  </Grid.Col>
                  <Grid.Col>{this.state.sensorData['Heading']}</Grid.Col>
                </Grid.Row>
              </ListGroup.Item>
              <ListGroup.Item variant="secondary">
                <Grid.Row>
                  <Grid.Col>
                    {'Brake Applied'}
                  </Grid.Col>
                  <Grid.Col>{this.state.isBrakesApplied}</Grid.Col>
                </Grid.Row>
              </ListGroup.Item>
              <ListGroup.Item variant="secondary">
                <Grid.Row>
                  <Grid.Col>
                    {'No. of vehicles nearby'}
                  </Grid.Col>
                  <Grid.Col>{this.state.sensorData['Number of vehicles']}</Grid.Col>
                </Grid.Row>
              </ListGroup.Item>
              <ListGroup.Item variant="secondary">
                <Grid.Row>
                  <Grid.Col>
                    {'Lane violations'}
                  </Grid.Col>
                  <Grid.Col>{this.state.sensorData['Number of lane violations']}</Grid.Col>
                </Grid.Row>
              </ListGroup.Item>
            </ListGroup>
          </Card>
        </Grid.Col>
      </Grid.Row>
    );
  }

}