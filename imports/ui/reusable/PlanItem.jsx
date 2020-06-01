

import React from 'react';
import { Select } from 'antd';
import { withTracker } from 'meteor/react-meteor-data';
import { planitems, plans } from '../../api/collections';

const { Option } = Select;
function handleChange(value) {
  console.log(`selected ${value}`);
}
const dimensions = ['Communication', 'Data/Technology', 'PD/Training', 'Human Resources', 'Policy/Governance', 'Finances/Resources']

PlanItem = ({data, disabled}) => {
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
  return {
    data: planitems.findOne(id)
  };
})(PlanItem);


