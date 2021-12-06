import React from "react";
import ReactSpeedometer from "react-d3-speedometer";
import io from "socket.io-client";
import axios from "axios";
import URLs from "../URLs";
import { Page, Grid, Card, colors } from "tabler-react";

const styles = {
  dial: {
    display: "inline-block",
    width: `300px`,
    height: 'auto',
    color: "#000",
    border: "0.5px solid #fff",
    //padding: "2px",
    paddingTop:"20px",
    paddingLeft:"5px"
  },
  title: {
    fontSize: "1em",
    color: "#000"
  }
};

export default class Speedometer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      speed: "",
      rideData:this.props.rideData
    };
    this.fetchSensorData = async (rideId) => {
      try {
        console.log("fetch sensordata");
        const response = await axios.get(`${URLs.baseURL}/users/sensordata/${rideId}`);
        if (response.data.success) {
          var data = response.data.message[0];
          console.log(data);
          this.setState({ speed: data['Speed (km/h)'] });

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
      this.setState({ speed: sensordata['Speed (km/h)'] });
      console.log(this.state.sensorData);
    });
    await this.fetchSensorData(this.state.rideData.rideId);
  };

  render() {
    return (
      <Grid.Row>
        <Grid.Col width={20}>
          <Card title={'Speed (km/hr)'} style={{ width: '30rem',height:'30rem' }}>
            <div style={styles.dial}>
              <ReactSpeedometer
                // forceRender={true}
                maxValue={120}
                minValue={0}
                height={180}
                width={250}
                value={this.state.speed}
                needleTransition="easeQuadIn"
                needleTransitionDuration={1000}
                needleColor="red"
                startColor="green"
                segments={10}
                endColor="blue"
              />             
            </div>
            <Card.Footer className="text-muted">
              Speed (m/sec): {(this.state.speed*(5/18)).toFixed(2)}
            </Card.Footer>
          </Card>
        </Grid.Col>
      </Grid.Row>
    );
  }

}


