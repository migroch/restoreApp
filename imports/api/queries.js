// queries.js
// grapher queries
import { plans, planitems, guidanceitems, categories, subcategories, units } from './collections.js';
import addCollectionLinks from './collection-links';

addCollectionLinks();

export const plansQuery = plans.createQuery({
  title: 1,
  scenario: 1,
  planItems: {
    dimension: 1,
    units: {
      name: 1
    },
    // owner: {
    //   district: 1,
    //   country: 1,
    //   profile: {
    //     name: 1
    //   }
    // },
    assignedTo: {
      district: 1,
      country: 1,
      schools: 1,
      profile: {
        name: 1
      }
    }
  }
});

export const plansQueryWithFilter = plans.createQuery({
  $filter({filters, options, params}) {
    if (params.id) filters._id = params.id;
      if (params.scenario) filters.scenario = params.scenario;
  },
  title: 1,
  scenario: 1,
  planItems: {
    $filter({filters, params}) {
	if (params.dimension)  filters.dimension = params.dimension;
    },
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
        category: {
          $filter({filters, params}) {
              if (params.category)  filters.name = params.category;
          },
          name: 1
        }
      }
    },
    // owner: {
    //   district: 1,
    //   country: 1,
    //   profile: {
    //     name: 1
    //   }
    // },
    assignedTo: {
      district: 1,
      country: 1,
      profile: {
        name: 1
      }
    }
  }
});

