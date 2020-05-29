// user-setup.js
// Initialize custom user fields and roles
import roles_data from '../../data/roles_data.js';

Accounts.onCreateUser((options, user)=>{
    let email;
    let verified_email;
    user._id = Random.id();

    // set email and verified_email to top fields 
    if (user.services.google) {
	email = user.services.google.email;
	verified_email = user.services.google.verified_email;
    } else {
	email = user.emails[0].address;
	verified_email = user.emails[0].verified;
    }
    user.email = email;
    user.verified_email = verified_email;

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
    user.schools = []; // Array of objects with form [{name:schoolname, type:schooltype}]

    let roles = Object.keys(roles_data).filter((role)=>{
	let check = roles_data[role].emails.includes(email) || roles_data[role].domains.includes(email.split('@')[1]) ;
	return check;
    });
    
    roles.forEach((role)=>{
	Roles.addUsersToRoles(user._id, role);
    });

    if (options.profile) {
	user.profile = options.profile;
    }

    return user;
});
