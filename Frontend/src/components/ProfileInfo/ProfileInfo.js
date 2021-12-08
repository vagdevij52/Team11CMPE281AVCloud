import React, { Component } from 'react';
import { Image } from 'react-bootstrap';
import Navheader from '../Navbar/navbar';
import SideNavbarOwner from '../Navbar/SideNavbar-Owner';
import SideNavbarUser from '../Navbar/SideNavbar-User';
import './ProfileInfo.css';



class ProfileInfo extends Component {
  constructor(props) {
    super(props);
    this.state = {
        test : ""
    };
  }

  componentWillMount(){
    //API calls to get user data
  }

  saveUserDetails = () => {
    alert("User Details Saved successfully");
  }

  render() {
    var navbar = '<SideNavbarOwner/>';

    if(sessionStorage.getItem('username') == 'user1')
    {
        navbar = '<SideNavbarUser/>';
    }
    return (
      <div>
          
        <Navheader />
        < SideNavbarUser/>
        <div style = {{width: "47%", border: "1px solid", marginLeft: "17%", borderRadius: "15px"}}>
            <br/>
            <div style = {{marginLeft: "2%"}}>
            <label style = {{fontWeight: "100", fontSize: "19px"}}>Role</label><br/> <br/>
            <input type = 'textbox' id = 'txtRole' defaultValue = 'User' style = {{borderRadius: "5px"}}></input><br/><br/>
            <label style = {{fontSize:"20px"}}>General Information</label><br/>
            <label>First Name</label>
            <label style = {{marginLeft: "27%"}}>Last Name</label><br/>
            <input type = 'textbox' id = 'txtFirstName' style = {{borderRadius: "5px"}} defaultValue = 'user1'></input>
            <input type = 'textbox' id = 'txtLastName' style = {{borderRadius: "5px", marginLeft:"8%"}}></input><br/><br/>
            <label>Birthday</label>
            <label style = {{marginLeft: "30%"}}>Gender</label><br/>
            <input type = 'textbox' id = 'txtBirthday' style = {{borderRadius: "5px"}} placeholder = "mm/dd/yyyy" ></input>
            <input type = 'textbox' id = 'Gender' style = {{borderRadius: "5px", marginLeft:"8%"}} defaultValue = 'Male'></input><br/><br/>
            <label>Email</label>
            <label style = {{marginLeft: "33%"}}>Phone</label><br/>
            <input type = 'textbox' id = 'txtEmail' style = {{borderRadius: "5px"}} defaultValue = 'user1@gmail.com'></input>
            <input type = 'textbox' id = 'txtPhone' style = {{borderRadius: "5px", marginLeft:"8%"}}></input><br/><br/>
            <button onClick = {this.saveUserDetails} style = {{borderRadius: "5px", border : " 1px solid", height: "33px", background: "#034672", color: "white", width:"122px", marginBottom: "2%"}}>Save Details</button>
            </div>

        </div>      
      </div>
    );
  }
}

export default ProfileInfo;
