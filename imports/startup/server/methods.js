// methods.js
// Define Meteor methods
import { Meteor } from 'meteor/meteor';
import { check, Match } from 'meteor/check';
import { plans, planitems } from '../../api/collections';

Meteor.methods({
    'updateEmailVerified'(user){
	let email;
	let verified_email;

	if (user.services && user.services.google) {
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
	arg.createdtime = Date.now();
	arg.lastedittime = Date.now();
	const newPlan = plans.insert(arg);
	return newPlan;
    },
    'plans.copy'(id) {
	check(id, Match.OneOf(String, Mongo.ObjectID));
	const plan = plans.findOne(id);
	plan.title = plan.title + ' (Copy)';
	plan._id = undefined;
	plan.createdtime = Date.now();
	plan.lastedittime = Date.now();
	const newPlan = plans.insert(plan);
	return newPlan;
    },
    'plans.update'(arg) {
	const { id, title, scenario, planItemIds } = arg;
	const lastedittime =  Date.now();
	check(id, Match.OneOf(String, Mongo.ObjectID));
	plans.update(id, { $set: { scenario, title, planItemIds, lastedittime} });
    },
    'planItem.remove'({planId, planItemId}) {
	check(planId, Match.OneOf(String, Mongo.ObjectID));
	check(planItemId, Match.OneOf(String, Mongo.ObjectID));
	const plan = plans.findOne(planId);
	let planItemIds = plan.planItemIds;
	const index = planItemIds.indexOf(planItemId);
	if (index > -1) {
	    planItemIds.splice(index, 1);
	}
	const lastedittime =  Date.now();
	plans.update(planId, { $set: { planItemIds, lastedittime } });
    },
    'planItem.update'({planItemId, planItem}) {
	check(planItemId, Match.OneOf(String, Mongo.ObjectID));
	planItem.lastedittime = Date.now();
	planitems.update(planItemId, { $set: planItem });
		},
		//just create new planitem
		'planItem.create'(planItem) {
	planItem.createdtime = Date.now();
	planItem.lastedittime = Date.now();
	const newPlanItem = planitems.insert(planItem);
	return newPlanItem;
		},
		// 'planItems.create'(planItems) {
		// 	planItem.createdtime = Date.now();
		// 	planItem.lastedittime = Date.now();
		// 	const newPlanItem = planitems.insert(planItem);
		// 	return newPlanItem;
		// 		},
		//when add new planitem to Plan
    'planItem.add'({planId, planItem}) {
	check(planId, Match.OneOf(String, Mongo.ObjectID));
	planItem.createdtime = Date.now();
	planItem.lastedittime = Date.now();
	planitems.insert(planItem, function(err, newPlanItem){
	    const plan = plans.findOne(planId);
	    let planItemIds = [newPlanItem, ...plan.planItemIds];
	    const lastedittime =  Date.now();
	    plans.update(planId, { $set: { planItemIds, lastedittime } });
	});		
    },
});





