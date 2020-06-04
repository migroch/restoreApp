import React, { useState } from 'react';
import { Meteor } from 'meteor/meteor';
import SelectWrapper from '../../reusable/SelectWrapper';
import { withTracker } from 'meteor/react-meteor-data';
import { planitems, plans } from '../../../api/collections';
import  Schemas from '../../../api/schemas';
import PlanItem from '../../reusable/PlanItem';
import { Input, Select, Button } from 'antd';
import { DownloadOutlined } from '@ant-design/icons';
import { useHistory } from "react-router-dom";
import './index.scss';

const { Option } = Select;

const scenarios = Schemas.scenarios
const Tags = (data) => data.map(item => <div className="custom-tag" key={item+"tag"}>{item}</div>)

const PlanWrapper = ({data}) => {
  const history = useHistory();
  const [isDetailVisible, setIsDetailVisible] = useState(false)
  const [ title, setTitle ] = useState(data.title)
  const [ scenario, setScenario ] = useState(data.scenario)
  const { planItemIds, _id } = data
  const id = _id
  const colors = {
    "High Restrictions": "red",
    "Medium Restrictions": "yellow",
    "Low Restrictions": "green"
  }
  const deletePlanWithId = ()=>{
    console.log("ddddddd")
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
          <div>Applies To:</div>
          <div className="label_1">
            Districts: 
            {/* <div className="tags-wrapper">
              {Tags(districts)}
            </div> */}

          </div>
          <div className="label_1">
            Schools
            {/* <div className="tags-wrapper">
              {Tags(schools)}
            </div> */}
          </div>
        </div>
        <div className="content-detail" style={{display: isDetailVisible ? "block" : "none"}}>
          {
            planItemIds.map(id=><PlanItem id={id} disabled key={"planItem"+id}/>)
          }
        </div>
      </div>
    </div>
  )
}

PlansListView = ({initial_plans, isLoading})=>{
  if (isLoading) return null
  const [plans, setPlans] = useState(initial_plans)
  return (
    <div className="plans-wrapper">
    {
      plans.map((plan, index)=><PlanWrapper  data={plan} key={"plan"+index} />)
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
  return {
    initial_plans: plans.find({}).fetch(),
    isLoading: false
  };
})(PlansListView);

PlanView = () => {
  const [searchQuery, setSearchQuery] = useState({})
  return (
    <div className="plan-view">
      {/* set searchquery */}
      <SelectWrapper />    
      <PlansListView search={searchQuery} />
    </div>
  )
}


export default PlanView
