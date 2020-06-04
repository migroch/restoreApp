// sampleplanitems_data.js
// Initial sample plan items

export default sampleplanitems_data = [
    {
	unitIds: ['Curriculum'], // converted to Ids in fixtures
	ownerId: 'dummy1',   // converted to Ids in fixtures
	assignedToIds: ['dummy3'],  // converted to Ids in fixtures
	dueDate: Date.now(),
	dimension: 'Data/Technology',
	item:{text:'dummy1 plan item'}
    },
    {
	unitIds: ['PPE/Equipment'],  // converted to Ids in fixtures
	ownerId: 'dummy2',   // converted to Ids in fixtures
	assignedToIds: ['dummy1', 'dummy2'],  // converted to Ids in fixtures
	dueDate: Date.now(),
	dimension: 'Communication',
	item:{text:'dummy2 plan item'}
    },
    {
	unitIds: ['Schedule'],  // converted to Ids in fixtures
	ownerId: 'dummy3',   // converted to Ids in fixtures
	assignedToIds: ['dummy1'],  // converted to Ids in fixtures
	dueDate: Date.now(),
	dimension:'Finances/Resources',
	item:{text:'dummy3 plan item'}
    },
]

