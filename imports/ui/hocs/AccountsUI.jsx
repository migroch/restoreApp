import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { Template } from 'meteor/templating';
import { Blaze } from 'meteor/blaze';
import UserContext from '../context/user';
import {Google} from 'styled-icons/fa-brands/Google';
import GoogleButton from 'react-google-button'

const logoStyle = {
  width:'8em',
  height: 'auto'
}


export default class AccountsUIWrapper extends Component {
  static contextType = UserContext;

  atSocialButton = () =>{
    <button type="button" className="btn btn-light" id="at-google">Sign In/Register with <span><Google /></span></button>
  }
  
  componentDidMount() {
    // Use Meteor Blaze to render login form
    this.view = Blaze.render(Template.atForm,
           ReactDOM.findDOMNode(this.refs.container));
    if (this.props.isOpened)  $('#loginModal').modal('show');
    if (document.getElementById("at-google")) ReactDOM.render(<GoogleButton type="light" className="w-100"/>, document.getElementById("at-google"));
  }
  
  componentWillReceiveProps(nextProps, preProps) {
    if (nextProps.isOpened != preProps.isOpened) {
      if (nextProps.isOpened) 
      $('#loginModal').modal('show')
    }
  }
  
  componentDidUpdate() {
    
  }
  
  componentWillUnmount() {
    // Clean up Blaze view
    Blaze.remove(this.view);
  } 
  
  render() {
    
    // Render a modal with the placeholder container that will be filled with the Blaze atForm template
    return(
      <> 
      <div className="modal fade" id="loginModal" tabIndex="-1" role="dialog" aria-labelledby="loginModalLabel" aria-hidden="true">
	<div className="modal-dialog" role="document">
	  <div className="modal-content">
	    <div className="modal-header">
              <h5 className="modal-title" id="ModalLabel">Sign In  to RESTORE</h5>
              <button  type="button"  id="closeLoginModal" className="close" data-dismiss="modal" aria-label="Close" onClick={()=>this.context.setAuthModalState(false)}>
		<span aria-hidden="true">&times;</span>
              </button>
	    </div>
	    <div className="d-flex justify-content-center">
	      <img className="rounded-circle mt-4" style={logoStyle} alt="Santa Cruz COE RESTORE Logo" src="Restore_logoOnly.png"/>
	    </div>
	    <div className="modal-body">
              <span ref="container" />
	    </div>
	  </div>
	</div>
      </div>
      </>
      );
  }
}
