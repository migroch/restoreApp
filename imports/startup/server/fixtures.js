// fixtures.js
// Insert startup data from imports/data/

// Import Mongo collections
import { plans, planitems, guidanceitems, categories, subcategories, units, menuitems} from '../../api/collections.js';

// Import data
import dummyusers_data from  '../../data/dummyusers_data.js';
import roles_data from '../../data/roles_data.js';
import menuitems_data from '../../data/menuitems_data.js';
import sampleplanitems_data from '../../data/sampleplanitems_data.js';
import {categories_data, subcategories_data, units_data} from '../../data/initialmap_data.js';

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

    // Upsert categories_data into categories collection
    categories_data.forEach((category)=>{
	categories.update({name: category.name}, {$setOnInsert: category}, {upsert: true});
    });

    // Upsert subcategories_data into subcategories collection
    subcategories_data.forEach((subcategory)=>{
	subcategory.categoryId = categories.findOne({name: subcategory.categoryId})._id;
	subcategories.update({name: subcategory.name}, {$setOnInsert: subcategory}, {upsert: true});
    });

     // Upsert units_data into units collection
    units_data.forEach((unit)=>{
	unit.subcategoryId = subcategories.findOne({name: unit.subcategoryId})._id;
	units.update({name: unit.name}, {$setOnInsert: unit}, {upsert: true});
    });
    
    // Upsert sampleplanitems_data into planitmes collection
    sampleplanitems_data.forEach((planitem)=>{
	planitem.ownerId = Meteor.users.findOne({'profile.name': planitem.ownerId})._id;
	planitem.assignedToIds = planitem.assignedToIds.map((user)=>{
	    return Meteor.users.findOne({'profile.name': user})._id;
	});
	planitem.unitIds = planitem.unitIds.map((unit)=>{
	    return units.findOne({name: unit})._id;
	}); 
	planitems.update({'item.text': planitem.item.text}, {$setOnInsert: planitem}, {upsert: true});
    });

    // Generate sampleplans and upsert into plans collection
    let pitems = planitems.find({}).fetch();
    let sampleplans = [
	{
	    title: 'Sample Plan1',
	    scenario: {scenario: 'High Restrictions'},
	    planItemIds:[pitems[0]._id, pitems[1]._id,  pitems[2]._id] 
	},
	{
	    title: 'Sample Plan2',
	    scenario:  {scenario: 'Medium Restrictions'},
	    planItemIds:[pitems[0]._id,   pitems[2]._id] 
	},
	{
	    title: 'Sample Plan3',
	    scenario:  {scenario: 'Low Restrictions'},
	    planItemIds:[ pitems[1]._id ]  
	},
    ];
    sampleplans.forEach((plan)=>{
	plans.update({title: plan.title}, {$setOnInsert: plan}, {upsert: true});
    });
    
});

