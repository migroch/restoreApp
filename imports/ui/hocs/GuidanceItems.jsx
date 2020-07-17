import React, { Component, useState } from "react";
import { withRouter } from 'react-router-dom';
import { Promise } from 'meteor/promise';
import { withTracker } from "meteor/react-meteor-data";
import { Meteor } from 'meteor/meteor';
import Schemas from '../../api/schemas.js'
import { guidanceitems, units, subcategories, categories } from "../../api/collections.js";
import InfiniteScroll from 'react-infinite-scroller';
import { Breadcrumb, Tag, Collapse, List} from 'antd/dist/antd.min.js';
import { guidanceitemsWithFilter } from '../../api/queries'
import { GuidanceItemsIndex } from '../../api/collections';
import FilterForGuidance from '../reusable/FilterForGuidance';
import SearchWrapper from '../reusable/SearchWrapper';
import ShowMoreText from 'react-show-more-text';
import { intersection } from 'lodash'
import UserContext from "../context/user";
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
      selectedItems: [],
      selectedItemIds: [],
      selectedItem: null,
    };
    this.loadMore = this.loadMore.bind(this);
  }

  static contextType = UserContext;

  createNewPlan = async (planItems) => {
    if (!Meteor.userId()) {
      this.context.setAuthModalState(true);
      return
    }
    const newPlanItems = planItems.map(planItem => (
      {
        title: "New Plan Item",
        item: planItem.item,
        dimensions: planItem.dimensions.filter(d => d),
        unitIds: planItem.unitIds.filter(u => u), 
        ownerId: Meteor.userId(),
        assignedToIds: []
      }
    ));
    console.log(planItems);
    try {
      const result = await Promise.all(
        newPlanItems.map(async (planitem) => await Meteor.callPromise('planItem.create', planitem))
      )
      const newplan = await Meteor.callPromise('plans.add', {title: "NEW PLAN", scenario:'High Restrictions', planItemIds:result})
      this.props.history.push("/plan-viewer")
    } catch(err) {
      alert(err);
    }
 }
  onClickListitem = gitem => {

    if (!this.props.isMultiSelectable) {
      if (this.props.isComponent) { // when edit plan item from guidance
        this.setState({selectedItem: gitem})
        this.props.onSelect(gitem);
        return;
      }
    }
    
    if (this.state.selectedItemIds.includes(gitem._id)) { // if it is already selected, it should be removed
      var selectedItemIds_array = [...this.state.selectedItemIds];
      var selectedItems_array = [...this.state.selectedItems];
      var index = selectedItemIds_array.indexOf(gitem._id)
      if (index !== -1) {
        selectedItemIds_array.splice(index, 1);
        selectedItems_array.splice(index, 1);
        this.setState({
          selectedItemIds: selectedItemIds_array,
          selectedItems: selectedItems_array
        }, ()=>{
          if (this.props.isComponent) 
            this.props.onSelect(this.state.selectedItems)
        });
      }
    } else {
      this.setState({
        selectedItems: [...this.state.selectedItems, gitem],
        selectedItemIds: [...this.state.selectedItemIds, gitem._id]
      }, ()=>{
        if (this.props.isComponent) 
          this.props.onSelect(this.state.selectedItems)
      })
    }

    
  }
  makeListItemClassName = gitem => {
    let className;
    const { selectedItemIds, selectedItem } = this.state;
    if (this.props.isMultiSelectable) {
      className =  selectedItemIds.includes(gitem._id) ? "border border-info ":"bg-white"
    } else {
      className =  (selectedItem && selectedItem._id == gitem._id )? "border border-info ":"bg-white"
    }
      
    return className
  }
  makeGuidanceItems() {
    return(
      <List
	  dataSource={this.state.loadedData}
	  locale={{emptyText: 'No Guidance Items Found'}}
	  renderItem={gitem => (
      <List.Item key={"gitem-"+gitem._id} 
        className={this.makeListItemClassName(gitem)}
        onClick={()=>this.onClickListitem(gitem)}
      >

	  <div className="container-fluid" style={{position: "relative"}}>
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
    const { selectedItems } = this.state
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
	<div className="container-fluid">
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
      {
        (selectedItems.length) && Meteor.userId() &&
        <div className="new-plan" onClick={()=>this.createNewPlan(selectedItems)}>Start a new plan with selected plan items</div>
      }          
	</div>
      );
    }
  }
}

GuidanceItems = withTracker(({searchquery, searchbar}) => {
  const user = Meteor.user();
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
    //-------1.search with searchbar----------
  // search in planitems (item, dimension)
  let guidanceIdswithSearchBar
  if (searchbar != '')
    guidanceIdswithSearchBar = GuidanceItemsIndex.search(searchbar).fetch().map(gi=>gi.__originalId)

    //-------2.search with select filter--------
  const guidanceQuery_Clone = guidanceitemsWithFilter.clone(searchquery);
  guidanceQuery_Clone.subscribe();
  let guidance_data = guidanceQuery_Clone.fetch();

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
    });
    item.subcategories.every( s => {
      if (s && s.category) {
	flag = true
        return false
      }
      return true
    });
    return flag
  })
    
  // filtered guidance ids
  const guidanceIdswithFilter = guidance_data.map(item=>item._id)

  //------3.intersection of two result from filter and searchbar-------
  let guidanceIds_result
  if (searchbar != '')
    guidanceIds_result = intersection( guidanceIdswithSearchBar, guidanceIdswithFilter)
  else
    guidanceIds_result = guidanceIdswithFilter
  const data = guidanceitems.find({_id:{$in:guidanceIds_result}}).fetch()
  return {
    data,
    isLoading: false
  };
})(GuidanceItems);

// Guidance Viewer Container
GuidanceView = ({isComponent, isMultiSelectable, history, onSelect}) => {
  
  const [searchQuery, setSearchQuery] = useState({});
  const onChangeQuery = (query) => {setSearchQuery(query); setKey(Date.now())}
  const onChangeSearchbar = (query) => {setSearchbar(query); setKey(Date.now())}
  const [key, setKey] = useState(Date.now())
  const [searchbar, setSearchbar] = useState('');
  return (
    <div className="plan-view container-fluid" style={{height:"100%"}}>
      <SearchWrapper onChangeSearchbar={onChangeSearchbar}/>
      <FilterForGuidance onChangeQuery={onChangeQuery}/>
      <GuidanceItems 
        history={history} 
        searchquery={searchQuery} 
        searchbar={searchbar} 
        onSelect={onSelect} 
        isComponent={isComponent} 
        isMultiSelectable={isMultiSelectable} 
        key={key} 
        onSelect={onSelect}
      />
    </div>
  )
}

export default withRouter(GuidanceView);
