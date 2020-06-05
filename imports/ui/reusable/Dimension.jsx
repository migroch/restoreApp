import React from 'react';
import { Checkbox } from 'antd/dist/antd.min.js';
import  Schemas from '../../api/schemas';

// const onChange = (checkedValues) => {
//   console.log('checked = ', checkedValues);
// }

const dimensions =  Schemas.dimensions;

const options = dimensions.map( (dimension) =>{
  {label: dimension, value: dimension}
})

const Dimension = ({disabled, value, onChange}) => {
  let defaultValue = []
  Object.keys(value).forEach(function (item) {
    if (value[item]) defaultValue.push(item)
  });
  return (
    <>
      <Checkbox.Group
        options={options}
        disabled={disabled}
        defaultValue={defaultValue}
        onChange={onChange}
      />
    </>
  )
}
export default Dimension;
