import React, { useState } from 'react';
import { Meteor } from 'meteor/meteor';
import SelectWrapper from '../../reusable/SelectWrapper';
import { withTracker } from 'meteor/react-meteor-data';
import { planitems, plans } from '../../../api/collections';
import PlanItem from '../../reusable/PlanItem';
import { Input, Select, Button } from 'antd';
import { DownloadOutlined } from '@ant-design/icons';
import './index.scss';

const { Option } = Select;

const scenarios = [
  "High Restrictions",
  "Medium Restrictions",
  "Low Restrictions"
]
const Tags = (data) => data.map(item => <div className="custom-tag" key={item+"tag"}>{item}</div>)

const PlanWrapper = ({data}) => {

  const [isDetailVisible, setIsDetailVisible] = useState(false)
  const [isEditable, setIsEditable] = useState(false)
  const [ title, setTitle ] = useState(data.title)
  const [ scenario, setScenario ] = useState(data.scenario)
  const { planItemIds, _id } = data
  const colors = {
    "High Restrictions": "red",
    "Medium Restrictions": "yellow",
    "Low Restrictions": "green"
  }
  const onChangeTitle = e => {
    setTitle(e.target.value)
  }
  const onChangeScenario = value => {
    setScenario(value)
  }  
  const savePlan = () => {
    Meteor.call('plans.update', { _id, title, scenario }, (err, res) => {
      if (err) {
        alert(err);
      } else {
        setIsEditable(false)
      }
    })
  }
  const plan_color = colors[scenario]
  return (
    <div className="plan-wrapper">         
      <div className="header" style={{backgroundColor: plan_color}}>
      { !isEditable ? 
        <div className="right">
          <img src="icons/edit.png" onClick={()=>setIsEditable(!isEditable)}/>
          <img src="icons/copy.png" />
          <img src="icons/more.png" onClick={()=>setIsDetailVisible(!isDetailVisible)}/>
        </div> :  
        <div className="right">
          <Button type="primary" shape="round" onClick={()=>savePlan()}>Save</Button>
          <Button type="primary" shape="round" icon={<DownloadOutlined />}>
            Export
          </Button>          
        </div>    
      } 
      <div className="title">{ title }</div>
      </div>
      <div className="content-wrapper">
        <div className="content">
          {
            isEditable && 
            <div>
              Title
              <Input placeholder={title} onChange={onChangeTitle}/>
            </div>
          }
          {
            isEditable&&
            <div>
              Scenario
              <Select
                style={{ width: 250 }}
                placeholder={scenario}
                onChange={onChangeScenario}
              >
                {
                  scenarios.map(item=>(
                    <Option value={item}>{item}</Option>
                  ))
                }
              </Select>
            </div>
          }
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
            planItemIds.map(id=><PlanItem id={id} disabled={!isEditable} key={"planItem"+id}/>)
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
