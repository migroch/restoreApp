import React from 'react';
import { Meteor } from 'meteor/meteor';
import moment from 'moment';
import { withTracker } from 'meteor/react-meteor-data';
import  Schemas from '../../api/schemas';
import { planitems, categories, subcategories, units } from '../../api/collections';
// import ShowMoreText from 'react-show-more-text'
import 'react-quill/dist/quill.snow.css';

import { Breadcrumb, Tag, Avatar } from 'antd/dist/antd.min.js';

const Dimensions = Schemas.dimensions;
const dimColors = ["magenta","volcano","orange","blue","geekblue","purple"];
const catColors = {'Health & Safety / Operations':'#FF9263', 'Instructional Programs':'#00a6a3',  'Student Support & Family Engagement':'#2AAAE1'}
const ucolors = ["orange","magenta","green","blue","purple"];

PlanItemView = ({data, isLoading }) => {
  if (isLoading) return null
  const { item, dimension, assignedToIds, dueDate, unitIds, ownerId, title } = data
  const onwner = data.ownerName();
  const assignedToNames = data.assignedToNames();
  const schoolNames = data.schoolNames();
  const districts = data.districts();
  const users = [data.ownerName()].concat(data.assignedToNames());
    
  return (
    <div className="plan-item-view">
      <div className="container-fluid my-2 p-0" >
	<h6>{title}</h6>
      </div>
      <div className="row">
	<div className="col-md-auto">
	  {
	    units.find({_id:{$in:unitIds}}).fetch().map( (u, index) => {
	      let subcategory = subcategories.findOne(u.subcategoryId);
	      if (u && u.subcategoryName() && subcategory.categoryName()){
		return(
		  <div key={index} >
		    <Breadcrumb separator=">" style={{color:catColors[subcategory.categoryName()]}}>
		      <Breadcrumb.Item>{subcategory.categoryName()}</Breadcrumb.Item>
		      <Breadcrumb.Item>{u.subcategoryName()}</Breadcrumb.Item>
		      <Breadcrumb.Item>{u.name}</Breadcrumb.Item>
		    </Breadcrumb>
		  </div>
		)
	      }
	    })
	  }
	  {
	    subcategories.find({_id:{$in:unitIds}}).fetch().map( (s, index) => {
	      if (s && s.categoryName()){
		return(
		  <div key={index} >
		    <Breadcrumb separator=">" style={{color:catColors[s.categoryName()]}}>
		      <Breadcrumb.Item>{s.categoryName()}</Breadcrumb.Item>
		      <Breadcrumb.Item>{s.name}</Breadcrumb.Item>
		    </Breadcrumb>
		  </div>
		)
	      }
	    })
	  }			  
	</div>

	<div className="col-md-auto">
	  <Tag color={ dimColors[Dimensions.findIndex(D => D==dimension)]}>{dimension}</Tag>
	</div>

	<div className="col-md-auto">
	  {
	    users.map((u, index) => {
	      let color = ucolors[parseInt(u[u.length-1])]
	      return(
		<Avatar  size="small" key={index}  style={{ verticalAlign: 'middle', backgroundColor: color}} className="m-1" ><p style={{fontSize:'smaller'}}>{u[0]+u[u.length-1]}</p></Avatar>
	      )})
	  }
	</div>
      </div>
      
      <div className="row mt-2">
	<div className="col-md-auto">
	  <p><small><strong>Districts:</strong> {districts[0]} {districts.slice(1,).map(d => ', '+d)}</small></p>
	</div>
	<div className="col-md-auto">
	  <p><small><strong>Schools:</strong> {schoolNames[0]} {schoolNames.slice(1,).map(s => ', '+s)}</small></p>
	</div>

	<div id={"pitemText-"+data._id} className="container-fluid" dangerouslySetInnerHTML={{__html: item.text}}>
	</div>
      </div>
	

    </div>
  )
}
export default withTracker(({id}) => {
  const handles = [
    Meteor.subscribe('planitems'),
    Meteor.subscribe('categories'),
    Meteor.subscribe('subcategories'),
    Meteor.subscribe('units'),
  ];
  const isLoading = handles.some(handle => !handle.ready());
  if(isLoading){
    return {
      data: null,
      isLoading: true
    };
  }
  const data = planitems.findOne(id)
    
  return {
    data,
    isLoading: false
  };
})(PlanItemView);
