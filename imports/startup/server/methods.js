// methods.js
// Define Meteor methods
import { Meteor } from 'meteor/meteor';
import { check, Match } from 'meteor/check';
import { plans } from '../../api/collections';

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
	},

    // 'plans.insert'(text) {
    //   check(text, String);
    //   // let's make sure the user is logged in before inserting a pllan
    //   plans.insert({
    //     text,
    //     createdAt: new Date(),
    //     owner: this.userId,
    //     username: Meteor.users.findOne(this.userId).username,
    //   });
    // },
	'plans.remove'(id) {
		check(id, Match.OneOf(String, Mongo.ObjectID));
		
		const plan = plans.findOne(id);
		plans.remove(id);
	},
	'plans.add'(arg) {
		plans.insert(arg);
	},
	'plans.update'(arg) {
		const { id, title, scenario } = arg;
		check(id, Match.OneOf(String, Mongo.ObjectID));
		plans.update(id, { $set: { scenario, title} });
	},
});





