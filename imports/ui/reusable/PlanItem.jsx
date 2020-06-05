import React from 'react';
import { Meteor } from 'meteor/meteor';
import { Select } from 'antd/dist/antd.min.js';
import { withTracker } from 'meteor/react-meteor-data';
import  Schemas from '../../api/schemas';
import { planitems, categories, subcategories, units } from '../../api/collections';

const { Option } = Select;
function handleChange(value) {
  console.log(`selected ${value}`);
}
const dimensions = Schemas.dimensions;

PlanItem = ({data, disabled, isLoading}) => {
  if (isLoading) return null
  const { subcategories, item, dimension } = data
  return (
    <div className="plan-item">
      <div className="label_1">
        Categories/SubCategories:
        <div className="tags-wrapper">
          {subcategories}
        </div>
      </div>  
      <div>Dimension: 
        <Select defaultValue={dimension} style={{ width: 180 }} disabled={disabled} onChange={handleChange}>
          { dimensions.map((item, index)=><Option key={index} value={item}>{item}</Option>) }
        </Select>        
      </div>
      <div>Item: {item.text}</div>
    </div>
  )
}
export default withTracker(({id}) => {
  const handles = [
    Meteor.subscribe('planitems'),
  ];
  const isLoading = handles.some(handle => !handle.ready());
  if(isLoading){
    return {
      data: null,
      isLoading: true
    };
  }
  let data = planitems.findOne(id)
  return {
    data,
    isLoading: false
  };
})(PlanItem);

// "_id" : "K5X3yPvTbZbPcF2om", 
// "item" : {
//     "text" : "dummy1 plan item"
// }, 
// "assignedToIds" : [
//     "NNDBCzLdEG3cb9nTP"
// ], 
// "dimension" : "Professional Development", 
// "dueDate" : ISODate("2020-06-04T16:08:37.268+0000"), 
// "ownerId" : "ReuhYSY42CB52487P", 
// "unitIds" : [
//     "4zYjujorqFD2QJ7yk"
// ]
