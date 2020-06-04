import React, { Component } from "react";
import { withTracker } from 'meteor/react-meteor-data';
import { guidanceitems} from "../../api/collections.js";

class GuidanceItems extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  makeGuidanceItems(guidanceitems){
    return(
      guidanceitems.slice(0, 3).map( (gitem, index) =>{
	return(
	  <div key={index} className="card-body">
	    <p>
	      {gitem.type} <br />
	      {gitem.source} <br />
	      {gitem.location_in_source} <br />
	      {gitem.item.text} <br />
	      {gitem.unitIds} <br />
	      {gitem.dimensions} <br />
	    </p>
	  </div>
	)
      }));
  }
  
  render() {
    
    const { loading, guidanceitemsExists, guidanceitems } = this.props;
    
    if(loading){
      return(
        <div className="d-flex justify-content-center text-primary">
          <div className="spinner-border" role="status">
            <span className="sr-only">Loading...</span>
          </div>
        </div>
      )
    }else{

      const guidanceItems = this.makeGuidanceItems(guidanceitems) ;
      
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
                      aria-expanded="true"
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
                  <div className="row">
                    <div className="col">
                      <button
			  className="btn btn-secondary dropdown-toggle"
			  type="button"
			  id="dropdownMenuButton"
			  data-toggle="dropdown"
			  aria-haspopup="true"
			  aria-expanded="false"
                      >
			Types
                      </button>
                      <div
			  className="dropdown-menu"
			  aria-labelledby="dropdownMenuButton"
                      >
			<a className="dropdown-item" href="#">
                          Test 01
			</a>
                      </div>
                    </div>
                    <div className="col">
                      <button
			  className="btn btn-secondary dropdown-toggle"
			  type="button"
			  id="dropdownMenuButton"
			  data-toggle="dropdown"
			  aria-haspopup="true"
			  aria-expanded="false"
                      >
			Sources
                      </button>
                      <div
			  className="dropdown-menu"
			  aria-labelledby="dropdownMenuButton"
                      >
			<a className="dropdown-item" href="#">
                          Test 02
			</a>
                      </div>
                    </div>
                    <div className="col">
                      <button
			  className="btn btn-secondary dropdown-toggle"
			  type="button"
			  id="dropdownMenuButton"
			  data-toggle="dropdown"
			  aria-haspopup="true"
			  aria-expanded="false"
                      >
			Categories
                      </button>
                      <div
			  className="dropdown-menu"
			  aria-labelledby="dropdownMenuButton"
                      >
			<a className="dropdown-item" href="#">
                          Test 03
			</a>
                      </div>
                    </div>
                    <div className="col">
                      <button
			  className="btn btn-secondary dropdown-toggle"
			  type="button"
			  id="dropdownMenuButton"
			  data-toggle="dropdown"
			  aria-haspopup="true"
			  aria-expanded="false"
                      >
			Subcategories
                      </button>
                      <div
			  className="dropdown-menu"
			  aria-labelledby="dropdownMenuButton"
                      >
			<a className="dropdown-item" href="#">
                          Test 04
			</a>
                      </div>
                    </div>
                    <div className="col">
                      <button
			  className="btn btn-secondary dropdown-toggle"
			  type="button"
			  id="dropdownMenuButton"
			  data-toggle="dropdown"
			  aria-haspopup="true"
			  aria-expanded="false"
                      >
			Dimensions
                      </button>
                      <div
			  className="dropdown-menu"
			  aria-labelledby="dropdownMenuButton"
                      >
			<a className="dropdown-item" href="#">
                          Test 05
			</a>
                      </div>
                    </div>
                  </div>
		</div>

		{/*GuidanceItems*/}

		{guidanceItems}
	
              </div>
            </div>
          </div>
	</div>
      );
    }
  }
}


GuidanceItems = withTracker(()=>{
  //const user = Meteor.user();
  const guidanceitemsHandle = Meteor.subscribe('guidanceitems');
  const loading = !guidanceitemsHandle.ready();
  const guidanceitems_fetch = guidanceitems.find({}, { sort: { createdAt: -1 } }).fetch();
  const guidanceitemsExists = !loading && !!guidanceitems;
  return {
    //user,
    loading,
    guidanceitemsExists,   
    guidanceitems: guidanceitemsExists ? guidanceitems_fetch : {}
  };
})(GuidanceItems);

export default GuidanceItems;
