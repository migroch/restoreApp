// queries.js
// grapher queries
import { plans, guidanceitems } from './collections.js';
import addCollectionLinks from './collection-links';

addCollectionLinks();

export const guidanceitemsWithFilter = guidanceitems.createQuery({
	$filter({filters, options, params}) {
		if (params.id) filters._id = params.id;
		console.log("params.dimension:", params.dimension)

		//TODO: filtering with dimension is not working now
		if (params.dimension) filters.dimensions = {$elemMatch: {$eq:params.dimension}}
		if (params.source) filters.source = params.source;
		if (params.type) filters.type = params.type;
	},
	$options: {
		sort: {_id: -1}
	},
	units: {
		$filter({filters, params}) {
			if (params.unit)  filters.name = params.unit;
		},
		name: 1,
		subcategory: {
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
});

export const plansQueryWithFilter = plans.createQuery({
	$filter({filters, options, params}) {
		if (params.id) filters._id = params.id;
		if (params.scenario) filters.scenario = params.scenario;
	},
	$options: {
		sort: {lastedittime: -1}
	},
  lastedittime: 1,
	title: 1,
	scenario: 1,
	planItems: {
		$filter({filters, params}) {
			if (params.dimension)  filters.dimension = params.dimension;
		},
		$options: {
			sort: {lastedittime: -1}
		},
		lastedittime: 1,
		unitIds: 1,
		ownerId: 1,
		assignedToIds :1,
		dueDate: 1,
		dimension: 1,
		units: {
			$filter({filters, params}) {
				if (params.unit)  filters.name = params.unit;
			},
			name: 1,
			subcategory: {
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
		    if (params.school)  filters.schools = {$elemMatch: {name: params.school}} ; 
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
		    if (params.school)  filters.schools = {$elemMatch: {name: params.school}} ; 
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

