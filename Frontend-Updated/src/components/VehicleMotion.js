import React from "react";
import ReactSpeedometer from "react-d3-speedometer";
import io from "socket.io-client";
import axios from "axios";
import URLs from "../URLs";
import { Page, Grid, Card, colors } from "tabler-react";
import ListGroup from 'react-bootstrap/ListGroup';

const styles = {
    dial: {
        display: "inline-block",
        width: `300px`,
        height: `auto`,
        color: "#000",
        border: "0.5px solid #fff",
        //padding: "2px",
        paddingTop: "20px",
        paddingLeft: "5px"
    },
    title: {
        fontSize: "1em",
        color: "#000"
    }
};

export default class VehicleMotion extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            forward: "",
            backward: "",
            right: "",
            left:"",
            idle:"",
            stopped:"",
            rideData:this.props.rideData
        };
        this.fetchSensorData = async (rideId) => {
            try {
                console.log("fetch sensordata");
                const response = await axios.get(`${URLs.baseURL}/users/sensordata/${rideId}`);
                if (response.data.success) {
                    var data = response.data.message[0];
                    console.log(data);
                    console.log(data.Throttle.filter(n=>n[0]));
                    console.log(data.Throttle.filter(n=>n[1]));
                    console.log(data.Throttle.filter(n=>n[2]));
                    //var fwd=data.Throttle
                    this.setState({ forward: (data.Throttle[0]>0||data.Throttle[1]>0||data.Throttle[2]>0)?'Yes':'No' });                    
                    //this.setState({ forward: (data.Throttle[1]>0)?'Yes':'No' });                    
                    this.setState({ backward: data.Reverse?'Yes':'No' });
                    // var stop=data.Throttle[0]==0&&data.Throttle[1]==0&&data.Throttle[2]==0;
                    // var brakeZero=data.Brake[0]==0&&data.Brake[1]==0&&data.Brake[2]==0;
                    // var steerZero=data.Steer[0]==0&&data.Steer[1]==0&&data.Steer[2]==0;
                   
                    //this.setState({ stopped: (stop && brakeZero &&steerZero)||(data['Hand Brake']==true)?'Yes':'No' });
                    this.setState({ stopped: (data.Throttle[1] ==0 && data.Brake[1]==0 && data.Steer[1]==0)||(data['Hand Brake'])?'Yes':'No' });
                    
                    this.setState({ idle: (data.Steer[1]==0&&data.Throttle[1]==0)?'Yes':'No' });
                    //var rt=data.Steer[0]>0||data.Steer[1]>0||data.Steer[2]>0;
                    //var lt=data.Steer[0]<0||data.Steer[1]<0||data.Steer[2]<0;
                    //var rt=data.Steer[1]>0||data.Steer[2]>0;
                    //var lt=data.Steer[1]<0;
                    // this.setState({ right: rt?'Yes':'No'});
                    // this.setState({ left: lt?'Yes':'No' });
                    this.setState({ right: data.Steer[1]>0?'Yes':'No'});
                    this.setState({ left: data.Steer[1]<0?'Yes':'No' });
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
            var fwd=sensordata.Throttle.filter(i=>i[0]>0||i[1]>0||i[2]>0);
            this.setState({ forward: fwd.length>0?'Yes':'No' });                    
            this.setState({ backward: sensordata.Reverse?'Yes':'No' });
            var stop=sensordata.Throttle.filter(k=>k[0]==0&&k[1]==0&&k[2]==0);
            var brakeZero=sensordata.Brake.filter(b=>b[0]==0&&b[1]==0&&b[2]==0);
            var steerZero=sensordata.Steer.filter(v=>v[0]==0&&v[1]==0&&v[2]==0);
            this.setState({ stopped: (stop.length>0 && brakeZero.length>0&&steerZero.length>0)||(sensordata['Hand Brake']==true)?'Yes':'No' });
            
            this.setState({ idle: stop.length>0?'Yes':'No' });
           // var rt=sensordata.Steer.filter(x=>x[0]>0||x[1]>0||x[2]>0);
            //var lt=sensordata.Steer.filter(x=>x[0]<0||x[1]<0||x[2]<0);
            var rt=sensordata.Steer[1];
            //data.Steer[1]>0?'Yes':'No'}
            this.setState({ right: rt>0?'Yes':'No'});
            this.setState({ left: rt<0?'Yes':'No' });
            console.log(this.state.sensorData);
        });
        await this.fetchSensorData(this.state.rideData.rideId);
    };

    render() {
        return (
            <Grid.Row>
        <Grid.Col width={11}>
          <Card title={'Vehicle Moving States'} style={{ width: '28rem' }}>
            <ListGroup>
              <ListGroup.Item variant="secondary">
                <Grid.Row>
                  <Grid.Col>
                    {'Forward'}
                  </Grid.Col>
                  <Grid.Col>{this.state.forward}</Grid.Col>
                </Grid.Row>
              </ListGroup.Item>
              <ListGroup.Item variant="secondary">
                <Grid.Row>
                  <Grid.Col>
                    {'Backward'}
                  </Grid.Col>
                  <Grid.Col>{this.state.backward}</Grid.Col>
                </Grid.Row>
              </ListGroup.Item>
              <ListGroup.Item variant="secondary">
                <Grid.Row>
                  <Grid.Col>
                    {'Stopped'}
                  </Grid.Col>
                  <Grid.Col>{this.state.stopped}</Grid.Col>
                </Grid.Row>
              </ListGroup.Item>
              <ListGroup.Item variant="secondary">
                <Grid.Row>
                  <Grid.Col>
                    {'Idle'}
                  </Grid.Col>
                  <Grid.Col>{this.state.idle}</Grid.Col>
                </Grid.Row>
              </ListGroup.Item>  
              <ListGroup.Item variant="secondary">
                <Grid.Row>
                  <Grid.Col>
                    {'Right'}
                  </Grid.Col>
                  <Grid.Col>{this.state.right}</Grid.Col>
                </Grid.Row>
              </ListGroup.Item>  
              <ListGroup.Item variant="secondary">
                <Grid.Row>
                  <Grid.Col>
                    {'Left'}
                  </Grid.Col>
                  <Grid.Col>{this.state.left}</Grid.Col>
                </Grid.Row>
              </ListGroup.Item>           
            </ListGroup>
          </Card>
        </Grid.Col>
      </Grid.Row>
        );
    }

}

