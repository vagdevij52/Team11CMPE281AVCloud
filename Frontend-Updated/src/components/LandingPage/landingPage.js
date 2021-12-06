import React, { Component } from 'react';
import { Image } from 'react-bootstrap';
import Navheader from '../Navbar/navbar';
import './landingpage.css';

class LandingPage extends Component {
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
       
        <div className='landing' style = {{marginTop: "-2%"}}>
          <Image
            className='landingpic'
            src='/LandingPage_pic.png'
            alt='landing page'
          />
        </div>
        <div class='text-on-image'>
          <h2>
            {' '}
            <b>Welcome to Autonomous Car Rental Services!</b>
          </h2>
        </div>
      </div>
    );
  }
}

export default LandingPage;
