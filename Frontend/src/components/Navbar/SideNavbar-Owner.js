import React, { Component } from 'react';
import { Image } from 'react-bootstrap';



class HomePage extends Component {
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
        
        <div style = {{height:"100vh", width:"14%", float:"left", border:"2px solid", marginTop:"2px solid", background:"#034672", marginTop:"-22px", color:"white"}}>Heyy SIdeNav</div>       
        </div>
    );
  }
}

export default HomePage;
