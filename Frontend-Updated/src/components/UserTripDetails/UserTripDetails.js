import React, { Component } from 'react';
import { Image } from 'react-bootstrap';
import Navheader from '../Navbar/navbar';
import SideNavbar from '../Navbar/SideNavbar-User';
import './UserTripDetails.css';

class UserTripDetails extends Component {
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
            <label style = {{marginLeft: "40%", marginTop: "12%", color:"white",fontSize:"21px", fontWeight:"100"}}>{sessionStorage.getItem('username')}</label><br/>
            <label style = {{marginLeft:"23%", color:"white", fontSize:"21px", fontWeight:"100"}}>Available Amount : $90.00</label>
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
        <div style = {{marginTop:"3%", border: "1px solid", marginLeft:"15%", borderRadius:"15px"}}>
            <label id = "lblCarInfo">User Trip Details</label>
            <hr style = {{marginTop:"8px"}}></hr>
            <div style = {{marginLeft : "4%"}}>
                <table id = "tblUserCarInfo">
                    <tr>
                        <th>#</th>
                        <th>SOURCE</th>
                        <th>DESTINATION</th>
                        <th>DATE</th>
                        <th>AMOUNT</th>
                        <th>TRIP STATUS</th>
                        {/* <td>BATTERY</td> */}
                    </tr>
                    <tr>
                        <td>1</td>
                        <td>San Jose</td>
                        <td>Santa Clara</td>
                        <td>2021-11-14</td>
                        <td>20.0</td>
                        <td>Complete</td>
                        {/* <td>BATTERY</td> */}
                    </tr>
                    <tr>
                        <td>2</td>
                        <td>San Jose</td>
                        <td>Milpitas</td>
                        <td>2021-11-14</td>
                        <td>25.0</td>
                        <td>Complete</td>
                    </tr>
                    <tr>
                        <td>3</td>
                        <td>San Jose</td>
                        <td>Santa Clara</td>
                        <td>2021-11-14</td>
                        <td>17.0</td>
                        <td>Booked</td>
                    </tr>
                </table>
            </div>
        </div>       
      </div>
    );
  }
}

export default UserTripDetails;
