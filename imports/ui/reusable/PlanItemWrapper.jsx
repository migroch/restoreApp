import React, {useState} from 'react'
import PlanItemView from './PlanItemView' 
import PlanItemEdit from './PlanItemEdit' 
import { Meteor } from 'meteor/meteor';
import { planitems, plans } from '../../api/collections';

import { Tooltip, List, Popconfirm } from 'antd/dist/antd.min.js';

import styled from 'styled-components';
import {Trash} from "styled-icons/feather/Trash";
import {Edit3} from 'styled-icons/feather/Edit3';
import {Copy} from 'styled-icons/feather/Copy';
import {ArrowDownCircle} from 'styled-icons/feather/ArrowDownCircle'

// even in editable case, it should be editable when the edit button clicked
// delete, edit, more buttong added

const PlanItemWrapper = ({id, editable, planId, setOrderMode}) => {

  const [editMode, setEditMode] = useState(false);
  const removePlanItem = ()=> {
    Meteor.call('planItem.remove', {planId, planItemId:id}, (err, res) => {
      if (err) {
      	alert(err);
      } else {
        // history.push('/plan-viewer')
      }
    })
  }

  const actions = () =>{
    if(editable&&!editMode){
      return(
	[
	  <Tooltip  placement="bottom" title="Order">
	    <span className="icon mr-2 ml-2" onClick={setOrderMode}><ArrowDownCircle size="20" /> </span>
	  </Tooltip >,    
	  <Tooltip  placement="bottom" title="Edit">
	    <span className="icon mr-2 ml-2" onClick={()=>setEditMode(editable)}><Edit3  size="20" /> </span>
	  </Tooltip >,
	  <Tooltip  placement="bottom" title="Copy">
	    <span className="icon mr-2 ml-2"><Copy  size="20" /></span>
    </Tooltip >,
    <Popconfirm
    placement="top"
    title={'Are you sure to delete this planItem?'}
    onConfirm={removePlanItem}
    okText="Yes"
    cancelText="No"
    >
      <Tooltip  placement="bottom" title="Delete">
        <span className="icon mr-2 ml-2"><Trash  size="20" /></span>
      </Tooltip >
    </Popconfirm>      
	]
      );
      return null
    }    
  }
  
  return (
    <List.Item actions={actions()} className="ant-plan-item-list">
      {
        editMode ? <PlanItemEdit id={id} disableEditMode={()=>setEditMode(false)}/> : <PlanItemView id={id} disabled/>   
      }
    </List.Item>
  )
}

export default PlanItemWrapper
