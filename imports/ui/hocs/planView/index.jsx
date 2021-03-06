import React, { useState, useContext } from 'react';
import { Meteor } from 'meteor/meteor';
import FilterForPlan from '../../reusable/FilterForPlan';
import SearchWrapper from '../../reusable/SearchWrapper';
import { withTracker } from 'meteor/react-meteor-data';
import { subcategories, planitems, plans, PlansIndex, PlanItemsIndex } from '../../../api/collections';
import  Schemas from '../../../api/schemas';
import PlanItemList from '../../reusable/PlanItemList';
import { useHistory, useLocation } from "react-router-dom";
import { uniq, isEmpty, intersection } from 'lodash'
import { plansQueryWithFilter } from '../../../api/queries'
import UserAvatar from "../../reusable/UserAvatar";
import queryString from 'query-string';
import './index.scss';

import { Input, Select, Button, Tooltip, Breadcrumb, List, Tag, Popconfirm, Divider } from 'antd/dist/antd.min.js';

import styled from 'styled-components';
import {MoreHorizontal} from 'styled-icons/feather/MoreHorizontal';
import {Copy} from 'styled-icons/feather/Copy';
//import {DeleteOutline} from 'styled-icons/material/DeleteOutline';
//import {Delete} from "styled-icons/feather/Delete";
import {Trash} from "styled-icons/feather/Trash";
import {Edit3} from 'styled-icons/feather/Edit3';
import {PlusCircle} from 'styled-icons/feather/PlusCircle';
import {FilePlus} from 'styled-icons/feather/FilePlus';
import UserContext from "../../context/user";

const { Option } = Select;
const scenarios = Schemas.scenarios
const Dimensions = Schemas.dimensions;
const dimColors = ["magenta","volcano","orange","blue","geekblue","purple"];
const catColors = {'Health & Safety / Operations':'#FF9263', 'Instructional Programs':'#00a6a3',  'Student Support & Family Engagement':'#2AAAE1'}

const Tags = (data) =>{
  return(
    data.map( (item, index) => {
      let color = dimColors[Dimensions.findIndex(D => D==item)];
      return(
	<Tag key={index} color={color}>{item}</Tag>
      )
    })
  )
}

