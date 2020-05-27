// collections.js
// Create and export mongo collections

import { Mongo } from 'meteor/mongo';

export let menuitems = new Mongo.Collection('menuitems');
