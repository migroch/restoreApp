import React, {useState} from 'react'
import PlanItemView from './PlanItemView' 
import PlanItemEdit from './PlanItemEdit' 
import { Meteor } from 'meteor/meteor';
import { planitems, plans } from '../../api/collections';
// even in editable case, it should be editable when the edit button clicked
// delete, edit, more buttong added
const DeleteButton = ({onClick}) => (
  <span role="img" aria-label="delete" class="anticon anticon-delete" onClick={onClick}><svg viewBox="64 64 896 896" focusable="false" class="" data-icon="delete" width="1em" height="1em" fill="currentColor" aria-hidden="true"><path d="M292.7 840h438.6l24.2-512h-487z" fill="#e6f7ff"></path><path d="M864 256H736v-80c0-35.3-28.7-64-64-64H352c-35.3 0-64 28.7-64 64v80H160c-17.7 0-32 14.3-32 32v32c0 4.4 3.6 8 8 8h60.4l24.7 523c1.6 34.1 29.8 61 63.9 61h454c34.2 0 62.3-26.8 63.9-61l24.7-523H888c4.4 0 8-3.6 8-8v-32c0-17.7-14.3-32-32-32zm-504-72h304v72H360v-72zm371.3 656H292.7l-24.2-512h487l-24.2 512z" fill="#1890ff"></path></svg></span>
)
const EditButton = ({onClick}) => (
  <span role="img" aria-label="edit" tabindex="-1" class="anticon anticon-edit" onClick={onClick}><svg viewBox="64 64 896 896" focusable="false" class="" data-icon="edit" width="1em" height="1em" fill="currentColor" aria-hidden="true"><path d="M761.1 288.3L687.8 215 325.1 577.6l-15.6 89 88.9-15.7z" fill="#e6f7ff"></path><path d="M880 836H144c-17.7 0-32 14.3-32 32v36c0 4.4 3.6 8 8 8h784c4.4 0 8-3.6 8-8v-36c0-17.7-14.3-32-32-32zm-622.3-84c2 0 4-.2 6-.5L431.9 722c2-.4 3.9-1.3 5.3-2.8l423.9-423.9a9.96 9.96 0 000-14.1L694.9 114.9c-1.9-1.9-4.4-2.9-7.1-2.9s-5.2 1-7.1 2.9L256.8 538.8c-1.5 1.5-2.4 3.3-2.8 5.3l-29.5 168.2a33.5 33.5 0 009.4 29.8c6.6 6.4 14.9 9.9 23.8 9.9zm67.4-174.4L687.8 215l73.3 73.3-362.7 362.6-88.9 15.7 15.6-89z" fill="#1890ff"></path></svg></span>
)
const PlanItemWrapper = ({id, editable, planId}) => {

  const [editMode, setEditMode] = useState(false)
  const removePlanItem = ()=> {
    console.log("Xxxxxx")
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
        <div className="button-group">
          {/* onClick={deletePlanWithId} */}
          {/* <img src="icons/edit copy.png" onClick={()=>setEditMode(editable)}/> */}
          <EditButton onClick={()=>setEditMode(editable)}/> 
          <DeleteButton onClick={removePlanItem}/>
          
        </div>
      }
      {
        editMode ? <PlanItemEdit id={id} disableEditMode={()=>setEditMode(false)}/> : <PlanItemView id={id} disabled/>   
      }
    </div>
  )
}

export default PlanItemWrapper