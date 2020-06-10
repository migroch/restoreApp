// collection-links.js
// Define grapher collection links

import { plans, planitems, guidanceitems, categories, subcategories, units } from './collections.js';

export default addCollectionLinks = function(){

    console.log('Adding grapher links to collections');
    
    // Plans Links
    plans.addLinks({
	'planItems': {
	    type: 'many',
	    collection: planitems,
	    field: 'planItemIds',
	}
    });

    // Plan Items Links
    planitems.addLinks({
	'owner': {
	    type: 'one',
	    collection: Meteor.users,
	    field: 'ownerId',
	},
	'assignedTo':{
	    type: 'many',
	    collection: Meteor.users,
	    field: 'assignedToIds',
	},
	'units':{
	    type: 'many',
	    collection: units,
	    field: 'unitIds',
	},
	'plan':{
	    collection: plans,
            inversedBy: 'planItems'
	},
    });

    // Users Links
    Meteor.users.addLinks({
	'planItems': {
            collection: planitems,
            inversedBy: 'owner'
	},
	'assignedPlanItems':{
	    collection: planitems,
            inversedBy: 'assignedTo'
	}
    });

    // Guidance Items Links
    guidanceitems.addLinks({
	'units': {
	    type: 'many',
	    collection: units,
	    field: 'unitIds',
	},
    });

    // Units Links
    units.addLinks({
	'subcategory': {
	    type: 'one',
	    collection: subcategories,
	    field: 'subcategoryId',
	},
	'planItems':{
	    collection: planitems,
            inversedBy: 'units'
	},
	'guidanceItems':{
	    collection: guidanceitems,
            inversedBy: 'units'
	},
	
    });

    // Subcategories Links
    subcategories.addLinks({
	'category': {
	    type: 'one',
	    collection: categories,
	    field: 'categoryId',
	},
	'units':{
	    collection: units,
            inversedBy: 'subcategory'
	},
    });

    // Categories Links
    categories.addLinks({
	'subcategories':{
	    collection: subcategories,
            inversedBy: 'category'
	},
    });

};
