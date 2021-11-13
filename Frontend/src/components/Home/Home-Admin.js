import React, { Component } from 'react';
import { Image } from 'react-bootstrap';
import Navheader from '../Navbar/navbar';
import SideNavbar from '../Navbar/SideNavbar-Owner';
import './Home-Owner.css';

class HomePageAdmin extends Component {
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
        <div>
        <button
              //onClick={}
              class="btn btn-primary"
              style={{
                backgroundColor: "#292a2b",
                border: "0px",
                borderRadius: "6px",
                color:"white",
                marginLeft:"2%",
                marginTop:"2%",
                width:"12%"
              }}
            >
              Access Sensor Data
            </button>
            <button
              //onClick={}
              class="btn btn-primary"
              style={{
                backgroundColor: "#292a2b",
                border: "0px",
                borderRadius: "6px",
                color:"white",
                marginLeft:"1%",
                marginTop:"2%",
                width:"12%"
              }}
            >
              Access Image Data
            </button>
        </div>
        <div></div>
        <div></div>       
        <div style = {{marginTop:"3%", border: "1px solid", marginLeft:"15%", height:"96px", borderRadius:"15px"}}>
            <label id = "lblCarInfo">All Car Information</label>
            <hr style = {{marginTop:"8px"}}></hr>
            <div style = {{marginLeft: "2%"}}>
                <table id = "tblCarInfoAdmin">
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
            <label id = "lblCarInfo">All User Information</label>
            <hr style = {{marginTop:"8px"}}></hr>
            <div  style = {{marginLeft: "2%"}}>
                <table id = "tblRidesTakenAdmin">
                    <tr>
                        <td>USERNAME</td>
                        <td>ROLE</td>
                        <td>EMAIL</td>
                        <td>PHONE_NUMBER</td>                       
                    </tr>
                </table>
            </div>
        </div>
       
       
      </div>
    );
  }
}

export default HomePageAdmin;
