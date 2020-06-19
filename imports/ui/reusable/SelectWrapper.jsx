import React, { useState, useEffect } from 'react';
import { Cascader, Select, Input } from 'antd/dist/antd.min.js';
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


const SelectWrapper = ({isLoading, data, onChangeQuery, value}) => {
  if (isLoading) return null;
  const { units_total, districts_total, schools_total } = data;
  const [query, setQuery] = useState(value);
  
  onChange = (item, value) => {
    if (value==="All") value = undefined
    setQuery({...query, [item]: value})
  }

  useEffect(() => {
    onChangeQuery(query)
  }, [query]);

  let mapOptions = []
  units_total.forEach(u =>{
    let subcategory = u.subcategory.name;
    let category = u.subcategory.category.name;
    let categoryOpt = mapOptions.filter(c => c.value == category)[0]
    if (categoryOpt){
      let subcategoryOpt = categoryOpt.children.filter(s => s.value==subcategory)[0];
      if (subcategoryOpt){
	let unames = subcategoryOpt.children.map(c => c.value);
	if (!unames.includes(u.name)) subcategoryOpt.children.push({label:u.name, value:u.name});
      } else {
	categoryOpt.children.push({label:subcategory, value:subcategory, children: [{label:u.name, value:u.name}]});
      }
    } else {
      mapOptions.push({label:category, value:category, children:[
	{label:subcategory, value:subcategory, children: [{label:u.name, value:u.name}]}
      ]})
    }
  });

  const filters = [
    {label:'Level of Restriction', options: scenarios, fname: "scenario"},
    {label:'Dimensions', options: dimensions , fname: "dimension"},
    {label:'Districts', options: districts_total, fname: "district"},
    {label:'Shools', options: schools_total , fname: "school"},
  ] 

  return (
    <div>


      <Search
          placeholder="Search"
          onSearch={value => console.log(value)}
          style={{ width: '100%' }}
      />          


      <div className="select-wrapper row">
	<div  className="col col-md-4">
	  <p className="m-0"><small>Map Location</small></p>
	  <Cascader
	      showSearch
	      style={{ width: '100%' }}
	      placeholder="Map Location"
	      displayRender={label => label.join(' > ')}
	      changeOnSelect={true}
	      expandTrigger="hover"
	      options={mapOptions}
	      defaultValue={ []}
	      onChange={(values) => {
		  let fnames = ["category", "subcategory", "unit"];
		  fnames.forEach((fname, index) => onChange(fname, values[index]));
		}}
	      filterOption = {(input, option) =>  option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0   }
	  />
	</div>
	
	{  
	  filters.map((filter, index) =>{
	    let {label, options, fname} = filter ;
	    return(
	      <div key ={index} className="col col-md-2">
		<p className="m-0"><small>{label}</small></p>
		<Select
		    allowClear
		    showSearch
		    style={{ width: '100%' }}
		    placeholder={label}
		    optionFilterProp="children"
		    defaultValue={query[fname] || "All"}
		    onChange={value=>onChange(fname, value)}
		    filterOption={(input, option) =>  option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0   }
		>
		  {
		    options.map((option, index)=>{
		      if (index == 0)
			return (
			  <React.Fragment key={index}>
			    <Option value={"All"}>All</Option>
			    <Option value={option}>{option}</Option>
			  </React.Fragment>
			)
			return (<Option key={index+1} value={option}>{option}</Option>)
		    })
		  }
		</Select>
	      </div>
	    )
	  })
	}
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
  let plans_total = plansQuery_Clone.fetch();
  const districts_total = uniq(plans_total.map(plan=>plan.districts()).flat());
  const schools_total = uniq(plans_total.map(plan=>plan.schoolNames()).flat());
  const units_total  = plans_total.map(p => p.planItems.map(pi => pi.units).flat()).flat();    
  const categories_total = categories.find({}).fetch().map(c => c.name);
  const subcategories_total = subcategories.find({}).fetch().map(s => s.name);
    const data = { units_total, schools_total, districts_total };
  return {
    data,
    isLoading: false
  };
})(SelectWrapper);
