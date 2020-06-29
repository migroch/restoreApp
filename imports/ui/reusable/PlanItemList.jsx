import React, {useState} from 'react'
import PlanItemWrapper from './PlanItemWrapper'
import PlanItemEdit from './PlanItemEdit'
import { isEmpty } from 'lodash'
import {  Tooltip, List } from 'antd/dist/antd.min.js';

import styled from 'styled-components';
import {PlusCircle} from 'styled-icons/feather/PlusCircle';


const PlanItemList =({data, editable, planId})=> {
  //data = planItemIds
  const [addPlanItemMode, setAddPlanItemMode] = useState(false)
  return (
    <>
    { editable && 
      <div className="container-fluid text-center mb-2" >
	<Tooltip  placement="bottom" title="Add Plan Item">
	  <span className="add-btn" style={{cursor:'pointer'}} onClick={()=>setAddPlanItemMode(true)}><PlusCircle size="40"  /></span>
	</Tooltip >
      </div>
    }
    { addPlanItemMode && editable &&
      <div className="plan-item-wrapper">
        <PlanItemEdit id={undefined} planId={planId} finishAddItem={()=>setAddPlanItemMode(false)}/>
      </div>
    }
    {
      <List
	  dataSource={data}
	  itemLayout='vertical'
         //loading={data.length ? false : true}
          locale={{emptyText: 'No Plan Items'}}
	  renderItem={item => (
              
		<PlanItemWrapper id={item._id} planId={planId} editable={editable} key={"planItem"+item._id}/>
              
	    )}
      />
    }
   
    </>
  )
}

export default PlanItemList
