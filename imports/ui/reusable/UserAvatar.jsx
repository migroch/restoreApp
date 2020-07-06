// userAvatar.jsx
// User avatar component
import React, { Component } from 'react';
import Blaze from 'meteor/gadicc:blaze-react-component';
import { Avatar } from  'antd/dist/antd.min.js';

import ReactDOM from 'react-dom';

export default class UserAvatar extends Component {
  constructor(props) {
    super(props);

    this.state = {
      image: true,
    };
  }
  
  render() {
    // Render a modal with the placeholder container that will be filled with the Blaze atForm template
    let {user, size, shape, className, initials} = this.props;
    
    if (this.state.image){
      return(
	<div>
	  <Blaze template="avatar" user={user} size={size} shape={shape} class={className} initials={initials} />
	</div>
      )
    } else {
      let sizes = {"large":80, "small":30, "extra-small":20}
      size ? size = sizes[size] : 50;
      return(
	<div>
	  <Avatar size={size}  className={className} style={{backgroundColor: user.color}}>{user.profile.initials}</Avatar>
	</div>
      )
    } 
  }

  componentDidMount(){
    let image = $(".avatar-image").attr('src');
    if (this.state.image != image) this.setState({image: image});
  }
  
  componentDidUpdate(){
    let image = $(".avatar-image").attr('src');
    if (this.state.image != image) this.setState({image: image});
  }
    
}
