import React, { Component } from 'react';
import { Image } from 'react-bootstrap';



class HomePage extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentWillMount(){
    //API calls to get user data
  }

  render() {
    return (
      <div>
        
        <div style = {{height:"100vh", width:"14%", float:"left", border:"2px solid", marginTop:"2px solid", background:"#034672", marginTop:"-22px", color:"white"}}>
          <ul>
            <li><a href = 'home-user' style = {{color: "white"}}>Dashboard</a></li>
            <li><a href = 'profileInfo' style = {{color: "white"}}>My Profile</a></li>  
            <li><a href = 'userTripDetails' style = {{color: "white"}}>My Trip details</a></li>  
          </ul>            
        </div>       
      </div>
    );
  }
}

export default HomePage;
