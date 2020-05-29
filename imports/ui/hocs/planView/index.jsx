import React, { useState } from 'react';
import Dimension from '../../reusable/Dimension';
import SelectWrapper from '../../reusable/SelectWrapper';
import './index.scss';

const planItems_data = [
  {
    id: 1,
    subcategories: [3,4],
    users: [1, 2],
    item: 1,
    dimensions: {
      Communication: true,
      Data_Technology: false,
      Pd_Training: true,
      Human_Resource: true,
      Policy_Governanace: false,
      Finances_Resources: false
    }
  },
  {
    id: 2,
    subcategories: [3,4],
    users: [1, 2],
    item: 1,
    dimensions: {
      Communication: true,
      Data_Technology: false,
      Pd_Training: true,
      Human_Resource: true,
      Policy_Governanace: false,
      Finances_Resources: false
    }
  },
  {
    id: 3,
    subcategories: [3,4],
    users: [1, 2],
    item: 1,
    dimensions: {
      Communication: true,
      Data_Technology: false,
      Pd_Training: true,
      Human_Resource: true,
      Policy_Governanace: false,
      Finances_Resources: false
    }
  }
]
const plans_data = [
  {
    id: 1,
    title: "plan_1",
    scenario: "High Restriction",
    schools: [1, 2, 3],
    districts: [1, 2, 3],
    planitems: [
      1,2,0 //planitems id
    ]
  },
  {
    id: 2,
    title: "plan_2",
    scenario: "Medium Restriction",
    schools: [1, 2, 3],
    districts: [1, 2, 3],
    planitems: [    
      1,2,0 //planitems id
    ]
  },
  {
    id: 3,
    title: "plan_3",
    scenario: "Low Restriction",
    schools: [1, 2, 3],
    districts: [1, 2, 3],
    planitems: [
      1,2,0 //planitems id
    ]
  }

]

const Tags = (data) => data.map(item => <div className="custom-tag" key={item+"tag"}>{item}</div>)

const Plan = ({data}) => {

  const [isDetailVisible, setIsDetailVisible] = useState(false)
  const { title, scenario, schools, districts, planitems } = data
  const colors = {
    "High Restriction": "red",
    "Medium Restriction": "yellow",
    "Low Restriction": "green"
  }
  const plan_color = colors[scenario]
  return (
    <div className="plan-wrapper" style={{backgroundColor: plan_color}}>         
      <div className="header">
        <div className="right">
          <img src="icons/edit.png" />
          <img src="icons/copy.png" />
          <img src="icons/more.png" onClick={()=>setIsDetailVisible(!isDetailVisible)}/>
        </div>        
        <div className="title">{ title }</div>
      </div>
      <div className="content">
        <div>Applies To:</div>
        <div className="label_1">
          Districts: 
          <div className="tags-wrapper">
            {Tags(districts)}
          </div>

        </div>
        <div className="label_1">
          Schools
          <div className="tags-wrapper">
            {Tags(schools)}
          </div>
        </div>
      </div>
      <div className="content-detail" style={{display: isDetailVisible ? "block" : "none"}}>
        {
          planitems.map(item=>(
            <div className="plan-item">
              <div className="label_1">
                Categories/SubCategories
                <div className="tags-wrapper">
                  {Tags(planItems_data[item].subcategories)}
                </div>
              </div>  
              <Dimension value={planItems_data[item].dimensions} onChange={(checkedValues)=>console.log('checked = ', checkedValues)} disabled/>   
            </div>
          ))
        }
      </div>
    </div>
  )
}
const PlanView = () => {
  return (
    <div className="plan-view">
      <SelectWrapper />    
      <div className="plans-wrapper">
        {
          plans_data.map((plan, index)=><Plan  data={plan} key={"plan"+index}/>)
        }
      </div>
      
    </div>
  )
}

export default PlanView