// queries.js
// grapher queries
import { plans, planitems, guidanceitems, categories, subcategories, units } from './collections.js';
import addCollectionLinks from './collection-links';

addCollectionLinks();

export const plansQuery = plans.createQuery({
    title: 1,
    scenario: 1,
    planItems: {
	unitIds: 1,
	ownerId: 1,
	assignedToIds :1,
	dueData: 1,
	dimension: 1,
	units: {
	    name: 1,
	    scubcategory:{
		name: 1,
		category:{
		    name: 1
		}
	    },
	},
	owner: {
	    district: 1,
	    county: 1,
	    schools: 1,
	    profile: {
		name: 1
	    }
	},
	assignedTo: {
	    district: 1,
	    county: 1,
	    schools: 1,
	    profile: {
		name: 1
	    }
    }
  }
});

export const plansQueryWithFilter = plans.createQuery({
	// $filters: {
	// 	planItems: {
	// 		$exists: true, $not: {$size: 0}
	// 	}
	// },
	$filter({filters, options, params}) {
		if (params.id) filters._id = params.id;
		if (params.scenario) filters.scenario = params.scenario;
	},
	title: 1,
	scenario: 1,
	planItems: {
		// $filters: {
		// 	units: {
		// 		$exists: true, $not: {$size: 0}
		// 	}
		// },
		$filter({filters, params}) {
			if (params.dimension)  filters.dimension = params.dimension;
		},
		unitIds: 1,
		ownerId: 1,
		assignedToIds :1,
		dueDate: 1,
		dimension: 1,
		units: {
			// $filters: {
			// 	subcategory: {
			// 		$not: undefined
			// 	}
			// },
			$filter({filters, params}) {
				if (params.unit)  filters.name = params.unit;
			},
			name: 1,
			subcategory: {
				// $filters: {
				// 	category: {
				// 		$exist: true
				// 	}
				// },
				$filter({filters, params}) {
					if (params.subcategory)  filters.name = params.subcategory;
				},
				name: 1,
				categoryId: 1,
				category: {
					name: 1,
					$filter({filters, params}) {
						if (params.category)  filters.name = params.category;
					},
				},
			}
		},
	owner: {
		$filter({filters, params}) {
			if (params.district)  filters.district = params.district;
			// if (params.district)  filters.district = params.district;
		},
	    district: 1,
	    county: 1,
	    schools: 1,
	    profile: {
		name: 1
	    }
	},
	assignedTo: {
		$filter({filters, params}) {
			if (params.district)  filters.district = params.district;
			// if (params.district)  filters.district = params.district;
		},
	    district: 1,
	    county: 1,
	    schools: 1,
	    profile: {
			name: 1
	    }
	}
    }
});

