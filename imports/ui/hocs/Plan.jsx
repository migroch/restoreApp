import React, {useState} from 'react'
import PlanEditor from './planEditor'
import PlanView from './planView/index'
const Plan = ({isMyPlan}) => {
  //if isPlanview == false && planIdToEdit==null, this is the case to add new plan.
  const [PlanViewState, setPlanViewState] = useState({isPlanView: true, planIdToEdit: null})
  const  { isPlanView, planIdToEdit} = PlanViewState
  return (
    <>
      <div style={{display: isPlanView ? "block" : "none"}}>
        <PlanView editPlanWithID={(id)=>setPlanViewState({isPlanView:false, planIdToEdit:id})} isPlanView={isPlanView} isMyPlan={isMyPlan}/> 
      </div>
      <div style={{display: !isPlanView ? "block" : "none"}}>
        <PlanEditor 
          id={planIdToEdit} 
          changemode={()=>setPlanViewState({isPlanView:true, planIdToEdit:null})}
          oncreatedPlan = {id=>setPlanViewState({isPlanView:false, planIdToEdit:id})}
        />
      </div>
    </>
  )
}

export default Plan