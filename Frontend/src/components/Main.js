import React, { Component } from 'react';
import { Route, Switch } from 'react-router-dom';
import Profilepage from './ProfilePage/profilePage';
import LandingPage from './LandingPage/landingPage';
import Login from './Login/login';
import Signup from './Signup/signup';
import HomePageOwner from './Home/Home-Owner';
import HomePageUser from './Home/Home-User';
import UserTransactions from './UserTransactions/UserTransactions'
import HomePageAdmin from './Home/Home-Admin'
import UserTripDetails from './UserTripDetails/UserTripDetails';
import ProfileInfo from './ProfileInfo/ProfileInfo';

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
          <Route path='/home-owner' component={HomePageOwner} />
          <Route path='/home-user' component={HomePageUser} />
          <Route path='/userTransactions' component={UserTransactions} />
          <Route path='/home-admin' component={HomePageAdmin} />
          <Route path='/userTripDetails' component={UserTripDetails} />
          <Route path='/profileInfo' component={ProfileInfo} />
        </Switch>
      </div>
    );
  }
}

export default Main;
