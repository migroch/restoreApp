// sampleplanitems_data.js
// Initial sample plan items

export default sampleplanitems_data = [
    {
	title: "plan_item_1",
	unitIds: ['Curriculum'], // converted to Ids in fixtures
	ownerId: 'dummy1',   // converted to Ids in fixtures
	assignedToIds: ['dummy3'],  // converted to Ids in fixtures
	dueDate: Date.now(),
	dimensions: ['Professional Development'],
	item:{text:'dummy1 plan item'}
    },
    {
	title: "plan_item_2",
	unitIds: ['PPE / Equipment'],  // converted to Ids in fixtures
	ownerId: 'dummy2',   // converted to Ids in fixtures
	assignedToIds: ['dummy1', 'dummy2'],  // converted to Ids in fixtures
	dueDate: Date.now(),
	dimensions: ['Policy / Governance / Liability'],
	item:{text:'dummy2 plan item'}
    },
    {
	title: "plan_item_3",
	unitIds: ['Schedule'],  // converted to Ids in fixtures
	ownerId: 'dummy3',   // converted to Ids in fixtures
	assignedToIds: ['dummy1'],  // converted to Ids in fixtures
	dueDate: Date.now(),
	dimensions: ['Finances / Resources'],
	item:{text:'dummy3 plan item'}
    },
]

