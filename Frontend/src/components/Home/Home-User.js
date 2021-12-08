import React, { Component } from 'react';
import { Image } from 'react-bootstrap';
import Navheader from '../Navbar/navbar';
import SideNavbar from '../Navbar/SideNavbar-User';


class HomePageUser extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  BookRide = () => {
    
    document.getElementById("divRide").style.display = '';
    
  }
  componentWillMount(){
    //API calls to get user data
    //document.getElementById("divRide").hide();
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
                <input type = "text" id = "txtSource" placeholder = "Enter source location" style = {{ height: "30px", marginLeft:"3%", width: "28%", borderRadius: "5px"}}></input>   
                <input type = "text" id = "txtDestination" placeholder = "Enter destination location" style = {{height: "30px", marginLeft:"17%", width: "28%", borderRadius: "5px"}}></input>                   
            </div>
            <div style = {{marginTop:"1%"}}><label  style = {{fontWeight:"100", fontSize: "20px", marginLeft: "3%", marginTop: "1%"}}>Select Car Type</label></div>
            <select style = {{height: "30px", marginLeft: "3px", width: "28%", marginLeft: "3%", borderRadius: "5px"}}>
                <option>View Car Types</option>
                <option>Sedan</option>
                <option>SUV</option>
                <option>Limousine</option>
            </select><br/>
            <button onClick = {this.BookRide} style = {{marginTop: "3%", marginLeft: "3%", width: "10%", borderRadius: "5px", border: "1px solid", height: "35px", background: "#dc9f9f"}}>
                Book Ride
            </button>
            <div id = 'divRide' style = {{marginTop: "2%", marginLeft: "3%", border: "1px solid", width: "28%", background: "white", borderRadius: "15px", display:"none"}}>
              <label style = {{marginTop: "4%", marginLeft: "2%"}}>
              Tesla Model 3<br/>
              Car No: 54977<br/>
              Estimated travel time : 15mins<br/>
              Estimated Fare: $15.00
              </label>
            </div>
            
        </div> 
       
       
      </div>
    );
  }
}

export default HomePageUser;
