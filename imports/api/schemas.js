//schemas.js
// Define data schemas

import SimpleSchema from 'simpl-schema';

const Schemas = {};

// Scenario
Schemas.scenario = new SimpleSchema({
    scenario:{
	type: String,
	allowedValues:['High Restrictions', 'Medium Restrictions', 'Low Restrictions']
    }
});

// Dimension
Schemas.dimension = new SimpleSchema({
    dimension:{
	type: String,
	allowedValues:['Communication', 'Data/Technology', 'PD/Training', 'Human Resources', 'Policy/Governance', 'Finances/Resources'  ]
    }
});

// Guidance Type
Schemas.guidancetype = new SimpleSchema({
    guidanceType:{
	type: String,
	allowedValues:['Assumptions', 'Actions', 'Resources', 'Questions', 'Considerations']
    }
});

// Plans
Schemas.plans = new SimpleSchema({
    title: String,
    scenario: Schemas.scenario,
    planItems: [SimpleSchema.oneOf(String, SimpleSchema.Integer)]
});

// Plan Items
Schemas.planitems = new SimpleSchema({
    // we can get categories from subcategories, categories may be removed in the future
    categories: [SimpleSchema.oneOf(String, SimpleSchema.Integer)], 
    subcategories: [SimpleSchema.oneOf(String, SimpleSchema.Integer)],
    owner:SimpleSchema.oneOf(String, SimpleSchema.Integer),
    dimension: Schemas.dimension,
    item: Object,
    'item.text': String,
    'item.html': {type: String, optional: true}
});

// Guidance Items
Schemas.guidanceitems = new SimpleSchema({
    subcategories: [SimpleSchema.oneOf(String, SimpleSchema.Integer)],
    scenarios:[Schemas.scenario],
    dimensions:Schemas.dimension,
    source: String,
    location_in_source: String,
    type: Schemas.guidancetype,
    item: Object,
    'item.text': String,
    'item.html': {type: String, optional: true}
});

// Categories
Schemas.categories = new SimpleSchema({
    name: String
});

// Subcategories
Schemas.subcategories = new SimpleSchema({
    parent_category: String,
    name: String,
    group: {type:String, optional:true}
});

// Menu Items
Schemas.menuitems = new SimpleSchema({
    key: String,
    title: String,
    route: String
});

export default Schemas;
