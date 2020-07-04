import React, { useState, useEffect } from 'react';
import { useHistory } from "react-router-dom";
import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
import { planitems, plans } from '../../../api/collections';
import Schemas from '../../../api/schemas'
import PlanItemList from '../../reusable/PlanItemList';
import { Select } from 'antd/dist/antd.min.js';
import PlanEditForm from '../../reusable/PlanEditForm'
import { plansQueryWithFilter } from '../../../api/queries'
import './index.scss'

const { Option } = Select;

const scenarios = Schemas.scenarios;

const PlanEdit = ({ isLoading, data, id, changemode, oncreatedPlan }) => {
  if (isLoading) return null
  if (!id) return null
  const [planId, setPlanId] = useState(id)
  const [isEditable, setIsEditable] = useState(true)
  const history = useHistory();
  const { planItemIds } = data
  const [ planItemOrders, setPlanItemOrders] = useState(planItemIds)
  useEffect(() => {
    if (id != planId) setPlanId(id)
  }, [id])

  return (
    <>
      <div className="plan-edit container">
      	<div className="content-wrapper">
          <div className="plan-edit-form">
            <PlanEditForm data={data} id={planId} onCreatedPlan={id=>oncreatedPlan(id)} changemode={changemode} planItemOrders={planItemOrders}/>
          </div>
{         
          planId &&<div className="plan-item-list">
            <PlanItemList data={planItemIds} planId={planId} editable={isEditable} onChangePlanItemsOrder={v => setPlanItemOrders(v)}/>
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
  let data = plansQuery_Clone.fetch()[0]
  data.planItemIds = data.planItemIds.filter(item=>item != "false")
  return {
    data,
    // id: plan_id,
    isLoading: false
  };
})(PlanEdit);

export default PlanEditWrapper
