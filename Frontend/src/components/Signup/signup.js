import React, { Component } from 'react';
import '../../App.css';
import axios from 'axios';
import bcrypt from 'bcryptjs';
import cookie from 'react-cookies';
import { Redirect } from 'react-router';
import Navheader from '../Navbar/navbar';
import Button from 'react-bootstrap/Button';
import { Form, Image } from 'react-bootstrap';
import '../Navbar/navbar.css';
import '../Constants'
import { url } from '../Constants';

const saltRounds = 10;

class Signup extends Component {
  constructor(props) {
    super(props);
    this.state = {
      firstname: '',
      lastname: '',
      userrole: '',
      email: '',
      password: '',
      firstnameerrors: '',
      emailerrors: '',
      passworderrors: '',
      redirecttohome: null,
      carColor:'',
      carNo:'',
      carType:''
    };

    // Bind the handlers to this class
    this.firstnameChangeHandler = this.firstnameChangeHandler.bind(this);
    this.lastnameChangeHandler = this.lastnameChangeHandler.bind(this);
    this.userroleChangeHandler = this.userroleChangeHandler.bind(this);
    this.emailChangeHandler = this.emailChangeHandler.bind(this);
    this.passwordChangeHandler = this.passwordChangeHandler.bind(this);
    this.carNoChangeHandler = this.carNoChangeHandler.bind(this);
    this.carColorChangeHandler = this.carColorChangeHandler.bind(this);
    this.carTypeChangeHandler = this.carTypeChangeHandler.bind(this);
    this.submitsignup = this.submitsignup.bind(this);
  }

  carNoChangeHandler = (e) => {
    this.setState({
      carNo: e.target.value,
    });
  }

  carColorChangeHandler = (e) => {
    this.setState({
      carColor: e.target.value,
    });
  }

  carTypeChangeHandler = (e) => {
    this.setState({
      carType: e.target.value,
    });
  }
  firstnameChangeHandler = (e) => {
    this.setState({
      firstname: e.target.value,
    });
  };
  lastnameChangeHandler = (e) => {
    this.setState({
      lastname: e.target.value,
    });
  };
  userroleChangeHandler = (e) => {
    this.setState({
      userrole: e.target.value,
    });
    
    if(e.target.value == 'Car Owner')
      document.getElementById("divOwnerFields").style.display = '';
  };

  emailChangeHandler = (e) => {
    this.setState({
      email: e.target.value,
    });
  };

  passwordChangeHandler = (e) => {
    this.setState({
      password: e.target.value,
    });
  };

