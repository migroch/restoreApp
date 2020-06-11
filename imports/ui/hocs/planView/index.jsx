import React, { useState } from 'react';
import { Meteor } from 'meteor/meteor';
import SelectWrapper from '../../reusable/SelectWrapper';
import { withTracker } from 'meteor/react-meteor-data';
import { planitems, plans } from '../../../api/collections';
import  Schemas from '../../../api/schemas';
import PlanItemList from '../../reusable/PlanItemList';
import { Input, Select, Button, Tooltip, Breadcrumb } from 'antd/dist/antd.min.js';
import { useHistory } from "react-router-dom";
import { uniq, isEmpty } from 'lodash'
import { plansQuery, plansQueryWithFilter } from '../../../api/queries'
import './index.scss';

import styled from 'styled-components';
import {MoreHorizontal} from 'styled-icons/feather/MoreHorizontal';
import {Copy} from 'styled-icons/feather/Copy';
//import {DeleteOutline} from 'styled-icons/material/DeleteOutline';
import {Delete} from "styled-icons/feather/Delete";
import {Edit3} from 'styled-icons/feather/Edit3';

const { Option } = Select;
const scenarios = Schemas.scenarios
const Tags = (data) => data.map(item => <div className="" key={item+"tag"}><p className="m-0"><small>{item}</small></p></div>)

const PlanWrapper = ({data}) => {
  const history = useHistory();
  const [isDetailVisible, setIsDetailVisible] = useState(false)
  const [ title, setTitle ] = useState(data.title)
  const [ scenario, setScenario ] = useState(data.scenario)
  const { planItems, _id } = data
  const id = _id
  const bgs = {
    "High Restrictions": "bg-danger",
    "Medium Restrictions": "bg-warning",
    "Low Restrictions": "bg-success"
  }
  
  var plan_districts = []
  planItems.map(item => {
    const { assignedTo } = item
    //  const item_schools = assignedTo.map(user=>user.school)
    const item_districts = assignedTo.map(user=>user.district)
      plan_districts.push(...item_districts)
  })  
    plan_districts = uniq(plan_districts)

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

      <div className="col-sm label_1 d-flex flex-column text-center">
	<h6>Units</h6>
	
  <p><small>
    <Breadcrumb separator=">">
      <Breadcrumb.Item>Category</Breadcrumb.Item>
      <Breadcrumb.Item>Subcategory</Breadcrumb.Item>
      <Breadcrumb.Item>Unit</Breadcrumb.Item>
    </Breadcrumb>
  </small></p>
  
  {/* <div className="tags-wrapper">
  {Tags(districts)}
  </div> */}
      </div>

      <div className="col-sm label_1 d-flex flex-column text-center">
  <h6>Dimensions</h6>
  {/* <div className="tags-wrapper">
  {Tags(districts)}
  </div> */}
      </div>

      <div className="col-sm label_1  d-flex flex-column text-center">
  <h6>Districts </h6>
  <div className="d-flex flex-column">
  {Tags(plan_districts)}
  </div>
      </div>
      
            <div className="col-sm label_1  d-flex flex-column text-center">
  <h6>Schools</h6>
  {/* <div className="tags-wrapper">
  {Tags(schools)}
  </div> */}
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

PlansListView = ({plans_data, isLoading})=>{
  if (isLoading) return null;
  // const [plans, setPlans] = useState(plans_data)
  return (
      <div className="plans-wrapper">
  {
    plans_data.map((plan)=><PlanWrapper  data={plan} key={"plan"+plan._id} />)
  }
      </div>
    )
}

PlansListView = withTracker(({search}) => {
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
  const plansQuery_Clone = plansQueryWithFilter.clone(search);
  plansQuery_Clone.subscribe();
  let plans_data = plansQuery_Clone.fetch()
  plans_data = plans_data.filter(plan=>!isEmpty(plan.planItems))

  return {
    plans_data,
    isLoading: false
  };
})(PlansListView);

PlanView = () => {
  const [searchQuery, setSearchQuery] = useState({})
  const history = useHistory();
  const setQuery = (query) => setSearchQuery(query)
  return (
    <div className="plan-view container">
      {/* set searchquery in selectwrapper */}
      <SelectWrapper onChangeQuery={setQuery}/>    
      <PlansListView search={searchQuery} />
      <div className="add-btn">
        <img src="icons/add.png" onClick={()=>history.push(`/plan-editor`)}/>
      </div>  
    </div>
  )
}

export default PlanView
