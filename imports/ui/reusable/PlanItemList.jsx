import React, {useState} from 'react'
import PlanItemWrapper from './PlanItemWrapper'
import PlanItemEdit from './PlanItemEdit'
import {  Tooltip, List } from 'antd/dist/antd.min.js';
import styled from 'styled-components';
import {PlusCircle} from 'styled-icons/feather/PlusCircle';
import ListSortWithDrag from './ListAnimation';

const PlanItemList =({data, editable, planId, onChangePlanItemsOrder})=> {
  const [addPlanItemMode, setAddPlanItemMode] = useState(false)
  onChangeOrder = e => {
    const reOrdered = e.map(item=>item.key)
    onChangePlanItemsOrder(reOrdered)
  }
  
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

    !editable ? 
      <List
        dataSource={data}
        itemLayout='vertical'
        locale={{emptyText: 'No Plan Items'}}
        renderItem={(item, index)=><PlanItemWrapper id={item} planId={planId} editable={editable} key={"planItem"+index}/> }
      /> :
      <div style={{position:"relative"}}>
        <ListSortWithDrag
          dragClassName="list-drag-selected"
          appearAnim={{ animConfig: { marginTop: [5, 30], opacity: [1, 0] } }}
          onChange={onChangeOrder}
        >
        { data.map((item, index)=><div className="list-animation-list" key={item}><PlanItemWrapper id={item} planId={planId} editable={editable} /></div>)}
        </ListSortWithDrag>
      </div>
    }
   
    </>
  )
}

export default PlanItemList
