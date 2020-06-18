import React, { useState } from 'react';
import { Meteor } from 'meteor/meteor';
import SelectWrapper from '../../reusable/SelectWrapper';
import SearchWrapper from '../../reusable/SearchWrapper';
import { withTracker } from 'meteor/react-meteor-data';
import { planitems, plans, PlansIndex, PlanItemsIndex } from '../../../api/collections';
import  Schemas from '../../../api/schemas';
import PlanItemList from '../../reusable/PlanItemList';
import { useHistory, useLocation } from "react-router-dom";
import { uniq, isEmpty, intersection } from 'lodash'
import { plansQuery, plansQueryWithFilter } from '../../../api/queries'
import queryString from 'query-string';
import './index.scss';

import { Input, Select, Button, Tooltip, Breadcrumb } from 'antd/dist/antd.min.js';
import styled from 'styled-components';
import {MoreHorizontal} from 'styled-icons/feather/MoreHorizontal';
import {Copy} from 'styled-icons/feather/Copy';
//import {DeleteOutline} from 'styled-icons/material/DeleteOutline';
import {Delete} from "styled-icons/feather/Delete";
import {Edit3} from 'styled-icons/feather/Edit3';

const { Option } = Select;
const scenarios = Schemas.scenarios
const Tags = (data) => data.map(item => <div className="" key={item+"tag"}><p className="m-0"><small>{item}</small></p></div>)

// Plan    
let PlanWrapper = ({data}) => {
  const history = useHistory();
  const [isDetailVisible, setIsDetailVisible] = useState(false);
  const [ title, setTitle ] = useState(data.title);
  const [ scenario, setScenario ] = useState(data.scenario);
  const { planItems, _id } = data;
  const id = _id;
  const bgs = {
    "High Restrictions": "bg-danger",
    "Medium Restrictions": "bg-warning",
    "Low Restrictions": "bg-success"
  }

  let plan_units = uniq(data.planItems.map( pi => pi.units ).flat());
  let plan_dimensions = uniq(data.dimensions());
  let plan_districts = uniq(data.districts()) ;
  let plan_schools = uniq(data.schools().map(s => s.name));
  let plan_users = uniq(data.userNames());

  const deletePlanWithId = ()=>{
    Meteor.call('plans.remove', id, (err, res) => {
      if (err) {
	alert(err);
      } else {
	history.push('/plan-viewer')
      }
    })
  }
  
  const plan_bg = bgs[scenario]
  return (
    
    <div className="plan-wrapper rounded-top" onClick={()=>setIsDetailVisible(!isDetailVisible)}>         

      <div className={"header d-flex " + plan_bg} >
	<p className="mr-auto mt-auto mb-auto ml-2">{scenario}</p>
	<div className="right ml-auto mb-auto mt-auto p-1" >
	  <Tooltip  placement="bottom" title="Edit">
	    <span className="icon mr-2 ml-2" onClick={()=>history.push(`/plan-editor/${id}`)}><Edit3  size="20" /> </span>
	  </Tooltip >
	  <Tooltip  placement="bottom" title="Copy">
	    <span className="icon mr-2 ml-2"><Copy  size="20" /></span>
	  </Tooltip >
	  <Tooltip  placement="bottom" title="Delete">
	    <span className="icon mr-2 ml-2" onClick={deletePlanWithId}><Delete size="20" /></span>
	  </Tooltip >
	</div>
      </div>

      <div className="content-wrapper">
	<div className="content">

	  <div className="text-center"><h4>{ title }</h4></div>

	  <div className="row">


	    <div className="col-md-auto label_1 d-flex flex-column text-center">
	      <h6>Map Location</h6>
	      {
		plan_units.map( (u, index) => {
		  if (u && u.subcategory && u.subcategory.category){
		    return(
		      <div key={index}>
			<Breadcrumb separator=">" style={{'fontSize':'smaller'}}>
			  <Breadcrumb.Item>{u.subcategory.category.name}</Breadcrumb.Item>
			  <Breadcrumb.Item>{u.subcategory.name}</Breadcrumb.Item>
			  <Breadcrumb.Item>{u.name}</Breadcrumb.Item>
			</Breadcrumb>
		      </div>
		    )
		  }
		})
	      }
	    </div>

	    <div className="col-md-auto label_1 d-flex flex-column text-center">
	      <h6>Dimensions</h6>
	      <div className="d-flex flex-column">
		{Tags(plan_dimensions)}
	      </div>
	    </div>

	    <div className="col-md-auto label_1  d-flex flex-column text-center">
	      <h6>Districts </h6>
	      <div className="d-flex flex-column">
		{Tags(plan_districts)}
	      </div>
	    </div>

	    <div className="col-md-auto label_1  d-flex flex-column text-center">
	      <h6>Schools</h6>
	      <div className="d-flex flex-column">
		{Tags(plan_schools)}
	      </div>
	    </div>
	    
            <div className="col-md-auto label_1  d-flex flex-column text-center">
	      <h6>Users</h6>
	      <div className="d-flex flex-column">
		{Tags(plan_users)}
	      </div>
            </div>

	  </div>
	</div>
	<div className="plan-item-list" style={{display: isDetailVisible ? "block" : "none"}}>
	  <PlanItemList data={planItems} editable={false}/>
	</div>
      </div>
    </div>
  )
}
// List of Plans data layer
PlanWrapper = withTracker(({id}) => {
  const plansQuery_Clone = plansQueryWithFilter.clone({id});
  plansQuery_Clone.subscribe();
  let data = plansQuery_Clone.fetchOne()
  return {
    data,
    isLoading: false
  };
})(PlanWrapper);
// List of Plans
PlansListView = ({plans_data, plan_ids, isLoading})=>{
  if (isLoading) return null;
  // const [plans, setPlans] = useState(plans_data)
  return (
    <div className="plans-wrapper">
      {
	plan_ids.map((id)=><PlanWrapper  id={id} key={"plan"+id} />)
      }
    </div>
  )
}

