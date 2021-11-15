import React, { Component } from 'react';
import '../../App.css';
import axios from 'axios';
import cookie from 'react-cookies';
import { Redirect } from 'react-router';
import Navheader from '../Navbar/navbar';
import '../Navbar/navbar.css';
import { url } from '../Constants';

// Define a Login Component
class Login extends Component {
  // call the constructor method
  constructor(props) {
    // Call the constrictor of Super class i.e The Component
    super(props);
    // maintain the state required for this component
    this.state = {
      email: '',
      password: '',
    };
    // Bind the handlers to this class
    this.emailChangeHandler = this.emailChangeHandler.bind(this);
    this.passwordChangeHandler = this.passwordChangeHandler.bind(this);
    this.submitLogin = this.submitLogin.bind(this);
  }

  componentWillMount() {
    this.setState({
      redirecttohome: null,
    });
  }

  // username change handler to update state variable with the text entered by the user
  emailChangeHandler = (e) => {
    this.setState({
      email: e.target.value,
    });
  };

  // password change handler to update state variable with the text entered by the user
  passwordChangeHandler = (e) => {
    this.setState({
      password: e.target.value,
    });
  };

  // submit Login handler to send a request to the node backend
  submitLogin = async (e) => {
    // prevent page from refresh
    e.preventDefault();

    const { email, password } = this.state;
    if (email === '') {
      alert('Please enter email address');
      this.setState({
        errorMessage1: 'Please enter email address!',
      });
      return;
    }
    if (password === '') {
      alert('Please enter a password');
      this.setState({
        errorMessage2: 'Please enter a password!',
      });
      return;
    }
    const data = {
      email,
      password,
    };
    this.setState({
      errorMessage1: '',
    });

    if(data.email == "user1@gmail.com")
    {
      document.cookie = 'cookie=dummy';
      sessionStorage.setItem('userid', '12345');
          sessionStorage.setItem('username', 'user1');
          sessionStorage.setItem('useremail', 'user1@gmail.com');
      this.props.history.push("/home-user");

          //sessionStorage.setItem('profilepic', resprofilepic);
          //alert(response.data.token.accessToken);
         // sessionStorage.setItem('auth', response.data.token.accessToken);
    }
    else if(data.email == "admin1@gmail.com")
    {
      sessionStorage.setItem('userid', '12345');
          sessionStorage.setItem('username', 'admin1');
          sessionStorage.setItem('useremail', 'admin11@gmail.com');
      document.cookie = 'cookie=dummy';
      this.props.history.push("/home-admin");
    }
    else if(data.email == "owner1@gmail.com")
    {
      sessionStorage.setItem('userid', '12345');
          sessionStorage.setItem('username', 'owner1');
          sessionStorage.setItem('useremail', 'owner1@gmail.com');
      document.cookie = 'cookie=dummy';
      this.props.history.push("/home-owner");
    }
    else
    {
      alert("Please enter valid email and password");
      return;
    }
    // set the with credentials to true
    // axios.defaults.withCredentials = true;
    // // make a post request with the user data
    // axios
    //   .post(url + '/auth/login', data)
    //   .then((response) => {
    //     console.log('Status Code : ', response.status);
    //     console.log('response ', response.data);
    //     if (response.status === 200) {
    //       console.log(response.data);
    //       const resuserid = response.data.UserID;
    //       const resfirstname = response.data.FirstName;
    //       const resemail = response.data.Email;
    //       const resprofilepic = response.data.ProfilePicture;
    //       sessionStorage.setItem('userid', resuserid);
    //       sessionStorage.setItem('username', resfirstname);
    //       sessionStorage.setItem('useremail', resemail);
    //       sessionStorage.setItem('profilepic', resprofilepic);
    //       alert(response.data.token.accessToken);
    //       sessionStorage.setItem('auth', response.data.token.accessToken);
    //       const redirectVar1 = <Redirect to='/dashboard' />;
    //       this.setState({
    //         redirecttohome: redirectVar1,
    //       });
    //     } else {
    //       console.log(response.data);
    //       alert(response.data);
    //       this.setState({
    //         redirecttohome: null,
    //       });
    //     }
    //   })
    //   .catch((err) => {
    //     console.log(err.response.data);
    //     alert(err.response.data);
    //     this.setState({
    //       errorMessage: err.response.data,
    //     });
    //   });
  };

  render() {
    let redirectVar = null;
    if (cookie.load('cookie')) {
      redirectVar = <Redirect to='/dashboard' />;
    }
    const { errorMessage, errorMessage1 } = this.state;
    const { redirecttohome } = this.state;
    return (
      <div>
        {redirectVar}
        {redirecttohome}
        <Navheader />
        <div className='container'>
          <div className='login-form'>
            <div className='main-div' style = {{borderRadius: "15px"}}>
              <div className='panel' style = {{width: "107%", borderRadius: "15px", marginLeft: "-5%"}}>
                <h2 style = {{paddingTop: "12%", paddingBottom: "6%"}}>WELCOME TO AUTONOMOUS CAR RENTAL SERVICES!</h2>
              </div>
              <div className='form-group'>
                <label htmlFor='email'>
                  Email
                  <input
                    type='text'
                    className='form-control'
                    name='email'
                    id='email'
                    placeholder='Email'
                    onChange={this.emailChangeHandler}
                    required
                    formNoValidate
                    style = {{borderRadius: "10px"}}
                  />
                </label>
                <p className='errmsg' style={{ color: 'maroon' }}>
                  {' '}
                  {errorMessage1}{' '}
                </p>
              </div>
              <div className='form-group'>
                <label htmlFor='email'>
                  Password
                  <input
                    type='password'
                    className='form-control'
                    name='password'
                    id='password'
                    placeholder='Password'
                    onChange={this.passwordChangeHandler}
                    required
                    formNoValidate
                    style = {{borderRadius: "10px"}}
                  />
                </label>
              </div>
              <button
                data-testid='login'
                type='submit'
                className='Signup-default '
                onClick={this.submitLogin}
                formNoValidate
              >
                Login
              </button>
              <p className='errmsg' style={{ color: 'maroon' }}>
                {' '}
                {errorMessage}{' '}
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
// export Login Component
export default Login;
