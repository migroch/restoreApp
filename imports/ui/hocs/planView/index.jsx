import React, { useState } from 'react';
import { Meteor } from 'meteor/meteor';
import SelectWrapper from '../../reusable/SelectWrapper';
import { withTracker } from 'meteor/react-meteor-data';
import { planitems, plans } from '../../../api/collections';
import  Schemas from '../../../api/schemas';
import PlanItemList from '../../reusable/PlanItemList';
import { Input, Select, Button } from 'antd/dist/antd.min.js';
import { useHistory } from "react-router-dom";
import { uniq, isEmpty } from 'lodash'
import { plansQuery, plansQueryWithFilter } from '../../../api/queries'
import './index.scss';

const { Option } = Select;

const scenarios = Schemas.scenarios
const Tags = (data) => data.map(item => <div className="custom-tag" key={item+"tag"}>{item}</div>)

   const PlanWrapper = ({data}) => {
   const history = useHistory();
   const [isDetailVisible, setIsDetailVisible] = useState(false)
   const [ title, setTitle ] = useState(data.title)
   const [ scenario, setScenario ] = useState(data.scenario)
   const { planItems, _id } = data
   const id = _id

   var plan_districts = []
   planItems.map(item => {
     const { assignedTo } = item
    //  const item_schools = assignedTo.map(user=>user.school)
     const item_districts = assignedTo.map(user=>user.district)
     plan_districts.push(...item_districts)
   })  
   plan_districts = uniq(plan_districts)

   const colors = {
   "High Restrictions": "red",
   "Medium Restrictions": "yellow",
   "Low Restrictions": "green"
   }
   const deletePlanWithId = ()=>{
   Meteor.call('plans.remove', id, (err, res) => {
   if (err) {
   alert(err);
   } else {
   history.push('/plan-viewer')
   }
   })

   }
   const plan_color = colors[scenario]
   return (
   <div className="plan-wrapper">         
   <div className="header" style={{backgroundColor: plan_color}}>
   <div className="right">
   <img src="icons/edit.png" onClick={()=>history.push(`/plan-editor/${id}`)}/>
   <img src="icons/delete.png" onClick={deletePlanWithId}/>
   <img src="icons/copy.png" />
   <img src="icons/more.png" onClick={()=>setIsDetailVisible(!isDetailVisible)}/>
   </div>
   <div className="title">{ title }</div>
   </div>
   <div className="content-wrapper">
   <div className="content">
   <div className="label_1">
   Districts: 
   <div className="tags-wrapper">
   {Tags(plan_districts)}
   </div>
  </div>
  <div className="label_1">
    Schools
    {/* <div className="tags-wrapper">
    {Tags(schools)}
    </div> */}
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
  if (isLoading) return null
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