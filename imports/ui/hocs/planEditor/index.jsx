import React, { useState } from 'react';
import { useHistory } from "react-router-dom";
import { Meteor } from 'meteor/meteor';
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

const PlanEdit = ({ isLoading, data, id }) => {
  if (isLoading) return null

  const history = useHistory();
  const [isDetailVisible, setIsDetailVisible] = useState(true)
  const [isEditable, setIsEditable] = useState(true)
  const [ title, setTitle ] = useState(data.title)
  const [ scenario, setScenario ] = useState(data.scenario)
  const { planItemIds } = data
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
    Meteor.call('plans.update', { id, title, scenario }, (err, res) => {
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
          <Button type="primary" shape="round" onClick={()=>savePlan()}>Save</Button>
          <Button type="primary" shape="round" onClick={()=>history.push('/plan-viewer')}>
            Cancel
          </Button>          
        </div>    
      <div className="title">{ title }</div>
      </div>
      <div className="content-wrapper">
        <div className="content">
          <div>
            Title
            <Input placeholder={title} onChange={onChangeTitle}/>
          </div>
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
            planItemIds.map(id=><PlanItem id={id} disabled={false} key={"planItem"+id}/>)
          }
        </div>
      </div>
    </div>
  )
}


PlanEditWrapper = withTracker(({match}) => {
  const handles = [
    Meteor.subscribe('planitems'),
    Meteor.subscribe('plans'),
  ];
  const isLoading = handles.some(handle => !handle.ready());
  const plan_id = match.params.id
  if(isLoading){
    return {
      data: null,
      id: plan_id,
      isLoading: true
    };
  }

  console.log("plan:", plans.findOne(plan_id))
  return {
    data: plans.findOne(plan_id),
    id: plan_id,
    isLoading: false
  };
})(PlanEdit);

export default PlanEditWrapper
