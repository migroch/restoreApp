// sampleplanitems_data.js
// Initial sample plan items

// export const sampleplans = [
// 	{
// 			title: 'Sample Plan1',
// 			scenario: 'High Restrictions',
// 			planItems:[pitems[0]._id, pitems[1]._id,  pitems[2]._id] 
// 	},
// 	{
// 			title: 'Sample Plan2',
// 			scenario:  'Medium Restrictions',
// 			planItems:[pitems[0]._id,   pitems[2]._id] 
// 	},
// 	{
// 			title: 'Sample Plan3',
// 			scenario: 'Low Restrictions',
// 			planItems:[ pitems[1]._id ]  
// 	},
// ];

export const sampleplanitems_data = [
	{
		categories:['Instructional Programs'],
		subcategories: ['Curriculum'],
		owner: 'dummy1',  // on real data 'owner' will be the userID
		dimension: 'PD/Training',
		item:{text:'dummy1 plan item'}
	},
	{
		categories:['Health & Safety / Operations'],
		subcategories: ['PPE'],
		owner: 'dummy2',  // on real data 'owner' will be the userID
		dimension: 'Policy/Governance',
		item:{text:'dummy2 plan item'}
	},
	{
		categories:['Student Support & Family Engagement'],
		subcategories: ['Basic Needs'],
		owner: 'dummy3', // on real data 'owner' will be the userID
		dimension: 'Finances/Resources',
		item:{text:'dummy3 plan item'}
	},
]