// Plan    
let PlanWrapper = ({data, editPlanWithID, isAuthenticated}) => {
  if (!data) return(null);
  const history = useHistory();
  const [isDetailVisible, setIsDetailVisible] = useState(false);
  const [ title, setTitle ] = useState(data.title);
  const [ scenario, setScenario ] = useState(data.scenario);
  const { isAuthModalOpened, setAuthModalState } = useContext(UserContext);
  const { planItems, _id, planItemIds } = data;
  const id = _id;
  const bgs = {
    "High Restrictions": "bg-danger",
    "Mid Restrictions": "bg-warning",
    "Low Restrictions": "bg-success"
  }

  let plan_units = uniq(data.planItems.map( pi => pi.units ).flat());
  let plan_unitIds = uniq(planItems.map(pi=>pi.unitIds).flat());
  let plan_dimensions = uniq(data.dimensions());
  let plan_districts = uniq(data.districts()) ;
  let plan_schools = uniq(data.schools().map(s => s.name));
  let plan_users = uniq(data.userIds());

  const deletePlanWithId = (e)=>{
    //e.stopPropagation();
    Meteor.call('plans.remove', id, (err, res) => {
      if (err) {
	alert(err);
      } else {
	history.push('/plan-viewer')
      }
    })
  }

  const copyPlanWithId = (e)=>{
    //e.stopPropagation();
    Meteor.call('plans.copy', id, (err, res) => {
      if (err) {
	alert(err);
      } else {
	history.push('/plan-viewer');
	window.scrollTo(0, 0);
      }
    })
  }
  const editPlan = id => {
    if (isAuthenticated)
      editPlanWithID(id)
    else {
      setAuthModalState(true);
    }
  }
  const deletePlan = id => {
    if (isAuthenticated)
      deletePlanWithId(id)
    else {
      setAuthModalState(true);
    }
  }  
  const copyPlan = id => {
    if (isAuthenticated)
      copyPlanWithId(id)
    else {
      setAuthModalState(true);
    }
  }    
  const plan_bg = bgs[scenario]
 
  return (
    
    <div className="plan-wrapper container-fluid rounded-top p-0" onClick={()=>setIsDetailVisible(!isDetailVisible)}>         

      <div className={"header d-flex " + plan_bg} >
	<p className="mr-auto mt-auto mb-auto ml-2">{scenario}</p>

	<div className="d-inline-flex justify-self-center mb-auto mt-auto">
	  {
	    
	    plan_users.map((user, index) => <UserAvatar key={index} user={user} shape="circle" size="extra-small" className="mx-1"/>)
	  }
	</div>
	
	<div className="right ml-auto mb-auto mt-auto p-1" onClick={e=> e.stopPropagation()} >
	  <Tooltip  placement="bottom" title="Edit">
	    <span className="icon mr-2 ml-2" onClick={()=>editPlan(id)}><Edit3  size="20" /> </span>
	  </Tooltip >
	  <Tooltip  placement="bottom" title="Copy">
	    <span className="icon mr-2 ml-2" onClick={()=>copyPlan(id)}><Copy  size="20" /></span>
	  </Tooltip >
    <Popconfirm
        placement="topRight"
        title={'Are you sure to delete this plan?'}
        onConfirm={()=>deletePlan(id)}
        okText="Yes"
        cancelText="No"
      >
      <Tooltip  placement="bottom" title="Delete">
        <span className="icon mr-2 ml-2"><Trash  size="20"/></span>
      </Tooltip >
      </Popconfirm>    

	</div>
      </div>

      <div className="content-wrapper">
	<div className="content">

	  <div className="text-center"><h4>{ title }</h4></div>

	  <div className="row">

	    <div className="col-md-6 label_1 d-flex flex-column">
              <h6 className="align-self-start">Logistic Tree Locations</h6>
	      {
		plan_units.map( (u, index) => {
		  if (u && u.subcategory && u.subcategory.category){
		    return(
		      <div key={index} className="d-flex align-self-start" >
			<Breadcrumb separator=">" style={{color:catColors[u.subcategory.category.name]}}>
			  <Breadcrumb.Item>{u.subcategory.category.name}</Breadcrumb.Item>
			  <Breadcrumb.Item>{u.subcategory.name}</Breadcrumb.Item>
			  <Breadcrumb.Item>{u.name}</Breadcrumb.Item>
			</Breadcrumb>
		      </div>
		    )
		  }
		})
	      }
	      {
		plan_unitIds.map( (id, index) =>{
		  let s = subcategories.findOne(id);
		  if (s && s.categoryName()){
		    return(
		      <div key={index}  className="d-flex align-self-start" >
			<Breadcrumb separator=">" style={{color:catColors[s.categoryName()]}}>
			  <Breadcrumb.Item>{s.categoryName()}</Breadcrumb.Item>
			  <Breadcrumb.Item>{s.name}</Breadcrumb.Item>
			</Breadcrumb>
		      </div>
		    )
		  }
		})
	      }
	    </div>

	    <div className="col-md-2 label_1 d-flex flex-column text-center">
	      <h6>Organizational Units</h6>
	      <div className="d-flex flex-column">
		{Tags(plan_dimensions)}
	      </div>
	    </div>

	    <div className="col-md-2 label_1  d-flex flex-column text-center">
	      <h6>Districts </h6>
	      <div className="d-flex flex-column">
		{plan_districts.map((item, index) => <p className="m-0" key={index}><small>{item}</small></p>)}
	      </div>
	    </div>

	    <div className="col-md-2 label_1  d-flex flex-column text-center">
	      <h6>Schools</h6>
	      <div className="d-flex flex-column">
		{plan_schools.map((item, index) => <p className="m-0" key={index}><small>{item}</small></p>)}
	      </div>
	    </div>
	    
	  </div>
	</div>
	
	<div className="plan-item-list" style={{display: isDetailVisible ? "block" : "none"}}>
	  <Divider>Plan Items</Divider>
	  <PlanItemList data={planItemIds} editable={false}/>
	</div>
      </div>
    </div>
  )
}

//  Plan data layer
PlanWrapper = withTracker(({id}) => {
  const plansQuery_Clone = plansQueryWithFilter.clone({id});
  plansQuery_Clone.subscribe();
  let data = plansQuery_Clone.fetchOne();
  return {
    data,
    isAuthenticated: Meteor.userId() !== null,
    isLoading: false
  };
})(PlanWrapper);

// List of Plans
PlansListView = ({plan_ids, isLoading, editPlanWithID})=>{
  if (isLoading) return null;
  // const [plans, setPlans] = useState(plans_data)
  return (
    <div className="plans-wrapper container-fluid">
      <List dataSource={plan_ids}
	    //loading={plan_ids.length ? false : true}
	    locale={{emptyText: 'No Plans Found'}}
	    renderItem={  id =>(
		<List.Item key={"plan-"+id}>
		  <PlanWrapper  id={id}  editPlanWithID={editPlanWithID}/>
		</List.Item>
	      )}
      >
      </List>
    </div>
  )
}

