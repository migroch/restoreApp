import React, { Component, useState } from "react";
import { withTracker } from "meteor/react-meteor-data";
import Schemas from '../../api/schemas.js'
import { guidanceitems, units, subcategories, categories } from "../../api/collections.js";
import Pagination from "./Pagination.jsx";
import { Input, Select, Button, Tooltip, Breadcrumb,  Tag } from 'antd/dist/antd.min.js';

const Dimensions = Schemas.dimensions;
const dimColors = ["magenta","volcano","orange","blue","geekblue","purple"];


class GuidanceItems extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentPage: 1,
      guidanceItemsPerPage: 10,
    };
  }

  makeGuidanceItems(guidance_items) {
    return(
      //    guidance_items.slice(0, this.state.guidanceItemsPerPage).map((gitem, index) => {
      guidance_items.map((gitem, index) => {
	let units_initem =  units.find({_id:{$in:gitem.unitIds}}).fetch();
	let subcategories_initem = subcategories.find({_id:{$in:gitem.unitIds}}).fetch();
        return (
          <div key={index} className="card-body">
	    
	    <div className="row">
	      <div className="col-md-6">
		{
		  units_initem.map( (u, index) => {
		    let subcategory = subcategories.findOne(u.subcategoryId);
		    if (u && u.subcategoryName() && subcategory.categoryName()){
		      return(
			<div key={index}>
			  <Breadcrumb separator=">" style={{}}>
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
		  subcategories_initem.map( (s, index) => {
		    if (s && s.categoryName()){
		      return(
			<div key={index}>
			  <Breadcrumb separator=">" style={{}}>
			    <Breadcrumb.Item>{s.categoryName()}</Breadcrumb.Item>
			    <Breadcrumb.Item>{s.name}</Breadcrumb.Item>
			  </Breadcrumb>
			</div>
		      )
		    }
		  })
		}			  
	      </div>
	      
	      <div className="col-md-6">
		{
		  gitem.dimensions.map((d,index)=>{
		    if(d){
		      let color = dimColors[Dimensions.findIndex(D => D==d)];
		      return(
			<Tag key={index} color={color}>{d}</Tag>
		      )
		    }
		  })
		}
	      </div>
	    </div>
	    
	    <div className="row mt-2">
	      <div className="col-md-auto">
		<p><strong>Type:</strong> {gitem.type}</p>
	      </div>
	      <div className="col-md-auto">
		<p><strong>Source:</strong> {gitem.source} ( {gitem.location_in_source} ) </p>
	      </div>
	      <div className="col-md-auto">
		<p>{gitem.item.text}</p>
	      </div>
	    </div>
	    
          </div>
        )
      })
    )
  }

  render() {

    if (this.props.isLoading) {
      return (
        <div className="d-flex justify-content-center text-primary">
          <div className="spinner-border" role="status">
            <span className="sr-only">Loading...</span>
          </div>
        </div>
      );
    } else {
      const { guidanceitems_fetch, units_fetch, subcategories_fetch } = this.props.data;
      const indexOfLastGuidanceItem = this.state.currentPage * this.state.guidanceItemsPerPage;
      const indexOfFirstGuidanceItems = indexOfLastGuidanceItem - this.state.guidanceItemsPerPage;
      //const currentGuidanceItems = guidanceitems_fetch.slice(indexOfFirstGuidanceItems, indexOfLastGuidanceItem);
      const currentGuidanceItems = guidanceitems_fetch;
      const guidanceItems = this.makeGuidanceItems(currentGuidanceItems);
      const paginate = (pageNumber) => this.setState({ currentPage: pageNumber });

      return (
        <div>
          <div className="accordion" id="accordionExample">
            <div className="card">
              <div className="card-header" id="headingOne">
                <h5 className="mb-0">
                  <button
                      className="btn btn-link"
                      type="button"
                      data-toggle="collapse"
                      data-target="#collapseOne"
                      aria-expanded="false"
                      aria-controls="collapseOne"
                  >
                    Guidance Items
                  </button>
                </h5>
              </div>
              <div
                  id="collapseOne"
                  className="collapse show"
                  aria-labelledby="headingOne"
                  data-parent="#accordionExample"
              >
                <div className="dropdown container">
		  {/*GuidanceItems*/}
		  {guidanceItems}
                </div>
              </div>

              <Pagination
                  guidanceItemsPerPage={this.state.guidanceItemsPerPage}
                  totalGuidanceItems={guidanceitems.length}
                  paginate={paginate}
                  currentPage={this.state.currentPage}
              />
            </div>
          </div>
        </div>
	
      );
    }
  }
}

GuidanceItems = withTracker(() => {
  //const user = Meteor.user();
  const handles = [
    Meteor.subscribe("guidanceitems"),
    Meteor.subscribe('categories'),
    Meteor.subscribe('subcategories'),
    Meteor.subscribe('units'),
  ]
  const isLoading = handles.some(handle => !handle.ready());
  if(isLoading){
    return {
      data: null,
      isLoading: true
    };
  }
  const guidanceitems_fetch = guidanceitems.find({}).fetch();
  const units_fetch = units.find({}).fetch();
  const subcategories_fetch = units.find({}).fetch();
  const data = {guidanceitems_fetch, units_fetch, subcategories_fetch}
  return {
    data,
    isLoading: false
  };
})(GuidanceItems);

export default GuidanceItems;
