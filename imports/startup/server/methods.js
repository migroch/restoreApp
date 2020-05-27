// methods.js
// Define Meteor methods

Meteor.methods({
    'updateEmailVerified'(user){
	let email;
	let verified_email;
	if (user.services) {
	    email = user.services.google.email;
	    verified_email = user.services.google.verified_email;
	} else {
	    email = user.emails[0].address;
	    verified_email = user.emails[0].verified;
	}
	Meteor.users.update(user._id, { $set: {
	    email: email,
	    verified_email: verified_email
	}});
    }
});



