import React, { Component, useState } from "react";
import { withTracker } from "meteor/react-meteor-data";
import Schemas from '../../api/schemas.js'
import { guidanceitems, units, subcategories, categories } from "../../api/collections.js";
import InfiniteScroll from 'react-infinite-scroller';
import { Breadcrumb, Tag, Collapse, List} from 'antd/dist/antd.min.js';
import { guidanceitemsWithFilter } from '../../api/queries'
import FilterForGuidance from '../reusable/FilterForGuidance';
import ShowMoreText from 'react-show-more-text';
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
      ItemsPerPage: 8,
      hasMore: true,
      selectedItem: null
    };
    // this.scrollParentRef = React.createRef();
    this.loadMore = this.loadMore.bind(this);
  }

  makeGuidanceItems() {
    return(
      <List
      dataSource={this.state.loadedData}
      renderItem={gitem => (
        <List.Item key={"gitem-"+gitem._id} className={(gitem._id == this.state.selectedItem) ? "bg-dark":"bg-white"}
          onClick={()=>{
            if (this.props.isComponent) this.props.onSelect(gitem);
            this.setState({selectedItem:gitem._id})
          }}
        >
	  <div className="container-fluid" >
	    
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
			      
	    <div id={"gitemText-"+gitem._id} className="container-fluid">
	      {/* <p className="m-0">{gitem.item.text}</p> */}
        <ShowMoreText
            /* Default options */
            lines={2}
            more='more'
            less='less'
            anchorClass=''
            expanded={false}
        >
            {gitem.item.text}
        </ShowMoreText>        
	    </div>
          </div>
	  
	</List.Item>
      )}
      >
      </List>   
    )
  }

  loadMore(){
    const fullData = this.props.data;
    let  currentPage = this.state.currentPage;
    let indexOfLastItem = (currentPage + 1) * this.state.ItemsPerPage;
    if (this.state.ItemsPerPage * currentPage >= fullData.length) {
      return;
    }
    if (indexOfLastItem >= fullData.length){
      indexOfLastItem =  fullData.length;
      this.setState({hasMore: false});
    }
    let indexOfFirstItem = indexOfLastItem - this.state.ItemsPerPage;
    if (indexOfFirstItem < 0) indexOfFirstItem = 0;
    const data = this.state.loadedData.concat(fullData.slice(indexOfFirstItem, indexOfLastItem));
    this.setState({loadedData: data,  currentPage: currentPage + 1 });
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
      if (this.props.isComponent) {
        return (
          <div className="container" style={{height:"90%", overflow:"auto", marginTop:20}} ref={(ref) => this.scrollParentRef = ref}>
            {/* <Collapse bordered={false} expandIconPosition='right'>
            <Panel header="Guidance Items"> */}
              <InfiniteScroll
                  initialLoad={false} 
                        pageStart={0}
                        loadMore={this.loadMore}
                        hasMore={this.state.hasMore}
                        useWindow={false}
                        getScrollParent={() => this.scrollParentRef}
                    >
                {this.makeGuidanceItems()} 
              </InfiniteScroll>
            {/* </Panel>
                  </Collapse> */}
          </div>
              );
      }
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

GuidanceItems = withTracker(({searchquery}) => {
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

    //-------search with select filter--------
  // console.log('filterquery: ', searchquery)
  const guidanceQuery_Clone = guidanceitemsWithFilter.clone(searchquery);
  guidanceQuery_Clone.subscribe();
  let guidance_data = guidanceQuery_Clone.fetch()

  //filtering guidance_data
  guidance_data = guidance_data.filter(item=>{
      //in case unit & subcategory & category undefined
      let flag = false
      item.units.every( u => {
  if (u && u.subcategory && u.subcategory.category) {
          flag = true
          return false
  }
  return true
      })
  return flag
    })
  // filtered guidance ids
  const guidanceIdswithFilter = guidance_data.map(item=>item._id)
  const data = guidanceitems.find({_id:{$in:guidanceIdswithFilter}}).fetch()
  return {
    data,
    isLoading: false
  };
})(GuidanceItems);

// Guidance Viewer Container
GuidanceView = ({isComponent, onSelect}) => {
  
  const [searchQuery, setSearchQuery] = useState({});
  const setQuery = (query) => {setSearchQuery(query); setKey(Date.now())}
  const [key, setKey] = useState(Date.now())
  return (
    <div className="plan-view container-fluid" style={{height:"100%"}}>
      <FilterForGuidance onChangeQuery={setQuery}/>
      <GuidanceItems searchquery={searchQuery} onSelect={onSelect} isComponent={isComponent} key={key}/>
    </div>
  )
}

export default GuidanceView
