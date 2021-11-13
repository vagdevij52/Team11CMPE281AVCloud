import React, { Component } from 'react';
import { Image } from 'react-bootstrap';
import Navheader from '../Navbar/navbar';
import SideNavbar from '../Navbar/SideNavbar-Owner';


class HomePageUser extends Component {
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
        <Navheader />
        <SideNavbar/>
        <div  style = {{marginLeft:"15%", width: "83%", borderRadius:"15px", background:"#fcf6f6"}}>
            <label style = {{fontWeight:"100", fontSize: "22px", marginLeft: "3%", marginTop: "1%"}}>Book a ride</label>    
            <hr style = {{borderColor:"#cbc0c0"}}></hr>
            <div>
                <label style = {{fontWeight:"100", fontSize: "22px", marginLeft: "3%", marginTop: "1%"}}>Source</label>    
                <label style = {{fontWeight:"100", fontSize: "22px", marginLeft: "38.2%", marginTop: "1%"}}>Destination</label> 
            </div>
            <div style = {{marginTop: "2%"}}>
                <input type = "text" id = "txtSource" defaultValue = "Enter source location" style = {{ height: "30px", marginLeft:"3%", width: "28%", borderRadius: "5px"}}></input>   
                <input type = "text" id = "txtDestination" defaultValue = "Enter destination location" style = {{height: "30px", marginLeft:"17%", width: "28%", borderRadius: "5px"}}></input>                   
            </div>
            <div style = {{marginTop:"1%"}}><label  style = {{fontWeight:"100", fontSize: "20px", marginLeft: "3%", marginTop: "1%"}}>Select Car Type</label></div>
            <select style = {{height: "30px", marginLeft: "3px", width: "28%", marginLeft: "3%", borderRadius: "5px"}}>
                <option>View Car Types</option>
                <option>Sedan</option>
                <option>SUV</option>
                <option>Limousine</option>
            </select><br/>
            <button style = {{marginTop: "3%", marginLeft: "3%", width: "10%", borderRadius: "5px", border: "1px solid", height: "35px", background: "#dc9f9f"}}>
                Book Ride
            </button>
            <div></div>
            
        </div> 
       
       
      </div>
    );
  }
}

export default HomePageUser;
