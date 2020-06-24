import React, { Component, useState } from "react";
import { withTracker } from "meteor/react-meteor-data";
import Schemas from '../../api/schemas.js'
import { guidanceitems, units, subcategories, categories } from "../../api/collections.js";
import InfiniteScroll from 'react-infinite-scroller';
import { Input, Select, Button, Tooltip, Breadcrumb, Tag, Collapse, List} from 'antd/dist/antd.min.js';
const { Panel } = Collapse;

const Dimensions = Schemas.dimensions;
const dimColors = ["magenta","volcano","orange","blue","geekblue","purple"];
const catColors = {'Health & Safety / Operations':'#FF9263', 'Instructional Programs':'#00a6a3',  'Student Support & Family Engagement':'#2AAAE1'}


class GuidanceItems extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loadedData: [],
      loadingMore: false,
      currentPage: 0,
      ItemsPerPage: 10,
      hasMore: true,
    };

    this.loadMore = this.loadMore.bind(this);
  }

  makeGuidanceItems() {
    return(
      <List
      dataSource={this.state.loadedData}
      renderItem={gitem => (
        <List.Item key={"gitem-"+gitem._id} className="bg-white">
	  <div className="container-fluid" onClick={() => $("#gitemText-"+gitem._id).toggleClass('collapsed-gitem-text')}>
	    
	    <div className="row">
	      <div className="col-md-auto">
		{
		  units.find({_id:{$in:gitem.unitIds}}).fetch().map( (u, index) => {
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
		  subcategories.find({_id:{$in:gitem.unitIds}}).fetch().map( (s, index) => {
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
	    </div>
	    <div id={"gitemText-"+gitem._id} className="container-fluid collapsed-gitem-text">
	      <p className="m-0">{gitem.item.text}</p>
	    </div>
          </div>
	  
	</List.Item>
      )}
      >
      </List>   
    )
  }

  loadMore(){
    this.setState({loadingMore: true});
    const fullData = this.props.data;
    const currentPage = this.state.currentPage;
    let indexOfLastItem = (currentPage + 1) * this.state.ItemsPerPage - 1;
    if (indexOfLastItem > fullData.length -1){
      indexOfLastItem =  fullData.length -1;
      this.setState({hasMore: false});
    }
    const indexOfFirstItem = indexOfLastItem - this.state.ItemsPerPage;
    const data = this.state.loadedData.concat(fullData.slice(indexOfFirstItem, indexOfLastItem));
    this.setState({loadedData: data, loadingMore: false, currentPage: currentPage + 1 });

  }

  componentDidUpdate(){
    if (!this.props.isLoading && !this.state.loadedData.length) this.loadMore();
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
      
      return (
	<div className="container">
	  {/* <Collapse bordered={false} expandIconPosition='right'>
	  <Panel header="Guidance Items"> */}

	  <InfiniteScroll
	      initialLoad={false} 
              pageStart={0}
              loadMore={this.loadMore}
              hasMore={this.state.hasMore}
              useWindow={true}
          >
 	    {this.makeGuidanceItems()} 
          </InfiniteScroll>

	  {/* </Panel>
          </Collapse> */}
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
  const data = guidanceitems_fetch
  return {
    data,
    isLoading: false
  };
})(GuidanceItems);

export default GuidanceItems;
