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
  let wheight = window.innerHeight - $('.navbar').outerHeight();
  let [height, setHeight] = useState('auto');
  if  (wheight && height != wheight)  setHeight(wheight) ;
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
        dimensions: planItem.dimensions.filter(d => d),
        unitIds: planItem.unitIds.filter(u => u), 
        ownerId: Meteor.userId(), 
        assignedToIds: []
      }
      ))
      console.log(newPlanItems);
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
    <div className="plan-edit container-fluid" style={{height: height}}>
      <div className="content-wrapper" style={{height: height}}>
          <div className="plan-edit-form">
            <PlanEditForm data={data} id={planId} onCreatedPlan={id=>oncreatedPlan(id)} changemode={changemode} planItemOrders={planItemOrders}/>
          </div>
	  {
	    <div className="container">
	      <Button onClick={()=>setGuidance({...guidance, visible:true})} className="my-2 w-100" style={{color:"#2AAAE1"}}><p> <strong>Use Guidance</strong> </p></Button>
	    </div>
	  }          
	    {         
              planId &&<div className="plan-item-list container" style={{height: height - 250}}>
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
