import * as React from "react";
import { useState } from 'react';
import {
  Page,
  Avatar,
  Icon,
  Grid,
  Card,
  Text,
  Table,
  Alert,
  Progress,
  colors,
  Dropdown,
  Button,
  StampCard,
  StatsCard,
  ProgressCard,
  Badge,
} from "tabler-react";
import C3Chart from "react-c3js";
import "../c3jscustom.css";
import MapContainer from "./MapContainer";

import SiteWrapper from "./SiteWrapper";
import ChartsPage from "../components/ChartsPage";
import MapComponent from "../components/Map";
import SensorData from "../components/SensorData";
import Speedometer from "../components/Speedometer";
import VehicleMotion from "../components/VehicleMotion";
import Direction from "../components/Direction";
import TripStatus from "../components/TripStatus";

export default class UserTrackingDashboard extends React.Component { 
  constructor(props) {
    super(props);
      this.state = {
        //rideId: this.props.rideData   
        rideId: 86
    }
    console.log(this.state)
  }
  render() {
    //const {data} = this.state;
    console.log(this.state);
    return (
      <SiteWrapper>
        <Page.Content title="User Tracking Dashboard">
          <Grid.Row cards={true}>

            <Grid.Col lg={6}>
              <SensorData rideData = {this.state} />
            </Grid.Col>

            <Grid.Col md={6}>
              <Grid.Row>
                <Grid.Col sm={6}>
                  <Speedometer rideData = {this.state}                    
                  />
                </Grid.Col>
                <Grid.Col sm={6}>
                  <VehicleMotion rideData = {this.state}  />
                </Grid.Col>
                <Grid.Col sm={6}>
                  <Direction rideData={this.state} />
                  {/* <ProgressCard
                    header="Vehicle Direction"
                    content="W"
                    progressColor="red"
                    progressWidth={28}
                  /> */}
                </Grid.Col>
                <Grid.Col sm={6}>
                  <TripStatus rideData = {this.state}/>
                </Grid.Col>
              </Grid.Row>
            </Grid.Col>


          </Grid.Row>
          <Grid.Row>
            <Grid.Col width={100}>
              <ChartsPage rideData = {this.state}  />
            </Grid.Col>
            <Grid.Col>
              {/* <MapContainer/> */}
              <MapComponent  rideData = {this.state}/>
            </Grid.Col>
          </Grid.Row>
        </Page.Content>
      </SiteWrapper>
    );
  }
}

