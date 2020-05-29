import React, { useState } from 'react';
import { Select, Input } from 'antd';
import { AudioOutlined } from '@ant-design/icons';

const { Search } = Input;
const { Option } = Select;

const categories_data = [
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
onChangeCategory = (value) => {
  console.log(`selected ${value}`);
}

const SelectWrapper = () => {
  return (
    <div>
      <Search
        placeholder="Search"
        onSearch={value => console.log(value)}
        style={{ width: '100%' }}
      />          
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
          categories_data.map(item=>(
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
          categories_data.map(item=>(
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
          categories_data.map(item=>(
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
          categories_data.map(item=>(
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
          categories_data.map(item=>(
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
          categories_data.map(item=>(
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
          categories_data.map(item=>(
            <Option value={item.id}>{item.name}</Option>
          ))
        }
      </Select>                        
    </div>
    </div>
  )
}

export default SelectWrapper