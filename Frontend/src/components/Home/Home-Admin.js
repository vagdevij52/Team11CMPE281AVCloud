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
                backgroundColor: "#034672",
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
                backgroundColor: "#034672",
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
        <div style = {{marginTop:"3%", border: "1px solid", marginLeft:"15%", borderRadius:"15px"}}>
            <label id = "lblCarInfo">All Car Information</label>
            <hr style = {{marginTop:"8px"}}></hr>
            <div style = {{marginLeft: "4%"}}>
                <table id = "tblCarInfoAdmin">
                    <tr>
                        <th>CAR MODEL</th>
                        <th>CAR NO.</th>
                        <th>CAR COLOR</th>
                        <th>CAR TYPE</th>
                        <th>CAR STATUS</th>                        
                    </tr>
                    <tr>
                      <td>TESLA MODEL 3</td>
                      <td>54977</td>
                      <td>RED</td>
                      <td>SEDAN</td>
                      <td>ACTIVE</td>                      
                    </tr>
                    <tr>
                      <td>BMW X3</td>
                      <td>98765</td>
                      <td>BLUE</td>
                      <td>SUV</td>
                      <td>ACTIVE</td>                      
                    </tr>
                    <tr>
                      <td>CHEVORLET CAMARO</td>
                      <td>73457</td>
                      <td>BLACK</td>
                      <td>SEDAN</td>
                      <td>ACTIVE</td>                      
                    </tr>
                    <tr>
                      <td>VOLVO XC90</td>
                      <td>34986</td>
                      <td>RED</td>
                      <td>SUV</td>
                      <td>ACTIVE</td>                      
                    </tr>
                    <tr>
                      <td>MERCEDES GLA350</td>
                      <td>86431</td>
                      <td>WHITE</td>
                      <td>SUV</td>
                      <td>ACTIVE</td>                      
                    </tr>
                </table>
            </div>
        </div>
        <div style = {{marginTop:"3%", border: "1px solid", marginLeft:"15%", borderRadius:"15px"}}>
            <label id = "lblCarInfo">All User Information</label>
            <hr style = {{marginTop:"8px"}}></hr>
            <div  style = {{marginLeft: "4%"}}>
                <table id = "tblUserInfoAdmin">
                    <tr>
                        <th>USERNAME</th>
                        <th>ROLE</th>
                        <th>EMAIL</th>
                        <th>PHONE_NUMBER</th>                       
                    </tr>
                    <tr>
                      <td>user1</td>
                      <td>User</td>
                      <td>user1@gmail.com</td>
                      <td>6697654382</td>
                    </tr>
                    <tr>
                      <td>user2</td>
                      <td>User</td>
                      <td>user2@gmail.com</td>
                      <td>6695678654</td>
                    </tr>
                    <tr>
                      <td>owner1</td>
                      <td>Owner</td>
                      <td>owner1@gmail.com</td>
                      <td>4080967865</td>
                    </tr>
                </table>
            </div>
        </div>
       
       
      </div>
    );
  }
}

export default HomePageAdmin;