// List of Plans data layer
PlansListView = withTracker(({searchquery, searchbar}) => {
  const handles = [
    Meteor.subscribe('planitems'),
    Meteor.subscribe('plans'),
  ];

  const isLoading = handles.some(handle => !handle.ready());
  if(isLoading){
    return {
      initial_plans: null,
      isLoading: true
    };
  }
  
  //-------1.search with searchbar----------
  // search in planitems (item, dimension)
  const planItem_ids = PlanItemsIndex.search(searchbar).fetch().map(pi=>pi.__originalId)
  // get plan_ids from planitem_ids
  const plan_ids_index_1 = planItem_ids.map(pi_id=>plans.find({planItemIds: { $elemMatch: {$eq:pi_id}} }).fetch().map(p=>p._id)).flat()
  // search in plan (title, scenario)
  const plan_ids_index_2 = PlansIndex.search(searchbar).fetch().map(p=>p.__originalId)
  const planIdswithSearchBar = uniq([...plan_ids_index_1, ...plan_ids_index_2])

  //-------2.search with select filter--------
  const plansQuery_Clone = plansQueryWithFilter.clone(searchquery);
  plansQuery_Clone.subscribe();
  let plans_data = plansQuery_Clone.fetch()

  //filtering plans_data
  plans_data = plans_data.filter(plan=>{
    //in case planItems is empty
    if (isEmpty(plan.planItems)) return false
    //in case unit & subcategory & category undefined
    let plan_units = uniq(plan.planItems.map( pi => pi.units ).flat());
    let flag = false
    plan_units.every( u => {
      if (u && u.subcategory && u.subcategory.category) {
        flag = true
        return false
      }
      return true
    })
    //in case districts and schools are empty
    let plan_districts = plan.districts()
    let plan_schools = plan.schools()
    flag = flag && !isEmpty(plan_districts) && !isEmpty(plan_schools)
    return flag
  })
  // filtered plan ids
  const planIdswithFilter = plans_data.map(plan=>plan._id)
  //------3.intersection of two result from filter and searchbar-------
  const plan_ids = intersection(planIdswithSearchBar, planIdswithFilter)
  return {
    plans_data,
    plan_ids,
    isLoading: false
  };
})(PlansListView);

// Plan Viewer Container
PlanView = () => {
  
  const history = useHistory();
  const location = useLocation();
  const initial_query = queryString.parse(location.search)
  
  const [searchQuery, setSearchQuery] = useState(initial_query)
  const setQuery = (query) => setSearchQuery(query)

  const [searchbar, setSearchbar] = useState('')
  const searchWithSearchbar = v => setSearchbar(v)

  return (
    <div className="plan-view container">
      {/* set searchquery in selectwrapper */}
      <SearchWrapper onSearchWithSearchbar={searchWithSearchbar}/>
      <SelectWrapper onChangeQuery={setQuery} value={initial_query}/>    
      <PlansListView searchquery={searchQuery} searchbar={searchbar}/>
      <div className="add-btn">
        <img src="icons/add.png" onClick={()=>history.push(`/plan-editor`)}/>
      </div>  
    </div>
  )
}

export default PlanView
