import React, { useState } from 'react';
import { Select, Input } from 'antd/dist/antd.min.js';
//import { AudioOutlined } from '@ant-design/icons';
import  Schemas from '../../api/schemas';
import { planitems, categories, subcategories, units } from '../../api/collections';

const { Search } = Input;
const { Option } = Select;

//TODO: Wrap over Tracker to subscribe to collections. Then get values of filters from the collections and schemas,
//            then iterate over filters to create <Select> components 
/* const scenarios = Schemas.scenarios;
   const categories_f = categories.find({},{'name': 1}).fetch();
   const subcategories_f =  subcategories.find({},{'name': 1}).fetch();
   const units_f =  units.find({},{'name': 1}).fetch();
   const dimensions =  Schemas.dimensions;
   const districts =  [] // we need to get this from usersIds in planitems
   const schools = [] // we'll have to  get this from userIds in planitems

   const filters = [
   {label:'Level of Restrictions',values: scenarios},
   {label:'Categories',values: categories_f},
   {label:'Subcategories',values: subcategories_f},
   {label:'Units',values: units_f},
   {label:'Dimensions',values: dimensions},
   {label:'Districts',values: districts},
   {label:'Shools',values: schools},
   ] */


categories_data = ['Instructional Programs', 'Health & Safety/Operations', 'Student Support & Family Engagement']

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
          categories_data.map((item, index)=>(
            <Option key={index} value={item.id}>{item.name}</Option>
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
          categories_data.map((item, index)=>(
            <Option key={index} value={item.id}>{item.name}</Option>
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
          categories_data.map((item, index)=>(
            <Option key={index}  value={item.id}>{item.name}</Option>
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
          categories_data.map((item, index)=>(
            <Option key={index} value={item.id}>{item.name}</Option>
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
          categories_data.map((item, index)=>(
            <Option key={index} value={item.id}>{item.name}</Option>
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
          categories_data.map((item, index)=>(
            <Option key={index} value={item.id}>{item.name}</Option>
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
          categories_data.map((item, index)=>(
            <Option key={index} value={item.id}>{item.name}</Option>
          ))
        }
      </Select>                        
    </div>
    </div>
  )
}

export default SelectWrapper
