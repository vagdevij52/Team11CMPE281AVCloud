import React, { Component } from 'react';
import { Image } from 'react-bootstrap';
import Navheader from '../Navbar/navbar';
import SideNavbar from '../Navbar/SideNavbar-Owner';
import './Home-Owner.css';
import axios from 'axios';
import { url, ownerBearer, userBearer, adminBearer } from '../Constants';


class HomePage extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentWillMount(){
    //API calls to get user data
    axios.defaults.withCredentials = true;
    // make a post request with the user data
    axios
      .get(url + '/getVehicleDetails?userId=' + sessionStorage.getItem('userid'))
      .then((response) => {
        console.log('Status Code : ', response.status);
        console.log('response ', response.data);
        
          this.setState({
            carModel: response.data[0].VehcileModel,
            carNo: response.data[0].VehcileNum,
            carColor: response.data[0].VehcileColor,
            carType: response.data[0].VehicleType,
            carStatus: response.data[0].VehcileScheduleStatus,
          })
          console.log(response.data);
          const vehicleId =  response.data[0].VehcileID;
          axios
          .get(url + '/getVehicleRideDetails?vehicleId=' + vehicleId)
          .then((response) => {
            console.log('Status Code : ', response.status);
            console.log('response ', response.data);
           
            if(response.data != false)
            {
              var html = document.getElementById('tblRidesTaken').innerHTML;
              var totalAmount = 0;

              for(var i = 0; i < response.data.length; i++)
              {
                html += '<tr><td>' + (i+1) +'</td><td>'+ response.data[0].RideOrigin + '</td><td>' + response.data[0].RideDestination + '</td><td>' + response.data[0].RideStartTime.substring(0, 10) + '</td><td>' + response.data[0].RideStatus + '</td><td>' + response.data[0].RideAmount + '</td></tr>';                    
                totalAmount += response.data[0].RideAmount;
              }

              this.setState({amount: totalAmount});
              
              document.getElementById('tblRidesTaken').innerHTML = html;
            }
             
            console.log(response.data);          
          })
          .catch((err) => {            
            alert("Something went wrong");            
          });
      
        
      })
      .catch((err) => {
        //console.log(err.response.data);
        alert("Something went wrong");
        // this.setState({
        //   errorMessage: err.response.data,
        // });
      });
  }



  render() {
    return (
      <div>
        <Navheader />
        <SideNavbar/>
        <div id = "div1">
            {/* <input type="textbox" id="txtLanguage" defaultValue={} style=""/> */}
            <label style = {{marginLeft: "40%", marginTop: "12%", color:"white",fontSize:"21px", fontWeight:"100"}}>{sessionStorage.getItem('username')}</label><br/>
            <label style = {{marginLeft:"23%", color:"white", fontSize:"21px", fontWeight:"100"}}>Available Amount : ${this.state.amount}</label>
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
            <label id = "lblCarInfo">Car Information</label>
            <hr style = {{marginTop:"8px"}}></hr>
            <div style = {{marginLeft : "4%"}}>
                <table id = "tblCarInfo">
                    <tr>
                        <th>CAR MODEL</th>
                        <th>CAR NO.</th>
                        <th>CAR COLOR</th>
                        <th>CAR TYPE</th>
                        <th>CAR STATUS</th>
                        {/* <td>BATTERY</td> */}
                    </tr>
                    <tr>
                        <td>{this.state.carModel}</td>
                        <td>{this.state.carNo}</td>
                        <td>{this.state.carColor}</td>
                        <td>{this.state.carType}</td>
                        <td>{this.state.carStatus}</td>                        
                    </tr>
                    {/* <tr>
                        <td>BMW X3</td>
                        <td>98765</td>
                        <td>Blue</td>
                        <td>SUV</td>
                        <td>Inactive</td>
                        
                    </tr> */}
                </table>
            </div>
        </div>
        <div style = {{marginTop:"3%", border: "1px solid", marginLeft:"15%",  borderRadius:"15px"}}>
            <label id = "lblCarInfo">Rides Taken</label>
            <hr style = {{marginTop:"8px"}}></hr>
            <div>
                <table id = "tblRidesTaken">
                    <tr>
                        <th>#</th>
                        <th>SOURCE</th>
                        <th>DESTINATION</th>
                        <th>DATE</th>
                        <th>TRIP STATUS</th>
                        <th>AMOUNT</th>
                    </tr>                    
                </table>
            </div>
        </div>
       
       
      </div>
    );
  }
}

export default HomePage;
