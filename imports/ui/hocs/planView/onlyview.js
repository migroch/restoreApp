import React, { useState } from 'react';
import Dimension from '../../reusable/Dimension';
import SelectWrapper from '../../reusable/SelectWrapper';
import { withTracker } from 'meteor/react-meteor-data';
import { planitems, plans } from '../../../api/collections';
import PlanItem from '../../reusable/PlanItem';
import './index.scss';

const Tags = (data) => data.map(item => <div className="custom-tag" key={item+"tag"}>{item}</div>)

const PlanWrapper = ({data}) => {

  const [isDetailVisible, setIsDetailVisible] = useState(false)
  const [isEditable, setIsEditable] = useState(false)
  const { title, scenario, planItems, _id } = data
  const colors = {
    "High Restrictions": "red",
    "Medium Restrictions": "yellow",
    "Low Restrictions": "green"
  }
  const plan_color = colors[scenario]
  return (
    <div className="plan-wrapper">         
      <div className="header" style={{backgroundColor: plan_color}}>
        <div className="right">
          <img src="icons/edit.png" onClick={()=>setIsDetailVisible(!isEditable)}/>
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
            planItems.map(id=><PlanItem id={id} disabled={!isEditable} key={"planItem"+id}/>)
          }
        </div>
      </div>
    </div>
  )
}


PlansListView = ({plans}) => {
  return (
    <div className="plan-view">
      <SelectWrapper />    
      <div className="plans-wrapper">
        {
          plans.map((plan, index)=><PlanWrapper  data={plan} key={"plan"+index} />)
        }
      </div>
    </div>
  )
}

PlansListView = withTracker(() => {
  Meteor.subscribe('planitems');
  Meteor.subscribe('plans');
  return {
    plans: plans.find({}).fetch(),
  };
})(PlansListView);
export default PlansListView
