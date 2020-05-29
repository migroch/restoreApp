// fixtures.js
// Insert startup data from imports/data/

// Import Mongo collections
import { plans, planitems, guidanceitems, categories, subcategories, menuitems} from '../../api/collections.js';

// Import data
import dummyusers_data from  '../../data/dummyusers_data.js';
import roles_data from '../../data/roles_data.js';
import menuitems_data from '../../data/menuitems_data.js';
import sampleplanitems_data from '../../data/sampleplanitems_data.js';

// Insert data into colllections
Meteor.startup(() => {

    // Create roles based on the permissions data object
    Object.keys(roles_data).forEach((key)=>{
	Roles.createRole(key, {unlessExists: true});
    });

    // Create dummy users
    dummyusers_data.forEach((dummy)=>{
	if (Meteor.users.find({"email": dummy.email}).count() == 0){
	    Accounts.createUser({
		email: dummy.email,
		password: dummy.password,
		profile:{name: dummy.name}
	    });
	}
    });
   
     // Upsert menuitems_data into menuitems collection
    menuitems_data.forEach((menuitem)=>{
	menuitems.update({key: menuitem.key}, {$setOnInsert: menuitem}, {upsert: true});
    });

    // Upsert sampleplanitems_data into planitmes collection
    sampleplanitems_data.forEach((planitem)=>{
	planitem.owner = Meteor.users.findOne({'profile.name': planitem.owner})._id;
	planitems.update({owner: planitem.owner}, {$setOnInsert: planitem}, {upsert: true});
    });

    // Generate sampleplans and upsert into plans collection
    let pitems = planitems.find({}).fetch();
    let sampleplans = [
	{
	    title: 'Sample Plan1',
	    scenario: {scenario: 'High Restrictions'},
	    planItems:[pitems[0]._id, pitems[1]._id,  pitems[2]._id] 
	},
	{
	    title: 'Sample Plan2',
	    scenario:  {scenario: 'Medium Restrictions'},
	    planItems:[pitems[0]._id,   pitems[2]._id] 
	},
	{
	    title: 'Sample Plan3',
	    scenario:  {scenario: 'Low Restrictions'},
	    planItems:[ pitems[1]._id ]  
	},
    ];
    sampleplans.forEach((plan)=>{
	plans.update({title: plan.title}, {$setOnInsert: plan}, {upsert: true});
    });
    
});

