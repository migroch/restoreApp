// user-setup.js
// Initialize custom user fields and roles

import roles_data from '../../data/roles_data.js';

Accounts.onCreateUser((options, user)=>{
    let email;
    let verified_email;
    user._id = Random.id();
    user.color = '#'+Random.hexString(6);

      if (options.profile) {
	user.profile = options.profile;
    }
    
    // set email and verified_email to top fields 
    if (user.services.google) {
	console.log(user.services.google);
	email = user.services.google.email;
	verified_email = user.services.google.verified_email;
	user.profile.picture = user.services.google.picture;
	user.profile.family_name =  user.services.google.family_name;	
    } else {
	email = user.emails[0].address;
	verified_email = user.emails[0].verified;
    }

    user.email = email;
    user.verified_email = verified_email;

    user.profile.initials =  user.profile.name[0];
    if (user.profile.family_name){
	user.profile.initials = user.profile.name[0]+user.profile.family_name[0] ;
    } else if(user.profile.name.split(' ').length > 1)  {
	user.profile.lastName = user.profile.name.split(' ')[1];
	user.profile.initials = user.profile.name[0]+user.profile.lastName[0] ;
    }
      
    // Set County 
    user.county = 'Santa Cruz County';  // At the moment all our users are from SC County
    
    // Get district from email domain
    let district_roleskey = Object.keys(roles_data).filter((role)=>{
	let check =  roles_data[role].domains.includes(email.split('@')[1]) ;
	return check;
    });
    // Set district
    if (district_roleskey.length){
	user.district = roles_data[district_roleskey[0]].displayName;
    } else {
	user.district = 'Unknown';  // Not a recognized district email domain
    } 

    // Set schools (will have to be added by user at account creation)

    if (user.profile.School) {
	user.schools =  [{name:user.profile.School, type:null}];
    } else {
	user.schools =  [{name:" ", type:null}];
    }
    
    // Array of objects with form [{name:schoolname, type:schooltype}]
    if (email == 'dummy1@pvusd.net') user.schools = [{name:"Watsonville High", type:"High School"}];
    if (email == 'dummy2@santacruzcoe.org') user.schools = [{name:"Special Ed", type:"Special Ed Program"}];
    if (email == 'dummy3@scottsvalleyusd.org') user.schools = [{name:"Scotts Valley High School", type:"High School"}];
    

    let roles = Object.keys(roles_data).filter((role)=>{
	let check = roles_data[role].emails.includes(email) || roles_data[role].domains.includes(email.split('@')[1]) ;
	return check;
    });
    
    roles.forEach((role)=>{
	Roles.addUsersToRoles(user._id, role);
    });
    
    return user;
});