// List of Plans data layer
PlansListView = withTracker(({searchquery, searchbar}) => {
  const handles = [
    Meteor.subscribe('subcategories'),
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
  let planIdswithSearchBar
  if (searchbar != '') {
    const planItem_ids = PlanItemsIndex.search(searchbar).fetch().map(pi=>pi.__originalId)
    // get plan_ids from planitem_ids
    const plan_ids_index_1 = planItem_ids.map(pi_id=>plans.find({planItemIds: { $elemMatch: {$eq:pi_id}} }, { sort: {lastedittime: -1}}).fetch().map(p=>p._id)).flat()
    // search in plan (title, scenario)
    const plan_ids_index_2 = PlansIndex.search(searchbar).fetch().map(p=>p.__originalId)
    planIdswithSearchBar = uniq([...plan_ids_index_1, ...plan_ids_index_2])
  }

    //-------2.search with select filter--------
  const plansQuery_Clone = plansQueryWithFilter.clone(searchquery);
  plansQuery_Clone.subscribe();
  let plans_data = plansQuery_Clone.fetch()

    // in case search based on scenario, it doesn't matter the planitems are empty
    let isOnlyScenarioSearch = true
  for(var key in searchquery) {
    if (key != 'scenario')
      isOnlyScenarioSearch = isOnlyScenarioSearch && (!searchquery[key]);
  }
  //filtering plans_data
  if (!isOnlyScenarioSearch) {
    plans_data = plans_data.filter(plan=>{
      //in case planItems is empty
      if (isEmpty(plan.planItems)) return false
      //in case unit & subcategory & category undefined
      let plan_units = uniq(plan.planItems.map( pi => pi.units ).flat());
      let plan_subcategories = uniq(plan.planItems.map( pi => pi.subcategories).flat());
      let flag = false
      plan_units.every( u => {
	if (u && u.subcategory && u.subcategory.category) {
          flag = true
          return false
	}
	return true
      });
      plan_subcategories.every( s => {
	if (s && s.category) {
          flag = true
          return false
	}
	return true
      });
      //in case districts and schools are empty
      let plan_districts = plan.districts();
      let plan_schools = plan.schools();
      flag = flag && !isEmpty(plan_districts) && !isEmpty(plan_schools);
      return flag
    })

  }
    // filtered plan ids
    const planIdswithFilter = plans_data.map(plan=>plan._id)
  //------3.intersection of two result from filter and searchbar-------
  let plan_ids
  if (searchbar != '') {
    plan_ids = intersection( planIdswithFilter, planIdswithSearchBar)  
  } else {
    plan_ids = planIdswithFilter
  }
  return {
    plan_ids,
    isLoading: false
  };
})(PlansListView);


// Plan Viewer Container
PlanView = ({editPlanWithID, isPlanView, isAuthenticated}) => {

  const history = useHistory();
  const location = useLocation();
  const initial_query = queryString.parse(location.search);


  let wheight = window.innerHeight - $('.navbar').outerHeight();
  let [height, setHeight] = useState('auto');
  if  (wheight && height != wheight)  setHeight(wheight) ;
  const [searchQuery, setSearchQuery] = useState(initial_query);
  const [refreshKey, setRefreshKey] = useState(Date.now());
  const setQuery = (query) => setSearchQuery(query);

  const [searchbar, setSearchbar] = useState('');
  const {  isAuthModalOpened, setAuthModalState } = useContext(UserContext);
  
  const addNewPlan = ()=>{
    
    if (isAuthenticated) {
      history.push('/plan-viewer')
      setSearchQuery({})
      setSearchbar('')
      setRefreshKey(Date.now())
      const newplan = Meteor.call('plans.add', {title: "NEW PLAN", scenario:'High Restrictions', planItemIds:[]}, (err, res) => {
        if (err) {
          alert(err);
        } else {
          //history.push('/plan-viewer')
        }
      })
    } else {
      setAuthModalState(true)
    }

  }


  return (
    <div className="plan-view container-fluid" style={{height: height}}>
      <SearchWrapper onChangeSearchbar={v => setSearchbar(v)} key={"searchbar"+refreshKey}/>
      <FilterForPlan onChangeQuery={setQuery} value={initial_query} key={"filter"+refreshKey}/>

      {/* <div className="container-fluid text-center  mt-2">
      <Tooltip  placement="bottom" title="Add New Plan">
      <span className="add-btn" onClick={addNewPlan}><PlusCircle size="40"  /></span>
      </Tooltip >
      </div> */}
      
      {isPlanView &&
      <PlansListView searchquery={searchQuery} searchbar={searchbar} editPlanWithID={editPlanWithID}/>}

      <div className="add-btn-div container-fluid text-center mt-3" onClick={()=>window.scrollTo(0,0)}>
	{/* 	  <Tooltip  placement="top" title="Add New Plan"> */}
	    <span className="add-btn badge badge-pill badge-dark" onClick={addNewPlan}><PlusCircle size="40"  />Add a new plan</span>
	 {/*  </Tooltip > */}
	  
      </div>
      
    </div>
  )
}



PlanView = withTracker(() => {
  return {
    isAuthenticated: Meteor.userId() !== null,
    
  };
})(PlanView);
export default PlanView
