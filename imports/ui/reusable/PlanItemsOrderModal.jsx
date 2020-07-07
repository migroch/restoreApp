import React from 'react';
import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
import { planitems } from '../../api/collections';
import ListSortWithDrag from './ListAnimation';

PlanItemsOrderModal = ({data, isLoading, onChange }) => {
  if (isLoading) return null
    
  return (
    <div className="plan-item-view" style={{position:"relative"}}>
        <ListSortWithDrag
          dragClassName="list-drag-selected"
          onChange={e=>onChange(e.map(item=>item.key))}
          key={data.length}
        >
        { 
        data.map((item, index)=>
          <div className="list-animation-list" key={item.id}>
            <div style={{
              width: "100%",
              height: 50,
              border: "1px solid green",
              borderRadius: 4,
              margin: "0 auto",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              fontSize: 20
            }}>
              {item.title}
            </div>
          </div>
        )}
        </ListSortWithDrag>
    </div>
  )
}
export default withTracker(({dataSource}) => {
  const handles = [
    Meteor.subscribe('planitems'),
  ];
  const isLoading = handles.some(handle => !handle.ready());
  if(isLoading){
    return {
      data: null,
      isLoading: true
    };
  }
  const data = dataSource.map(id=>{
    return {
      title: planitems.findOne(id).title,//TODO: change it into Plan item Title
      id
    }
  })
    
  return {
    data,
    isLoading: false
  };
})(PlanItemsOrderModal);
