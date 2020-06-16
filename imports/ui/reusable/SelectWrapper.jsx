import React, { useState, useEffect } from 'react';
import { Select, Input } from 'antd/dist/antd.min.js';
import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
import  Schemas from '../../api/schemas';
import {plans, categories, subcategories, units } from '../../api/collections';
import { uniq } from 'lodash'
import { plansQueryWithFilter } from '../../api/queries'
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


const SelectWrapper = ({isLoading, data, onChangeQuery, value}) => {
  if (isLoading) return null
  const { categories_total, subcategories_total, units_total, districts_total, schools_total } = data
  const [query, setQuery] = useState(value)

  onChange = (item, value) => {
    if (value==="All") value = undefined
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
        defaultValue={query.category || "All"}
        onChange={value=>onChange("category", value)}
        filterOption={(input, option) =>
          option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
        }
      >
        {
          categories_total.map((item, index)=>{
            if ((categories_total.length - 1) === index)
              return (
                <>
                <Option key={"category"+index} value={item.name}>{item.name}</Option>
                <Option key={"category_all"} value={"All"}>All</Option>
                </>
              )
            return (<Option key={"category"+index} value={item.name}>{item.name}</Option>)
          })
        }
      </Select>
      <Select
        showSearch
        style={{ width: 250 }}
        placeholder="Subcategory"
        optionFilterProp="children"
        defaultValue={query.subcategory || "All"}
        onChange={value=>onChange("subcategory", value)}
        filterOption={(input, option) =>
          option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
        }
      >
        {
          subcategories_total.map((item, index)=>{
            if ((subcategories_total.length - 1) === index)
              return (
                <>
                <Option key={"subCategory"+index} value={item.name}>{item.name}</Option>
                <Option key={"subCategory_all"} value={"All"}>All</Option>
                </>
              )
            return (<Option key={"subCategory"+index} value={item.name}>{item.name}</Option>)
          })
        }        
      </Select>
      <Select
        showSearch
        style={{ width: 250 }}
        placeholder="Unit"
        optionFilterProp="children"
        defaultValue={query.unit || "All"}
        onChange={value=>onChange("unit", value)}
        filterOption={(input, option) =>
          option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
        }
      >
        {
          units_total.map((item, index)=>{
            if ((units_total.length - 1) === index)
              return (
                <>
                <Option key={"unit"+index} value={item.name}>{item.name}</Option>
                <Option key={"unit_all"} value={"All"}>All</Option>
                </>
              )
            return (<Option key={"unit"+index} value={item.name}>{item.name}</Option>)
          })
        }           
      </Select>      
      <Select
        showSearch
        style={{ width: 250 }}
        placeholder="Scenario"
        optionFilterProp="children"
        defaultValue={query.scenario || "All"}
        onChange={value=>onChange("scenario", value)}
        filterOption={(input, option) =>
          option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
        }
      >
        {
          scenarios.map((item, index)=>{
            if ((scenarios.length - 1) === index)
              return (
                <>
                <Option key={"scenario"+index} value={item}>{item}</Option>
                <Option key={"scenario_all"} value={"All"}>All</Option>
                </>
              )
            return (<Option key={"scenario"+index} value={item}>{item}</Option>)
          })
        }   
      </Select>
      <Select
        showSearch
        style={{ width: 250 }}
        defaultValue={value.dimension?value.dimension:"All"}
        placeholder="Dimension"
        optionFilterProp="children"
        defaultValue={query.dimension || "All"}
        onChange={value=>onChange("dimension", value)}
        filterOption={(input, option) =>
          option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
        }
      >
        {
          dimensions.map((item, index)=>{
            if ((dimensions.length - 1) === index)
              return (
                <>
                <Option key={"dimension"+index} value={item}>{item}</Option>
                <Option key={"dimension_all"} value={"All"}>All</Option>
                </>
              )
            return (<Option key={"dimension"+index} value={item}>{item}</Option>)
          })
        } 
      </Select>
      <Select
        showSearch
        style={{ width: 250 }}
        defaultValue={value.district?value.district:"All"}
        placeholder="District"
        optionFilterProp="children"
        defaultValue={query.district || "All"}
        onChange={value=>onChange("district", value)}
        filterOption={(input, option) =>
          option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
        }
      >
        {
          districts_total.map((item, index)=>{
            if ((districts_total.length - 1) === index)
              return (
                <>
                <Option key={"district"+index} value={item}>{item}</Option>
                <Option key={"district_all"} value={"All"}>All</Option>
                </>
              )
            return (<Option key={"district"+index} value={item}>{item}</Option>)
          })
        } 
      </Select>      
      <Select
        showSearch
        style={{ width: 250 }}
        defaultValue={value.school?value.school:"All"}
        placeholder="School"
        optionFilterProp="children"
        defaultValue={query.school || "All"}
        onChange={value=>onChange("school", value)}
        filterOption={(input, option) =>
          option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
        }
      >
        {
          schools_total.map((item, index)=>{
            if ((school.length - 1) === index)
              return (
                <>
                <Option key={"school"+index} value={item}>{item}</Option>
                <Option key={"school_all"} value={"All"}>All</Option>
                </>
              )
            return (<Option key={"school"+index} value={item}>{item}</Option>)
          })
        } 
      </Select>                      
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
  const plansQuery_Clone = plansQueryWithFilter.clone({});
  plansQuery_Clone.subscribe();
  let plans_total = plansQuery_Clone.fetch()
  const districts_total = uniq(plans_total.map(plan=>plan.districts()).flat())
  const schools_total = uniq(plans_total.map(plan=>plan.schools()).flat())
  const categories_total = categories.find({}).fetch()
  const subcategories_total = subcategories.find({}).fetch()
  const units_total = units.find({}).fetch()
  const data = { categories_total, subcategories_total, units_total, schools_total, districts_total }
  return {
    data,
    isLoading: false
  };
})(SelectWrapper);
