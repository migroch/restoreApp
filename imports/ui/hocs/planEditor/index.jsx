import React, { useState } from 'react';
import { useHistory } from "react-router-dom";
import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
import { planitems, plans } from '../../../api/collections';
import Schemas from '../../../api/schemas'
import PlanItem from '../../reusable/PlanItem';
import { Input, Select, Button, Form } from 'antd';
import PlanEditForm from '../../reusable/PlanEditForm'
import GuidanceItems from '../GuidanceItems'
import './index.scss'

const { Option } = Select;

const scenarios = Schemas.scenarios;

const PlanEdit = ({ isLoading, data, id }) => {
  if (isLoading) return null
  if (!id) console.log("PlanEdit: new plan edit now")

  const history = useHistory();
  const [isEditable, setIsEditable] = useState(true)
  const { planItemIds } = data
  const colors = {
    "High Restrictions": "red",
    "Medium Restrictions": "yellow",
    "Low Restrictions": "green"
  }

  return (
    <>
      <GuidanceItems />
       
      <div className="plan-edit">
	<div className="content-wrapper">
	  <div className="plan-edit-form">
	    <PlanEditForm data={data} id={id}/>
	  </div>
	  <div className="content-detail">
	    {
	      planItemIds.map(id=><PlanItem id={id} disabled={false} key={"planItem"+id}/>)
	    }
          </div>
	</div>
      </div>
      
    </>
  )
}


PlanEditWrapper = withTracker(({match}) => {
  const handles = [
    Meteor.subscribe('planitems'),
    Meteor.subscribe('plans'),
  ];
  const isLoading = handles.some(handle => !handle.ready());
  const plan_id = match.params.id
  console.log("plan_id: ", plan_id)
  //in case add new plans
  if(!plan_id) {
    console.log("we are going to add new plan now")
    return {
      isLoading: false,
      id: plan_id,
      data: {
        title:'',
        scenario:'',
        planItemIds:[]
      }
    }
  }

  if(isLoading){
    return {
      data: null,
      id: plan_id,
      isLoading: true
    };
  }

  //in case edit the plan
  return {
    data: plans.findOne(plan_id),
    id: plan_id,
    isLoading: false
  };
})(PlanEdit);

export default PlanEditWrapper
