import React, {useState, useEffect} from 'react'
import PlanItemWrapper from './PlanItemWrapper'
import PlanItemEdit from './PlanItemEdit'
import {  Tooltip, List, Modal } from 'antd/dist/antd.min.js';
import {PlusCircle} from 'styled-icons/feather/PlusCircle';
import PlanItemOrderModal from './PlanItemsOrderModal'
import {
  SortableContainer,
  SortableElement,
  SortableHandle,
  arrayMove,
} from 'react-sortable-hoc';

const PlanItemList =({data, editable, planId, onChangePlanItemsOrder})=> {
  const [addPlanItemMode, setAddPlanItemMode] = useState(false)
  const [isOrderMode, setIsOrderMode] = useState(false)
  const[planItemOrders, setPlanItemOrders] = useState(data)

  // useEffect(() => {
  //   onChangePlanItemsOrder(planItemOrders)
  // }, [planItemOrders])

  handleOkWithOrders = e => {
    onChangePlanItemsOrder(planItemOrders)
    setPlanItemOrders(planitems)
    setIsOrderMode(false)
  };

  handleCancelWithOrders = e => {
    setIsOrderMode(false)
  };

  onSortEnd = ({oldIndex, newIndex}) => {
    onChangePlanItemsOrder(arrayMove(planItemOrders, oldIndex, newIndex))
    setPlanItemOrders(arrayMove(planItemOrders, oldIndex, newIndex));
  };
  
  const SortableItem = SortableElement(({value}) => {
    return (
      <PlanItemWrapper id={value} planId={planId} editable={editable} setOrderMode={()=>setIsOrderMode(true)}/>
    );
  });
  const SortableList = SortableContainer(({data}) => {
    return (
    <ul>
      {data.map((value, index) => (
        <SortableItem key={`item-${index}`} index={index} value={value} />
      ))}
    </ul>
    );
  });



  useEffect(() => {
    if (planItemOrders.length != data.length) {
      setPlanItemOrders(data)
    }
  }, [data])
  let planitems = []


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
    {!editable ?
      <List
        dataSource={planItemOrders}
        itemLayout='vertical'
        locale={{emptyText: 'No Plan Items'}}
        renderItem={(item, index)=><PlanItemWrapper id={item} planId={planId} editable={editable} key={"planItem"+index} setOrderMode={()=>setIsOrderMode(true)}/> }
      /> 
      :
      <SortableList data={planItemOrders} onSortEnd={this.onSortEnd} useDragHandle={true}/>
    }

    { editable && 
      <div className="container-fluid text-center mb-2" >
	<Tooltip  placement="bottom" title="Add Plan Item">
	  <span className="add-btn" style={{cursor:'pointer'}} onClick={()=>setAddPlanItemMode(true)}><PlusCircle size="40"  /></span>
	</Tooltip >
      </div>
    }
    
    <Modal
      title="Change Order of Plan items"
      visible={isOrderMode}
      width="40%"
      bodyStyle={{height:500}}
      okText ="Ok"
      onOk={this.handleOkWithOrders}
      onCancel={this.handleCancelWithOrders}
    >
      <PlanItemOrderModal dataSource={data} onChange={v=>planitems=v}/>
    </Modal>   
    </>
  )
}

export default PlanItemList
