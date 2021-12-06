import React, { Component } from 'react';
import { Image } from 'react-bootstrap';
import axios from "axios";
import Navheader from '../Navbar/navbar';
import SideNavbar from '../Navbar/SideNavbar-Admin';
import './Home-Owner.css';
import {url} from '../Constants'

class HomePageAdmin extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentWillMount(){
    //API calls to get user data
    axios.defaults.withCredentials = true;
    // let config = {
    //   headers: {
    //     'Authorization': 'Bearer ' + sessionStorage.getItem('auth')
    //   }
    // }

    
    axios
    .get(url + '/getAllVehicleDetails')
    .then((response) => {
        console.log('Status Code : ', response.status);
        console.log('response ', response.data);
           
        if(response.data != false)
        {
           sessionStorage.setItem('allCarsInfo', JSON.stringify(response.data));
           var carInfoHtml = document.getElementById('tblCarInfoAdmin').innerHTML;
           for(var i = response.data.length - 1; i >= 0; i--)
           {
			   if(response.data.length - i == 5)
				   break;
            carInfoHtml += '<tr><td>' + response.data[i].VehcileModel + '</td><td>' + response.data[i].VehcileNum+ '</td><td>' + response.data[i].VehcileColor+ '</td><td>' + response.data[i].VehicleType+ '</td><td>' + response.data[i].VehcileScheduleStatus+ '</td></tr>'
           }
           
           document.getElementById('tblCarInfoAdmin').innerHTML = carInfoHtml;
           axios
           .get(url + '/getAllUserDetails')
           .then((response) => {
               console.log('Status Code : ', response.status);
               console.log('response ', response.data);
                  
               if(response.data != false)
               {
                  sessionStorage.setItem('allUsersInfo', JSON.stringify(response.data));
                  var userInfoHtml = document.getElementById('tblUserInfoAdmin').innerHTML;
                  for(var i = 0; i < response.data.length; i++)
                  {
                    userInfoHtml += '<tr><td>' + response.data[i].FirstName + ' ' + response.data[i].LastName + '</td><td>' + response.data[i].UserRole+ '</td><td>' + response.data[i].Email+ '</td><td>' + response.data[i].UserPhone+ '</td></tr>';
                  }     
       
                  document.getElementById('tblUserInfoAdmin').innerHTML = userInfoHtml;                  
               }
                    
               console.log(response.data);          
            })
           .catch((err) => {            
               alert("Something went wrong");            
           });
           


        }
             
        console.log(response.data);          
     })
    .catch((err) => {            
        alert("Something went wrong");            
    });
  }

  onclickbtnAccessSensorInfo = () => {
    this.props.history.push('/admin-AVSensorInfo');
  }

  render() {
    return (
      <div>
        <Navheader />
        <SideNavbar/>
        <div>
        <button
              onClick= {this.onclickbtnAccessSensorInfo}
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
            {/* <button
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
            </button> */}
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
                </table>
            </div>
        </div>
       
       
      </div>
    );
  }
}

export default HomePageAdmin;
