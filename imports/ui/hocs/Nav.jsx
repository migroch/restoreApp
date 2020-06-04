// Nav.jsx
// Navigation bar component

import React, { Component } from 'react';
import { withTracker } from 'meteor/react-meteor-data';
import {menuitems} from '../../api/collections.js';

import styled from 'styled-components'
import {LogIn} from 'styled-icons/feather/LogIn';
import {LogOut} from 'styled-icons/feather/LogOut';
import {User} from 'styled-icons/feather/User';
import {Menu} from 'styled-icons/material/Menu';
import AccountsUIWrapper from './AccountsUI.jsx';
import { Link, withRouter } from 'react-router-dom';


const styles = {
  logoStyle:{
    width:'10em',
    height: 'auto'
  },
  navToggler:{
    color:'#2176BB',
    border:'none'
  },
  subMenus:{
    border: 'none',
    fontSize: 'smaller',
    height: 'fit-content',
    padding: 0,
    position: 'absolute',
  }
}

class Nav extends Component {
  constructor(props) {
    super(props);

    this.state = {
      inview: true,
    };

    this.handleLinkClick = this.handleLinkClick.bind(this);
    this.scrollSpy = this.scrollSpy.bind(this);
    this.activateScrollSpy = this.activateScrollSpy.bind(this);
  }
  
  render() {
    const { user, loading, menuitemsExists, menuitems } = this.props;
    const { history: { location: { pathname }} } = this.props;
    
    if(loading){
      return(
        <div className="d-flex justify-content-center text-primary">
          <div className="spinner-border" role="status">
            <span className="sr-only">Loading...</span>
          </div>
        </div>
      )
    }else{
      
      const signIO = this.signIOButton(user) ;
      const menuItems = this.makeMenu(menuitems, pathname);
      
      return (
	<div>
	  <nav className="navbar navbar-expand-lg navbar-light  fixed-top" style={{backgroundColor: '#F2F2F2'}}>
	    
	    {/*Logo & Brand*/}
	    <a  className="navbar-brand" href="#">
	      <img className=" " style={styles.logoStyle} alt="Santa Cruz COE RESTORE Logo" src="Restore_logo.png"/>
	      {/* <div className="d-inline-block text-center align-middle pl-2">
	      <h5 className="m-0" style={{color:'#2176BB'}}>RESTORE</h5>
	      <p> className="m-0" style={{color:'#2AAAE1'}}><small>Plans to Reopen Schools</small></p>
	      <p> className="m-0" style={{color:'#00a6a3'}}><small>of Santa Cruz County</small></p>
	      </div> */}
	    </a>

	    {/*Collapse Toggler Button*/}
	    <button className="navbar-toggler btn text-primary" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation" style={styles.navToggler}>
	      <Menu size="50" />
	    </button>

	    {/*Menus*/}
	    <div className="collapse navbar-collapse text-right" id="navbarSupportedContent">

	      {/*Left Menu*/}
	      <ul id="LeftNavMenu" className="navbar-nav nav-pills d-flex w-100">
		  {menuItems}
	      </ul> 
	      
	      {/*Right Menu*/}
	      <ul className="navbar-nav ml-auto">
		{signIO}
	      </ul>
	    </div>
	  </nav>

	  <AccountsUIWrapper />
      
	</div>
      );
    }
  }

  makeMenu(menuitems, pathname){
    return(
      menuitems.map( (item, index) =>{
	let active = (item.route == pathname) ? 'active' : ''
	let invisible = (index == 0) ? '' : 'invisible'
	let CustomLink
	if(item.externalLink){
	  CustomLink = (<a href={item.externalLink} id={item.key+'Link'} className={"nav-link "} target="_blank">{item.title}</a>)
	}
	else {
    // Link = (<a href={"#"+item.key} id={item.key+'Link'} className={"nav-link "+active}  onClick={this.handleLinkClick}>{item.title}</a>)
    CustomLink = (<Link to={item.route} id={item.key+'Link'} className={"nav-link "+active}>{item.title}</Link>)
	}
	return(
	  <li key={index} className="nav-item">
	    {CustomLink}
	    <div id={item.key+"SubMenu"} className={"submenu d-none d-lg-inline-flex bg-transparent "+invisible} style={styles.subMenus}>
	    </div>
	  </li>
	)
      }));
  }  

  
  handleLinkClick(event){
    event.preventDefault();
    let target = event.target;
    let offset = $($(target).attr('href')).offset();
    let offsetTop =  offset.top-$(".navbar").outerHeight();
    $('html, body').animate({
      scrollTop: offsetTop,
      //scrollLeft: offset.left,
    }, 700);
    this.setActiveLink(target);
  }

