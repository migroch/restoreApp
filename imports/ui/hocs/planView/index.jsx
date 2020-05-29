import React from 'react';
import { Select } from 'antd';
import './index.scss'
const { Option } = Select;
const categories = [
  {
    id: 1,
    name: "category_1"
  },
  {
    id: 2,
    name: "category_2"
  },
  {
    id: 3,
    name: "category_3"
  },
  {
    id: 4,
    name: "category_4"
  }
]
const plans = [
  {
    id: 1,
    title: "plan_1",
    scenario: "High Restriction",
    planitems: [
      1,2,3 //planitems id
    ]
  },
  {
    id: 2,
    title: "plan_2",
    scenario: "Medium Restriction",
    planitems: [
      1,2,3 //planitems id
    ]
  },
  {
    id: 3,
    title: "plan_3",
    scenario: "Low Restriction",
    planitems: [
      1,2,3 //planitems id
    ]
  }

]
onChangeCategory = (value) => {
  console.log(`selected ${value}`);
}

const SelectWrapper = () => {
  return (
    <div className="select-wrapper">
      <Select
        showSearch
        style={{ width: 150 }}
        placeholder="Categories"
        optionFilterProp="children"
        onChange={onChangeCategory}
        filterOption={(input, option) =>
          option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
        }
      >
        {
          categories.map(item=>(
            <Option value={item.id}>{item.name}</Option>
          ))
        }
      </Select>
      <Select
        showSearch
        style={{ width: 150 }}
        placeholder="Subcategories"
        optionFilterProp="children"
        onChange={onChangeCategory}
        filterOption={(input, option) =>
          option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
        }
      >
        {
          categories.map(item=>(
            <Option value={item.id}>{item.name}</Option>
          ))
        }
      </Select>
      <Select
        showSearch
        style={{ width: 150 }}
        placeholder="Dimensions"
        optionFilterProp="children"
        onChange={onChangeCategory}
        filterOption={(input, option) =>
          option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
        }
      >
        {
          categories.map(item=>(
            <Option value={item.id}>{item.name}</Option>
          ))
        }
      </Select>
      <Select
        showSearch
        style={{ width: 150 }}
        placeholder="Senarios"
        optionFilterProp="children"
        onChange={onChangeCategory}
        filterOption={(input, option) =>
          option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
        }
      >
        {
          categories.map(item=>(
            <Option value={item.id}>{item.name}</Option>
          ))
        }
      </Select>
      <Select
        showSearch
        style={{ width: 150 }}
        placeholder="Countries"
        optionFilterProp="children"
        onChange={onChangeCategory}
        filterOption={(input, option) =>
          option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
        }
      >
        {
          categories.map(item=>(
            <Option value={item.id}>{item.name}</Option>
          ))
        }
      </Select>
      <Select
        showSearch
        style={{ width: 150 }}
        placeholder="Districts"
        optionFilterProp="children"
        onChange={onChangeCategory}
        filterOption={(input, option) =>
          option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
        }
      >
        {
          categories.map(item=>(
            <Option value={item.id}>{item.name}</Option>
          ))
        }
      </Select>         
      <Select
        showSearch
        style={{ width: 150 }}
        placeholder="Schools"
        optionFilterProp="children"
        onChange={onChangeCategory}
        filterOption={(input, option) =>
          option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
        }
      >
        {
          categories.map(item=>(
            <Option value={item.id}>{item.name}</Option>
          ))
        }
      </Select>                        
    </div>
  )
}

const PlanView = () => {
  return (
    <div className="plan-view">
      <SelectWrapper />
    </div>
  )
}

export default PlanView