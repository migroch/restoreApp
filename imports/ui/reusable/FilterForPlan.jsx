import React, { useState, useEffect } from 'react';
import { Cascader, Select, Input } from 'antd/dist/antd.min.js';
import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
import  Schemas from '../../api/schemas';
import {plans, categories, subcategories, units } from '../../api/collections';
import { uniq, isEmpty } from 'lodash'
import { plansQueryWithFilter } from '../../api/queries'
const { Search } = Input;
const { Option } = Select;
const dimensions =  Schemas.dimensions;
const scenarios =  Schemas.scenarios;


const SelectWrapper = ({isLoading, data, onChangeQuery, value}) => {
  if (isLoading) return null;
  const { units_total, subcategories_total, districts_total, schools_total, valueforMapLocation } = data;
  const [query, setQuery] = useState(value || {});
  
  onChange = (item, value) => {
    if (value==="All") value = undefined
    setQuery({...query, [item]: value})
    if (item == "ALLMAPLOCATION")
      setQuery({...query, category: undefined, subcategory: undefined, unit: undefined})
    if (item=="unit")
      setQuery({...query, category: undefined, subcategory: undefined, unit: value})
    if (item=="subcategory")
      setQuery({...query, category: undefined, subcategory: value, unit: undefined})
    if (item=="category")
      setQuery({...query, category: value, subcategory: undefined, unit: undefined})
  }

  useEffect(() => {
    onChangeQuery(query)
  }, [query]);

  let mapOptions = []
  units_total.forEach(u =>{
    let subcategory = u.subcategoryName() || u.subcategory.name;
    let category = u.categoryName() || u.subcategory.category.name;
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
  // Add subcategories withouth units
  subcategories_total.forEach(s =>{
    let subcategory = s.name;
    let category = s.categoryName() || u.subcategory.category.name;
    let categoryOpt = mapOptions.filter(c => c.value == category)[0]
    if (categoryOpt){
      let subcategoryOpt = categoryOpt.children.filter(s => s.value==subcategory)[0];
      if (!subcategoryOpt) categoryOpt.children.push({label:subcategory, value:subcategory, children:[]})
    } else {
      mapOptions.push({label:category, value:category, children:[{label:subcategory, value:subcategory}]});
    }
  });
  
  const filters = [
    {label:'Level of Restriction', options: scenarios, fname: "scenario"},
    {label:'Organizational Units', options: dimensions , fname: "dimension"},
    {label:'Districts', options: districts_total, fname: "district"},
    {label:'Shools', options: schools_total , fname: "school"},
  ] 

  return (
    <div>

      <div className="select-wrapper row mt-2 container-fluid">
	<div  className="col col-md-4">
	  <p className="m-0"><small>Logistic Tree Location</small></p>
	  <Cascader
	      showSearch={{	filter: (input, option) => option.map(o =>o.label).filter( o => o.toLowerCase().indexOf(input.toLowerCase()) >= 0 ).length }}
	      style={{ width: '100%' }}
	      placeholder="All"
	      displayRender={label => label.join(' > ')}
	      changeOnSelect={true}
	      expandTrigger="hover"
	      options={mapOptions}
	      defaultValue={valueforMapLocation}
	      onChange={(values) => {
		  if (isEmpty(values)) onChange("ALLMAPLOCATION", null)
		    else {
		      let fnames = ["category", "subcategory", "unit"];
		      onChange(fnames[values.length-1], values[values.length-1])
		    }
		}}
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
		    placeholder="All"
		    optionFilterProp="children"
		    defaultValue={query[fname]}
		    onChange={value=>onChange(fname, value)}
		    filterOption={(input, option) =>  option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0   }
		>
		  {
		    options.map((option, index)=>{
		      if (index == 0)
			return (
			  <React.Fragment key={index}>
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

export default withTracker(({value}) => {
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
  let valueforMapLocation = []
  if (value && value.unit) {
    const unit = units.findOne({name:value.unit})
    valueforMapLocation = [
      unit.categoryName(),
      unit.subcategoryName(),
      unit.name,
    ]
  }

  if (value && value.subcategory) {
    const subcategory = subcategories.findOne({name:value.subcategory})
    valueforMapLocation = [
      subcategory.categoryName(),
      subcategory.name,
    ]
  }

  if (value && value.category) {
    valueforMapLocation = [value.category]
  }

  const plansQuery_Clone = plansQueryWithFilter.clone({});
  plansQuery_Clone.subscribe();
  let plans_total = plansQuery_Clone.fetch();
  const districts_total = uniq(plans_total.map(plan=>plan.districts()).flat());
  const schools_total = uniq(plans_total.map(plan=>plan.schoolNames()).flat());
  //const units_total  = plans_total.map(p => p.planItems.map(pi => pi.units).flat()).flat();
  //const subcategories_total = plans_total.map(p => p.planItems.map(pi => pi.subcategories).flat()).flat();
  const units_total  = units.find({}).fetch();
  const subcategories_total = subcategories.find({}).fetch();
  const data = { units_total, subcategories_total, schools_total, districts_total, valueforMapLocation };
  return {
    data,
    isLoading: false
  };
})(SelectWrapper);
