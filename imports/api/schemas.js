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
	allowedValues:['Communication', 'Data/Technology', 'Professional Development', 'HR/Bargaining Units', 'Policy/Governance/Liability', 'Finances/Resources']
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
    scenario:  {type: String, allowedValues:['High Restrictions', 'Medium Restrictions', 'Low Restrictions']},
    planItemIds: [SimpleSchema.oneOf(String, SimpleSchema.Integer)]
});

// Plan Items
Schemas.planitems = new SimpleSchema({
    // we can get categories from subcategories, categories may be removed in the future
    unitIds: [SimpleSchema.oneOf(String, SimpleSchema.Integer)],
    ownerId: SimpleSchema.oneOf(String, SimpleSchema.Integer),
    assignedToIds:  { type: Array, optional: true},
    'assignedToIds.$': SimpleSchema.oneOf(String, SimpleSchema.Integer),
    dueDate: {type:Date, optional: true},
    dimension: {
        type: String,
        allowedValues:['Communication', 'Data/Technology', 'Professional Development', 'HR/Bargaining Units', 'Policy/Governance/Liability', 'Finances/Resources']
    },
    item: Object,
    'item.text': String,
    'item.delta': {type: Object, optional: true}   // A Quill Delta Object https://quilljs.com/docs/delta/
});

// Guidance Items
Schemas.guidanceitems = new SimpleSchema({
    unitIds: [SimpleSchema.oneOf(String, SimpleSchema.Integer)],
    dimension:[Schemas.dimension],
    source: String,
    location_in_source: String,
    type: Schemas.guidancetype,
    item: Object,
    'item.text': String,
    'item.delta': {type: Object, optional: true}   // A Quill Delta Object https://quilljs.com/docs/delta/
});

// Categories
Schemas.categories = new SimpleSchema({
    name: String
});

// Subcategories
Schemas.subcategories = new SimpleSchema({
    categoryId: SimpleSchema.oneOf(String, SimpleSchema.Integer),
    name: String,
});

// Units
Schemas.units = new SimpleSchema({
    subcategoryId: SimpleSchema.oneOf(String, SimpleSchema.Integer),
    name: String,
});

// Menu Items
Schemas.menuitems = new SimpleSchema({
    key: String,
    title: String,
    route: String
});

export default Schemas;
