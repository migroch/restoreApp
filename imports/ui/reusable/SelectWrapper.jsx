import React, { useState, useEffect } from 'react';
import { Select, Input } from 'antd/dist/antd.min.js';
import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
import  Schemas from '../../api/schemas';
import { categories, subcategories, units } from '../../api/collections';

const { Search } = Input;
const { Option } = Select;
const dimensions =  Schemas.dimensions;
const scenarios =  Schemas.scenarios;

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


const SelectWrapper = ({isLoading, data, onChangeQuery}) => {
  if (isLoading) return null
  const { categories_total, subcategories_total, units_total } = data
  const [query, setQuery] = useState({})

  onChange = (item, value) => {
    setQuery({...query, [item]: value})
  }

  useEffect(() => {
    onChangeQuery(query)
  }, [query]);

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
        style={{ width: 250 }}
        placeholder="Category"
        optionFilterProp="children"
        onChange={value=>onChange("category", value)}
        filterOption={(input, option) =>
          option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
        }
      >
        {
          categories_total.map((item, index)=>(
            <Option key={index} value={item.name}>{item.name}</Option>
          ))
        }
      </Select>
      <Select
        showSearch
        style={{ width: 250 }}
        placeholder="Subcategory"
        optionFilterProp="children"
        onChange={value=>onChange("subcategory", value)}
        filterOption={(input, option) =>
          option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
        }
      >
        {
          subcategories_total.map((item, index)=>(
            <Option key={index} value={item.name}>{item.name}</Option>
          ))
        }
      </Select>
      <Select
        showSearch
        style={{ width: 250 }}
        placeholder="Unit"
        optionFilterProp="children"
        onChange={value=>onChange("unit", value)}
        filterOption={(input, option) =>
          option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
        }
      >
        {
          units_total.map((item, index)=>(
            <Option key={index} value={item.name}>{item.name}</Option>
          ))
        }
      </Select>      
      <Select
        showSearch
        style={{ width: 250 }}
        placeholder="Senario"
        optionFilterProp="children"
        onChange={value=>onChange("scenario", value)}
        filterOption={(input, option) =>
          option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
        }
      >
        {
          scenarios.map((item, index)=>(
            <Option key={index}  value={item}>{item}</Option>
          ))
        }
      </Select>
      <Select
        showSearch
        style={{ width: 250 }}
        placeholder="Dimension"
        optionFilterProp="children"
        onChange={value=>onChange("dimension", value)}
        filterOption={(input, option) =>
          option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
        }
      >
        {
          dimensions.map((item, index)=>(
            <Option key={index} value={item}>{item}</Option>
          ))
        }
      </Select>
      {/* <Select
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
      </Select>                         */}
    </div>
    </div>
  )
}

export default withTracker(() => {
  const handles = [
    Meteor.subscribe('plans'),
    Meteor.subscribe('planitems'),
    Meteor.subscribe('categories'),
    Meteor.subscribe('subcategories'),
    Meteor.subscribe('units'),
  ];

  const isLoading = handles.some(handle => !handle.ready());
  if(isLoading){
    return {
      data: null,
      isLoading: true
    };
  }

  const categories_total = categories.find({}).fetch()
  const subcategories_total = subcategories.find({}).fetch()
  const units_total = units.find({}).fetch()
  const data = { categories_total, subcategories_total, units_total }
  return {
    data,
    isLoading: false
  };
})(SelectWrapper);
