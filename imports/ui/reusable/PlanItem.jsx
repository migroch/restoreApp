

import React from 'react';
import { Select } from 'antd';
import { withTracker } from 'meteor/react-meteor-data';
import { planitems, plans } from '../../api/collections';

const { Option } = Select;
function handleChange(value) {
  console.log(`selected ${value}`);
}
const dimensions = ['Communication', 'Data/Technology', 'PD/Training', 'Human Resources', 'Policy/Governance', 'Finances/Resources']

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
          { dimensions.map(item=><Option value={item}>{item}</Option>) }
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
  return {
    data: planitems.findOne(id),
    isLoading: false
  };
})(PlanItem);


