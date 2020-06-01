// collections.js
// Create and export mongo collections

import { Mongo } from 'meteor/mongo';
import Schemas from './schemas.js';

let plans = new Mongo.Collection('plans');
plans.schema = Schemas.plans;
plans.attachSchema(Schemas.plans);

let planitems = new Mongo.Collection('planitems');
planitems.schema = Schemas.planitems;
planitems.attachSchema(Schemas.planitems);

let guidanceitems = new Mongo.Collection('guidanceitems');
guidanceitems.schema = Schemas.guidanceitems;
guidanceitems.attachSchema(Schemas.guidanceitems);

let categories = new Mongo.Collection('categories');
categories.schema = Schemas.categories;
categories.attachSchema(Schemas.categories);

let subcategories = new Mongo.Collection('subcategories');
subcategories.schema = Schemas.subcategories;
subcategories.attachSchema(Schemas.subcategories);

let menuitems = new Mongo.Collection('menuitems');
menuitems.schema = Schemas.menuitems;
menuitems.attachSchema(Schemas.menuitems);

// if (Meteor.isServer) {
//   // This code only runs on the server
//   // Only publish tasks that are public or belong to the current user
//   Meteor.publish('plans', function plansPublication() {
//     return plans.find({});
//   })
// }

export { plans, planitems, guidanceitems, categories, subcategories, menuitems};
