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
    };

    // Bind the handlers to this class
    this.firstnameChangeHandler = this.firstnameChangeHandler.bind(this);
    this.lastnameChangeHandler = this.lastnameChangeHandler.bind(this);
    this.userroleChangeHandler = this.userroleChangeHandler.bind(this);
    this.emailChangeHandler = this.emailChangeHandler.bind(this);
    this.passwordChangeHandler = this.passwordChangeHandler.bind(this);
    this.submitsignup = this.submitsignup.bind(this);
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
      const { firstname, lastname, userrole, email, password } = this.state;
      const data = {
        firstname,
        lastname,
        userrole,
        email,
        encryptpassword: await bcrypt.hash(password, saltRounds),
      };
      console.log(data);
      // set the with credentials to true
      axios.defaults.withCredentials = true;
      // make a post request with the user data
      axios
        .post('http://localhost:3001/signup', data)
        .then((response) => {
          console.log('Status Code : ', response.status);
          if (response.status === 200) {
            console.log(response.data);
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
              <div className='main-div'>
                <div className='panel'>
                  <h2>WELCOME TO AUTONOMOUS CAR RENTAL SERVICES!</h2>
                  <br />
                  <br />
                </div>
                <div className='form-group'>
                  <h3>Introduce Yourself</h3>
                  <br />
                  <br />
                  <label htmlFor='username'>
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
                  <label htmlFor='username'>
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
                  <br />
                  <Form.Group controlId='userrole'>
                    <Form.Label>Here's my role</Form.Label>
                    <Form.Control
                      as='select'
                      value={userrole}
                      placeholder={userrole}
                      onChange={this.userroleChangeHandler}
                    >
                      <option value='Customer'>Customer</option>
                      <option value='Car Owner'>Car Owner</option>
                      <option value='System Administrator'>
                        System Administrator
                      </option>
                    </Form.Control>
                  </Form.Group>
                  <br />
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
