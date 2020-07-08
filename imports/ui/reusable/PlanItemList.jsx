import React, {useState, useEffect} from 'react'
import PlanItemWrapper from './PlanItemWrapper'
import PlanItemEdit from './PlanItemEdit'
import {  Tooltip, List, Modal, Button } from 'antd/dist/antd.min.js';
import {PlusCircle} from 'styled-icons/feather/PlusCircle';
import PlanItemOrderModal from './PlanItemsOrderModal'
import GuidanceView from '../hocs/GuidanceItems'
import { isEmpty } from 'lodash'

const PlanItemList =({data, editable, planId, onChangePlanItemsOrder})=> {
  const [addPlanItemMode, setAddPlanItemMode] = useState(false)
  const [isOrderMode, setIsOrderMode] = useState(false)
  const[planItemOrders, setPlanItemOrders] = useState(data)
  // const [selectedGuidanceItems, setSelectedGuidanceItems] = useState([])
  const [guidance, setGuidance] = useState({visible: false, selectedItems: []}) ;
  console.log("guidance: ", guidance)
  handleOkWithOrders = e => {
    onChangePlanItemsOrder(planitems)
    setPlanItemOrders(planitems)
    setIsOrderMode(false)
  };

  handleCancelWithOrders = e => {
    setIsOrderMode(false)
  };

  handleOkWithGuidanceItems = e => {
    setGuidance({...guidance, visible: false})
  };

  handleCancelWithGuidanceItems = e => {
    setGuidance({visible: false, selectedItems: []})
  };

  useEffect(() => {
    if (planItemOrders.length != data.length) {
      setPlanItemOrders(data)
    }
  }, [data])
  let planitems = []

  removefromselecteditems = index => {
    let temp_array = [...guidance.selectedItems]
    temp_array.splice(index, 1)
    setGuidance({...guidance, selectedItems: temp_array})
  }
  return (
    <>
    { editable && 
      <Button onClick={()=>setGuidance({...guidance, visible:true})} className="my-2 w-100" style={{color:"#2AAAE1"}}><p> <strong>Use Guidance</strong> </p></Button>
    }
   
    { addPlanItemMode && editable &&
      <div className="plan-item-wrapper">
        <PlanItemEdit id={undefined} planId={planId} finishAddItem={()=>setAddPlanItemMode(false)}/>
      </div>
    }
    {
      editable && !guidance.visible && guidance.selectedItems.map( (item, index) => (
        <div className="plan-item-wrapper">
          <PlanItemEdit id={undefined} planId={planId} guidanceData={item} finishAddItem={()=>removefromselecteditems(index)} key={"plan-new-item"+index}/>
        </div>        
      ))
    }
    {
      <List
        dataSource={planItemOrders}
        itemLayout='vertical'
        locale={{emptyText: 'No Plan Items'}}
        renderItem={(item, index)=><PlanItemWrapper id={item} planId={planId} editable={editable} key={"planItem"+index} setOrderMode={()=>setIsOrderMode(true)}/> }
      /> 
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
    </>
  )
}

export default PlanItemList
