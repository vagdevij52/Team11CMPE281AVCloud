import React, { Component } from 'react';
import './App.css';
import Main from './components/Main';
import {BrowserRouter} from 'react-router-dom';
import socketIOClient from "socket.io-client";
//App Component

var socket;
class App extends Component {
  constructor(){  
  this.state = {
    endpoint: "http://localhost:3001/" // Update 3001 with port on which backend-my-app/server.js is running.
  };
  socket = socketIOClient(this.state.endpoint);
}

 
  render() {
    return (
      //Use Browser Router to route to different pages
      <BrowserRouter>
        <div>
          {/* App Component Has a Child Component called Main*/}
          <Main/>
        </div>
      </BrowserRouter>
    );
  }
}
//Export the App component so that it can be used in index.js
export default {App,socket};
