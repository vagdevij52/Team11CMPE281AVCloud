import React, { Component } from 'react';
import { Route, Switch } from 'react-router-dom';
import Profilepage from './ProfilePage/profilePage';
import LandingPage from './LandingPage/landingPage';
import Login from './Login/login';
import Signup from './Signup/signup';

//<Route path="/" component={Navbar}/>
//<Route path="/login" component={Login}/>

class Main extends Component {
  render() {
    return (
      <div>
        {/*Render Different Component based on Route*/}
        <Switch>
          <Route exact path='/' component={LandingPage} />
          <Route path='/signup' component={Signup} />
          <Route path='/login' component={Login} />
          <Route path='/profile' component={Profilepage} />
        </Switch>
      </div>
    );
  }
}

export default Main;