  setActiveLink(target){
    history.pushState({}, '', $(target)[0].href);
    $('.nav-link').removeClass('active');
    $('.nav-link').blur();
    $(target).addClass('active');
    $(target).siblings().removeClass('invisible');
    window.dispatchEvent(new Event('resize'));
  }

  activateScrollSpy(){
    const NavThis = this
    $(window).bind('scroll', ()=>{
      NavThis.scrollSpy($('.scrollspy'));
    });
  }
  
  scrollSpy(spyelements){
    let topDistance = spyelements.map((index, elem) => {
      let windowHeight = window.innerHeight;
      let navbarHeight = $('.navbar').outerHeight();
      let windowTop = $(window).scrollTop();
      let elemHeight = $(elem).outerHeight();
      let elemTop = $(elem).offset().top;
      //let elemBottom = elemTop + $(elem).outerHeight();
      return Math.abs(windowTop + navbarHeight - elemTop);
    }).get();
    let minDistanceElem = spyelements[topDistance.indexOf(Math.min(...topDistance))]
    let id = $(minDistanceElem).attr('id');
    let navLink = $('a[href="#' + id + '"]');
    this.setActiveLink(navLink);
  }
  
  signIOButton(user){
    if (user) {
      $('#closeLoginModal').click();
      let email;
      if (user.verified_email){
	email = <p className="m-0" style={{"color":"#00a6a3"}}>{user.email} (Verified)</p>
      } else {
	email = <p className="m-0 text-danger">{user.email} (Not verified)</p>
      }
      let roles = Roles.getRolesForUser(user._id);
      if (roles.includes('All')) roles = ['All'];
      let roleList = roles.map((role, index)=><li key={index} className="list-inline-item"  style={{"color":"#00a6a3"}}>{role}</li>)
      return(	
	     <li className="nav-item" style={{"width":"10em"}}>
	  
	       <a href="#" role="button" id="ProfileButton" className="nav-link dropdown-toggle text-center d-table align-middle p-0 m-0 ml-auto" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
		 <User size="50"/>
		 <br />
		 {user.profile.name}
	       </a>

	       <div className="dropdown-menu dropdown-menu-right" aria-labelledby="ProfileButton">
		 <div className="px-2 pb-2">
		   <p className="m-0">Email:</p>
		   {email}
		 </div>
		 <div className="px-2 pb-2">
		   <p className="m-0">Permissions:</p>
		   <ul className="list-inline">{roleList}</ul>
		 </div>
		 <a href="" id="signIOButton" role="button" className="btn  px-2 text-center dropdown-item" onClick={AccountsTemplates.logout}>
		   <span className="p-0 m-0">Sign Out </span>
		   <LogOut size="30" />
		 </a>
	       </div>
	       
	     </li> 
      )
    } else {
      return(
	<li className="nav-item">
	  <button id="signIOButton" type="button" className="btn text-primary"  data-toggle="modal" data-target="#loginModal" onClick={this.handleSignInClick}>
	    <LogIn size="40" />
	    <p className="m-0">Sign In</p>
	  </button>
	</li>
      )
    }
  }

  handleSignInClick(){
    AccountsTemplates.setState('signIn')
  }
  
  componentDidMount(){
   
  }

  componentDidUpdate(){
    if (!this.props.loading){

      let navheight = $(".navbar").outerHeight();
      $("body").css("padding-top", navheight);
      this.activateScrollSpy();
      window.dispatchEvent(new Event('resize')); 

      $('[data-toggle="tooltip"]').tooltip();
      
    }
  }

  
}

Nav = withTracker(() => {
  const user = Meteor.user();
  const menuitemsHandle = Meteor.subscribe('menuitems');
  const loading = !menuitemsHandle.ready();
  const menuitems_fetch = menuitems.find({}, { sort: { createdAt: -1 } }).fetch();
  const menuitemsExists = !loading && !!menuitems;
  return {
    user,
    loading,
    menuitemsExists,   
    menuitems: menuitemsExists ? menuitems_fetch : {}
  };
})(Nav);
export default withRouter(Nav)


