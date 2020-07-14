// sampleplanitems_data.js
// Initial sample plan items

export default sampleplanitems_data = [
    {
	title: "plan_item_1",
	unitIds: ['Curriculum'], // converted to Ids in fixtures
	ownerId: 'dummy 1',   // converted to Ids in fixtures
	assignedToIds: ['dummy 3'],  // converted to Ids in fixtures
	dueDate: Date.now(),
	dimension: 'Professional Development',
	item:{text:'dummy 1 plan item'}
    },
    {
	title: "plan_item_2",
	unitIds: ['PPE / Equipment'],  // converted to Ids in fixtures
	ownerId: 'dummy 2',   // converted to Ids in fixtures
	assignedToIds: ['dummy 1', 'dummy 2'],  // converted to Ids in fixtures
	dueDate: Date.now(),
	dimension: 'Policy / Governance / Liability',
	item:{text:'dummy 2 plan item'}
    },
    {
	title: "plan_item_3",
	unitIds: ['Schedule'],  // converted to Ids in fixtures
	ownerId: 'dummy 3',   // converted to Ids in fixtures
	assignedToIds: ['dummy 1'],  // converted to Ids in fixtures
	dueDate: Date.now(),
	dimension: 'Finances / Resources',
	item:{text:'dummy 3 plan item'}
    },
]

