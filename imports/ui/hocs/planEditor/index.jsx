import React, { useState, useEffect } from 'react';
import { useHistory } from "react-router-dom";
import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
import PlanItemList from '../../reusable/PlanItemList';
import PlanEditForm from '../../reusable/PlanEditForm'
import { plansQueryWithFilter } from '../../../api/queries'
import { isEmpty } from 'lodash'
import { Button, Modal } from 'antd/dist/antd.min.js';
import { units, subcategories } from "../../../api/collections";
import './index.scss'

const PlanEdit = ({ isLoading, data, id, changemode, oncreatedPlan }) => {
  if (isLoading) return null
  if (!id) return null
  const [planId, setPlanId] = useState(id)
  const [isEditable, setIsEditable] = useState(true)
  const history = useHistory();
  const { planItemIds, title, scenario } = data
  const [ planItemOrders, setPlanItemOrders] = useState(planItemIds)
  const [guidance, setGuidance] = useState({visible: false, selectedItems: []}) ;
  onChangePlanItemsOrder = v => {
    setPlanItemOrders(v)
  }

  useEffect(() => {
    if (id != planId) setPlanId(id)
  }, [id])

  useEffect(() => {
    const { planItemIds } = data
    if (planItemIds.length != planItemOrders.length) {
      setPlanItemOrders(planItemIds)
    }
  }, [data])
  
  handleOkWithGuidanceItems = async() => {
    setGuidance({...guidance, visible: false})
    const newPlanItems = guidance.selectedItems.map(planItem => (
      {
        title: "New Plan Item",
        item: planItem.item,
        dimension: planItem.dimensions[0], //TODO: should be able to input all dimensions
        unitIds: planItem.unitIds.map(id =>  units.findOne(id) ? [units.findOne(id).categoryId(), units.findOne(id).subcategoryId, id] :  subcategories.findOne(id) && [subcategories.findOne(id).categoryId, id] )[0], 
        ownerId: Meteor.users.find({}).fetch()[0]._id, // TODO: used the random user, but should be changed, extracted after authentication implementation.
        assignedToIds: []
      }
    ))
    try {
      const result = await Promise.all(
        newPlanItems.map(async (planitem) => await Meteor.callPromise('planItem.create', planitem))
      )
      await Meteor.callPromise('plans.update', {id: planId, title, scenario, planItemIds:[...result, ...planItemOrders]})
    } catch(err) {
      alert(err);
    }    

  };

  handleCancelWithGuidanceItems = e => {
    setGuidance({visible: false, selectedItems: []})
  };  
  removefromselecteditems = index => {
    let temp_array = [...guidance.selectedItems]
    temp_array.splice(index, 1)
    setGuidance({...guidance, selectedItems: temp_array})
  }  
  return (
    <>
      <div className="plan-edit container">
      	<div className="content-wrapper">
          <div className="plan-edit-form">
            <PlanEditForm data={data} id={planId} onCreatedPlan={id=>oncreatedPlan(id)} changemode={changemode} planItemOrders={planItemOrders}/>
          </div>
    {
      <Button onClick={()=>setGuidance({...guidance, visible:true})} className="my-2 w-100" style={{color:"#2AAAE1"}}><p> <strong>Use Guidance In Plan Editor</strong> </p></Button>
    }          
{         
          planId &&<div className="plan-item-list">
            <PlanItemList data={planItemIds} planId={planId} editable={isEditable} onChangePlanItemsOrder={onChangePlanItemsOrder}/>
          </div>
}
      	</div>
    <Modal
      title="Guidance Items"
      visible={guidance.visible}
      width="90%"
      bodyStyle={{height: window.innerHeight - $("nav").outerHeight() -120}}
      okText ="Use Selected Items"
      onOk={this.handleOkWithGuidanceItems}
      okButtonProps={{ disabled: isEmpty(guidance.selectedItems) }}
      onCancel={this.handleCancelWithGuidanceItems}
    >
      <GuidanceView isComponent isMultiSelectable onSelect={selectedItems=>setGuidance({...guidance, selectedItems})}/>
    </Modal>     
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
