import React, { useState, useEffect } from 'react';
import { useHistory } from "react-router-dom";
import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
import { planitems, plans } from '../../../api/collections';
import Schemas from '../../../api/schemas'
import PlanItemList from '../../reusable/PlanItemList';
import { Select } from 'antd/dist/antd.min.js';
import PlanEditForm from '../../reusable/PlanEditForm'
import GuidanceItems from '../GuidanceItems'
import { plansQueryWithFilter } from '../../../api/queries'
import './index.scss'

const { Option } = Select;

const scenarios = Schemas.scenarios;

const PlanEdit = ({ isLoading, data, id, changemode, oncreatedPlan }) => {
  if (isLoading) return null
  const [planId, setPlanId] = useState(id)
  const history = useHistory();
  const [isEditable, setIsEditable] = useState(true)
  const { planItems } = data
  useEffect(() => {
    if (id != planId) setPlanId(id)
  }, [id])
  console.log("planId:", planId)
  return (
    <>
      {/* <GuidanceItems /> */}
      <div className="plan-edit container">
      	<div className="content-wrapper">
          <div className="plan-edit-form">
            <PlanEditForm data={data} id={planId} onCreatedPlan={id=>oncreatedPlan(id)} changemode={changemode}/>
          </div>
{         
          planId &&<div className="plan-item-list">
            <PlanItemList data={planItems} planId={planId} editable={isEditable}/>
          </div>
}
      	</div>
      </div>
    </>
  )
}


PlanEditWrapper = withTracker(({id}) => {
  const handles = [
    Meteor.subscribe('planitems'),
    Meteor.subscribe('plans'),
  ];
  const isLoading = handles.some(handle => !handle.ready());
  // const plan_id = match.params.id

  //in case add new plans
  if(!id) {
    return {
      isLoading: false,
      // id: plan_id,
      data: {
        title:'',
        scenario:'',
        planItems:[]
      }
    }
  }

  if(isLoading){
    return {
      data: null,
      // id: plan_id,
      isLoading: true
    };
  }

  //in case edit the plan
  const plansQuery_Clone = plansQueryWithFilter.clone({id});
  plansQuery_Clone.subscribe();
  const data = plansQuery_Clone.fetch()
  return {
    data:data[0],
    // id: plan_id,
    isLoading: false
  };
})(PlanEdit);

export default PlanEditWrapper
