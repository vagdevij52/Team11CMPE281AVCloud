import React, { Component } from 'react';
import { Image } from 'react-bootstrap';
import Navheader from '../Navbar/navbar';
import SideNavbar from '../Navbar/SideNavbar-Owner';
import './Home-Owner.css';

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
        <Navheader />
        <SideNavbar/>
        <div id = "div1">
            {/* <input type="textbox" id="txtLanguage" defaultValue={} style=""/> */}
            <label style = {{marginLeft: "40%", marginTop: "12%", color:"white",fontSize:"21px", fontWeight:"100"}}>Varun</label><br/>
            <label style = {{marginLeft:"23%", color:"white", fontSize:"21px", fontWeight:"100"}}>Available Amount : $0.00</label>
            <button
              //onClick={}
              class="btn btn-primary"
              style={{
                backgroundColor: "white",
                border: "0px",
                borderRadius: "6px",
                color:"black",
                marginLeft:"37%",
                marginTop:"2%",
                widtd:"24%"
              }}
            >
              Transfer
            </button>
        </div>
        <div style = {{marginTop:"3%", border: "1px solid", marginLeft:"15%", height:"96px", borderRadius:"15px"}}>
            <label id = "lblCarInfo">Car Information</label>
            <hr style = {{marginTop:"8px"}}></hr>
            <div>
                <table id = "tblCarInfo">
                    <tr>
                        <td>CAR MODEL</td>
                        <td>CAR NO.</td>
                        <td>CAR COLOR</td>
                        <td>CAR TYPE</td>
                        <td>CAR STATUS</td>
                        <td>BATTERY</td>
                    </tr>
                </table>
            </div>
        </div>
        <div style = {{marginTop:"3%", border: "1px solid", marginLeft:"15%", height:"96px", borderRadius:"15px"}}>
            <label id = "lblCarInfo">Rides Taken</label>
            <hr style = {{marginTop:"8px"}}></hr>
            <div>
                <table id = "tblRidesTaken">
                    <tr>
                        <td>#</td>
                        <td>SOURCE</td>
                        <td>DESTINATION</td>
                        <td>DATE</td>
                        <td>TRIP STATUS</td>
                        <td>AMOUNT</td>
                    </tr>
                </table>
            </div>
        </div>
       
       
      </div>
    );
  }
}

export default HomePage;
