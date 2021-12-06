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


import TrackRides from "./TrackRides";
import SiteWrapper from "../SiteWrapper";

export default class AdminTrackingDashboard extends React.Component {
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
        <Page.Content title="Admin Tracking Dashboard">
          <Grid.Row cards={true}>
          
                <Grid.Col sm={6}>
                  <TrackRides rideData={this.state}
                  />
                
            </Grid.Col>
          </Grid.Row>
        </Page.Content>
      </SiteWrapper>
    );
  }
}