  isformvalid = () => {
    let formisvalid = true;
    const signuperrors = {
      firstnameerrors: '',
      emailerrors: '',
      passworderrors: '',
    };

    const emailpattern =
      /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z]{2,4})$/;
    const pwdpattern =
      /^(?=.*\d)(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z]).{8,50}$/;

    const { firstname, email, password } = this.state;

    if (firstname.length === 0) {
      formisvalid = false;
      signuperrors.firstnameerrors = 'Firstname cannot be blank!';
    }

    if (!emailpattern.test(email)) {
      formisvalid = false;
      if (email.length === 0) {
        signuperrors.emailerrors = 'Email address cannot be blank!';
      } else {
        signuperrors.emailerrors = 'Email ID is not Valid!';
      }
      console.log(signuperrors.emailerrors);
    }
    if (!pwdpattern.test(password)) {
      formisvalid = false;
      signuperrors.passworderrors =
        'Password is not valid and must contain minimum 8 characters with a numeric, special character , lower and upper case letters!';
      console.log(signuperrors.passworderrors);
    }
    this.setState((prevstate) => ({
      ...prevstate,
      ...signuperrors,
    }));

    console.log(
      formisvalid,
      signuperrors.firstnameerrors,
      signuperrors.emailerrors,
      signuperrors.passworderrors
    );
    return formisvalid;
  };

  // submit Login handler to send a request to the node backend
  submitsignup = async (e) => {
   
    // prevent page from refresh
    e.preventDefault();
    const formisvalidated = this.isformvalid();
    console.log(formisvalidated);
    if (formisvalidated) {
      const { firstname, lastname, userrole, email, password, carType, carNo, carColor} = this.state;
     
      const data = {
        // firstname,
        // lastname,
        // userrole,
        // email,        
        // encryptpassword: await bcrypt.hash(password, saltRounds),
        FirstName:this.state.firstname,
        LastName:this.state.lastname,
        UserRole:this.state.userrole,
        Email: this.state.email,
        UserPassword:await bcrypt.hash(this.state.password, saltRounds),
        UserCreditCard:"",
        UserPhone:"",
        ProfilePicture:null
      }
      
      alert("User created Successfully. Please Login");
      this.props.history.push("/login");
      return;
      //alert("Hey");
      var path = url;    
      path += '/auth/register'; 
      
      console.log(data);
      // set the with credentials to true
      axios.defaults.withCredentials = true;
      // make a post request with the user data
      axios
        .post(path, data)
        .then((response) => {
          console.log('Status Code : ', response.status);
          if (response.status === 200) {
            console.log(response.data);

            if(this.state.userrole == 'Car Owner')
            {
              const data1 = {
                VehicleNum :this.state.carNo,
                VehicleModel: this.state.carType,
                VehicleMake:"LUCID",
                VehicleColor: this.state.carColor,
                VehicleMileage:50,
                VehicleSize:"560",
                VehicleScheduleStatus:"scheduled",
                VehicleStatus:"active",
                VehicleSeatingCapacity:5,
                VehicleDistanceDriven:80,
                VehicleApprovalStatus:"approved",
                VehicleOwnerID:59

              }

              // const token = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJleHAiOjE2MzY4ODU5OTksImlhdCI6MTYzNjgzMTk5OSwic3ViIjo1OX0.-IqykhJjdHxGQg81HvcmZ22Y1jXG9yBpvOnj9b5Mx8I';
              // axios.defaults.headers.common = {'Authorization': `Bearer ${token}`};
              // axios
              // .post(url + "/owner/vehicles", data)
              // .then((response) => {
              // }).catch((err) => {
              //   console.log(err.response);
              //   alert(err.response.data);
              //   this.setState({
              //     errorMessage: err.response.data,
              //   });
              // });
            }
            
            console.log(response.data.username);
            const resuserid = response.data.UserID;
            const resfirstname = response.data.FirstName;
            const resemail = response.data.Email;
            const resprofilepic = response.data.ProfilePicture;
            sessionStorage.setItem('userid', resuserid);
            sessionStorage.setItem('username', resfirstname);
            sessionStorage.setItem('useremail', resemail);
            sessionStorage.setItem('profilepic', resprofilepic);
            const redirectVar1 = <Redirect to='/dashboard' />;
            this.setState({ redirecttohome: redirectVar1 });
          } else {
            this.setState({
              redirecttohome: null,
            });
          }
        })
        .catch((err) => {
          console.log(err.response);
          alert(err.response.data);
          this.setState({
            errorMessage: err.response.data,
          });
        });
    }
  };

  render() {
    let redirectVar = null;
    if (cookie.load('cookie')) {
      redirectVar = <Redirect to='/dashboard' />;
    }
    const { firstnameerrors, emailerrors, passworderrors, userrole } =
      this.state;
    const { redirecttohome } = this.state;
    return (
      <form>
        <div>
          <Navheader />
          <div className='container'>
            {redirectVar}
            {redirecttohome}
            <div className='signup-form'>
              <div className='main-div' style = {{borderRadius:"15px", background:"#eeeeee"}}>
                <div className='panel' style = {{width: "106%", marginLeft: "-5%", borderRadius: "12px"}}>
                  <h2>WELCOME TO AUTONOMOUS CAR RENTAL SERVICES!</h2>
                  <br />
                  <br />
                </div>
                <div className='form-group'>
                  <h3 style = {{}}>Introduce Yourself</h3>
                  <br />
                  <br />
                  <label htmlFor='username' style = {{}}>
                    Hi there! <br />
                    My First name is
                    <input
                      type='text'
                      onChange={this.firstnameChangeHandler}
                      className='form-control'
                      name='firstname'
                      placeholder='First Name'
                      required
                      formNoValidate
                    />
                  </label>
                  <br />
                  {firstnameerrors && (
                    <span className='errmsg' style={{ color: 'maroon' }}>
                      {' '}
                      {firstnameerrors}{' '}
                    </span>
                  )}
                  <label htmlFor='username' style = {{}}>
                    My Last Name is
                    <input
                      type='text'
                      onChange={this.lastnameChangeHandler}
                      className='form-control'
                      name='lastname'
                      placeholder='Last Name'
                      required
                      formNoValidate
                    />
                  </label>
                  <br />

                 
                </div>
                <div className='form-group'>
                  <label htmlFor='username'>
                    Here’s my email address:
                    <input
                      type='text'
                      onChange={this.emailChangeHandler}
                      className='form-control'
                      name='email'
                      placeholder='Email Address'
                      required
                      formNoValidate
                    />
                  </label>
                  <br />
                  {emailerrors && (
                    <span className='errmsg' style={{ color: 'maroon' }}>
                      {' '}
                      {emailerrors}{' '}
                    </span>
                  )}
                </div>
                <div className='form-group'>
                  <label htmlFor='username'>
                    And here’s my password:
                    <input
                      type='password'
                      onChange={this.passwordChangeHandler}
                      className='form-control'
                      name='password'
                      placeholder='Password'
                      required
                      formNoValidate
                    />
                  </label>
                  <br />

                  {passworderrors && (
                    <span className='errmsg' style={{ color: 'maroon' }}>
                      {' '}
                      {passworderrors}{' '}
                    </span>
                  )}
                  <br />
                
                  <Form.Group controlId='userrole'>
                    <Form.Label>Here's my role</Form.Label>
                    <Form.Control
                      as='select'
                      value={userrole}
                      placeholder={userrole}
                      onChange={this.userroleChangeHandler}
                      style = {{marginLeft: "15%", width: "71%"}}
                    >
                      <option value='Customer'>User</option>
                      <option value='Car Owner'>Car Owner</option>
                      <option value='System Administrator'>
                        System Administrator
                      </option>
                    </Form.Control>                   
                  </Form.Group>
                  <div id = "divOwnerFields" style = {{display: "none"}}>
                  <label>Your Car No.</label><br/>
                   <input type = "text" id = "txtCarNo" placeholder = "Car No." onChange={this.carNoChangeHandler}></input><br/>
                   <label>Your Car Color</label><br/>
                  <input type = "text" id = "txtCarNo" placeholder = "Car Color" onChange={this.carColorChangeHandler}></input>
                  <br />
                  <label>Select your Car Type</label><br/>
                  <input type = "text" id = "txtCarNo" placeholder = "Car Type" onChange={this.carTypeChangeHandler}></input>
                  </div>
                </div>
                <button
                  type='submit'
                  onClick={this.submitsignup}
                  className='Signup-default'
                  formNoValidate
                >
                  Sign Up
                </button>
              </div>
            </div>
          </div>
        </div>
      </form>
    );
  }
}
// export Signup Component
export default Signup;
