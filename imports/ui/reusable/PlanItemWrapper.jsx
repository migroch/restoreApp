import React, {useState} from 'react'
import PlanItemView from './PlanItemView' 
import PlanItemEdit from './PlanItemEdit' 
import { Meteor } from 'meteor/meteor';
import { planitems, plans } from '../../api/collections';

import { Tooltip } from 'antd/dist/antd.min.js';

import styled from 'styled-components';
import {Trash} from "styled-icons/feather/Trash";
import {Edit3} from 'styled-icons/feather/Edit3';
import {Copy} from 'styled-icons/feather/Copy';

// even in editable case, it should be editable when the edit button clicked
// delete, edit, more buttong added

const PlanItemWrapper = ({id, editable, planId}) => {

  const [editMode, setEditMode] = useState(false)
  const removePlanItem = ()=> {
    Meteor.call('planItem.remove', {planId, planItemId:id}, (err, res) => {
      if (err) {
       alert(err);
      } else {
        // history.push('/plan-viewer')
      }
      })
    }
  return (
    <div className="plan-item-wrapper">
      {(editable&&!editMode)&&
      <div className="button-group text-primary"  >
          {/* onClick={deletePlanWithId} */}
        {/* <img src="icons/edit copy.png" onClick={()=>setEditMode(editable)}/> */}
	<Tooltip  placement="bottom" title="Edit">
	  <span className="icon mr-2 ml-2" onClick={()=>setEditMode(editable)}><Edit3  size="20" /> </span>
	</Tooltip >
	<Tooltip  placement="bottom" title="Copy">
	  <span className="icon mr-2 ml-2"><Copy  size="20" /></span>
	</Tooltip >
	<Tooltip  placement="bottom" title="Delete">
	  <span className="icon mr-2 ml-2" onClick={removePlanItem}><Trash  size="20" /></span>
	</Tooltip >
        </div>
      }
      {
        editMode ? <PlanItemEdit id={id} disableEditMode={()=>setEditMode(false)}/> : <PlanItemView id={id} disabled/>   
      }
    </div>
  )
}

export default PlanItemWrapper
