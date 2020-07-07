import React, {useState, useEffect} from 'react'
import PlanItemWrapper from './PlanItemWrapper'
import PlanItemEdit from './PlanItemEdit'
import {  Tooltip, List, Modal } from 'antd/dist/antd.min.js';
import {PlusCircle} from 'styled-icons/feather/PlusCircle';
import PlanItemOrderModal from './PlanItemsOrderModal'

const PlanItemList =({data, editable, planId, onChangePlanItemsOrder})=> {
  const [addPlanItemMode, setAddPlanItemMode] = useState(false)
  const [isOrderMode, setIsOrderMode] = useState(false)
  const[planItemOrders, setPlanItemOrders] = useState(data)
  handleOk = e => {
    onChangePlanItemsOrder(planitems)
    setPlanItemOrders(planitems)
    setIsOrderMode(false)
  };

  handleCancel = e => {
    setIsOrderMode(false)
  };
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
    {
      <List
        dataSource={planItemOrders}
        itemLayout='vertical'
        locale={{emptyText: 'No Plan Items'}}
        renderItem={(item, index)=><PlanItemWrapper id={item} planId={planId} editable={editable} key={"planItem"+index} setOrderMode={()=>setIsOrderMode(true)}/> }
      /> 
    }
    <Modal
      title="Change Order of Plan items"
      visible={isOrderMode}
      width="40%"
      bodyStyle={{height:500}}
      okText ="Ok"
      onOk={this.handleOk}
      onCancel={this.handleCancel}
    >
      <PlanItemOrderModal dataSource={data} onChange={v=>planitems=v}/>
    </Modal>   
    </>
  )
}

export default PlanItemList
