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
    
    this.id = this.props.user._id ?  this.props.user._id+'-'+Random.id() : this.props.user+'-'+Random.id();

    this.componentDidMount = this.componentDidMount.bind(this);
    this.componentDidUpdate = this.componentDidUpdate.bind(this);
  }
  
  render() {
    // Render a modal with the placeholder container that will be filled with the Blaze atForm template
    let {user, size, shape, className, initials} = this.props;

    if (!user.profile) user = Meteor.users.findOne(user);
  
    if (this.state.image){
      return(
	<div id={this.id} className="mt-auto mb-auto">
	  <Blaze  template="avatar" user={user} size={size} shape={shape} class={className} initials={initials} />
	</div>
      )
    } else {
      let sizes = {"large":80, "small":30, "extra-small":20}
      size ? size = sizes[size] : 50;
      return(
	<div id={this.id} className="mt-auto mb-auto">
	  <Avatar size={size} className={className} style={{backgroundColor: user.color}}>{user.profile.initials}</Avatar>
	</div>
      )
    } 
  }

  componentDidMount(){
    let image = $("#"+ this.id).find('img').attr('src');
    if (this.state.image != image) this.setState({image: image});
  }
  
  componentDidUpdate(){
    let image = $("#"+ this.id).find('img').attr('src');
    if (this.state.image != image) this.setState({image: image});
  }
    
}
