

import React from 'react';
import { Checkbox } from 'antd';

// const onChange = (checkedValues) => {
//   console.log('checked = ', checkedValues);
// }


const options = [
  { label: 'Communication', value: 'Communication' },
  { label: 'Data/Technology', value: 'Data_Technology' },
  { label: 'PD/Training', value: 'Pd_Training' },
  { label: 'Human/Resource', value: 'Human_Resource' },
  { label: 'Policy/Governanace', value: 'Policy_Governanace' },
  { label: 'Finances?Resources', value: 'Finances_Resources' },
];
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