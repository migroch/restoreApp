// fixtures.js
// Insert startup data from imports/data/

// Import Mongo collections
import {menuitems} from '../../api/collections.js';

// Import data 
import menuitems_data from '../../data/menuitems_data.js';
import roles_data from '../../data/roles_data.js';

// Insert data into colllections
Meteor.startup(() => {
    // Upsert menuitems_data into menuitems  collection
    menuitems_data.forEach((menuitem)=>{
	menuitems.upsert({key: menuitem.key}, menuitem, {upsert: true});
    });

    // Create roles based on the permissions data object
    Object.keys(roles_data).forEach((key)=>{
	Roles.createRole(key, {unlessExists: true});
    });
    
});

