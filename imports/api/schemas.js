//schemas.js
// Define data schemas

import SimpleSchema from 'simpl-schema';

const Schemas = {};

// Scenarios
Schemas.scenarios = ['High Restrictions', 'Medium Restrictions', 'Low Restrictions'];

// Dimensions
Schemas.dimensions = ['Communication', 'Data/Technology', 'Professional Development', 'HR/Bargaining Units', 'Policy/Governance/Liability', 'Finances/Resources'  ];

// Guidance Types
Schemas.guidance_types = ['Assumptions', 'Actions', 'Resources', 'Questions', 'Considerations', 'Goals'];

// Plans
Schemas.plans = new SimpleSchema({
    title: String,
    scenario: {
        type: String,
        allowedValues: Schemas.scenarios,
	    label: 'Restriction level'
    },
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
                    allowedValues: Schemas.dimensions
    },
    item: Object,
    'item.text': String,
    'item.delta': {type: Object, optional: true}   // A Quill Delta Object https://quilljs.com/docs/delta/
});

// Guidance Items
Schemas.guidanceitems = new SimpleSchema({
    unitIds: [SimpleSchema.oneOf(String, SimpleSchema.Integer)],
    dimensions: { type: Array },
    'dimensions.$':{
        type: String,
        allowedValues: Schemas.dimensions
    },
    source: String,
    location_in_source: String,
    type: {
        type: String,
        allowedValues: Schemas.guidance_types,
	label: 'Guidance type'
    },
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

export  default Schemas;
