// Map.jsx
// Logistic Map component

import React, { Component } from 'react';
import { withTracker } from 'meteor/react-meteor-data';
import {mapnodes, categories } from '../../api/collections.js'
import Schemas from '../../api/schemas.js'
import { Tag, Divider } from 'antd/dist/antd.min.js';
import * as d3 from "d3";


const catColors = {'Health & Safety / Operations':'#FF9263', 'Instructional Programs':'#00a6a3',  'Student Support & Family Engagement':'#2AAAE1'}
//const Colors = ['#FF9263','#00a6a3','#2AAAE1'] ;
const LeftCategories = ['Instructional Programs',  'Student Support & Family Engagement'];
const Dimensions = Schemas.dimensions;
//const dimColors = ["#ff595e","#087e8b","#ffca3a","#8ac926","#1982c4","#6a4c93"]
const dimColors = ["magenta","volcano","orange","blue","geekblue","purple"]


class Map extends Component {
  constructor(props) {
    super(props);

    this.state = {
      width: window.innerWidth,
      height: window.innerHeight - $('.navbar').outerHeight(),
    };
  }

  render(){

    const { user, loading, mapnodesExists, mapnodes } = this.props;  
    
    if(loading){
      return(
        <div className="d-flex justify-content-center text-primary">
          <div className="spinner-border" role="status">
            <span className="sr-only">Loading...</span>
          </div>
        </div>
      )
    }else{
      return(
	<div id="Map">
	  <div id="mapcanvas" className=""></div>
	  {this.Dimensions()}
	</div>
      );
    }    
  }

  Dimensions(){
    return(
      <div id="dimensions" className="container-fluid mb-3">
	<div className="row justify-content-center">
	  {
	    Dimensions.map((dim, index) => {
	      return(
		<div key={index} className="col-md-auto d.flex mr-1 ml-1 p-0">
		  <div className="m-auto text-center">
		    <Tag color={dimColors[index]}><p className="m-1">{dim}</p></Tag>
		  </div>
		</div>
	      )
	    })
	  }
	</div>
      </div>
    )
  }

  drawMap(){ 
    
    let nodes_data = this.props.mapnodes[0];
    
    let  width = this.state.width,
	 height =this.state.height - $('#dimensions').outerHeight(true),
	 treeWidth = 0.3*width,
	 treeHeight = 0.95*height,
	 shiftdx = 0.025*width,
	 shiftdy = 0.025*height,
	 //dendradius = width / 2, // radius of dendrogram
	 treeOpacity = 0.7,
         noderadius = 12; // radius of nodes
    

    const svg = d3.select("#mapcanvas").append("svg")
		  .attr("id", "svgMap")
		  .attr("width", width)
		  .attr("height", height)
		  .append("g")
		  .attr("transform", "translate("+shiftdx+","+shiftdy+")");

    //console.log(nodes_data);
    let LeftNodes = {...nodes_data}; LeftNodes.children = nodes_data.children.filter(child => LeftCategories.includes(child.name) );
    let RightNodes = {...nodes_data}; RightNodes.children = nodes_data.children.filter(child => !LeftCategories.includes(child.name) );
    
    //let root = d3.hierarchy(nodes_data);
    let rootLeft = d3.hierarchy(LeftNodes);
    let rootRight = d3.hierarchy(RightNodes);

    // Create a tree layout and pass our nodes_data to it
    //const tree = d3.tree().size([treeHeight, treeWidth]);
    const tree = d3.cluster().size([treeHeight, treeWidth]);
    
    tree(rootLeft);
    tree(rootRight);
    //rootLeft.x = rootRight.x; rootLeft.y = rootRight.y;
    //let root = rootRight.copy();
    rootRight.x = rootLeft.x; rootRight.y = rootLeft.y;
    let root = rootLeft.copy();
    tree(root);
    //root.children = rootRight.children.concat(rootLeft.children);
    root.children = rootLeft.children.concat(rootRight.children);

    let flip = (d) => {
      let anames = d.ancestors().map( a => a.data.name);
      let inLeft = anames.filter(e => LeftCategories.includes(e) );
      let flip = 1;
      if (inLeft.length) flip = -1;
      return flip;
    };

    let selectColor = (d) =>{
      let node =  d.target ?  d.target :  d;
      let anames = node.ancestors().map( a => a.data.name);
      let category = Object.keys(catColors).find( cat => anames.includes(cat) );
      return catColors[category];
    }

    let nodeSize = (d) =>{
      let node =  d.source ?  d.source :  d;
      let size = noderadius - 0.25*noderadius*node.depth;
      return size;
    }
   
    // Link generator
    const linksGenerator = d3.linkHorizontal()
			     .x(function(d) {
			       return (flip(d)*d.y + 0.5*width);
			     })
			     .y(function(d) { return d.x; });

    // Add links between nodes
    const link = svg.selectAll("path")
		    .data(root.links())
		    .enter().append("path")
		    .attr("d", linksGenerator)
		    .attr("class", "link")
		    .attr("fill", "none")
		    .attr("stroke", d => selectColor(d))
		    .attr("stroke-width", d=> nodeSize(d))
		    .attr("stroke-opacity", treeOpacity);	    	    
    
    // Add  nodes.
    const node = svg.selectAll("g")
		    .data(root.descendants())
		    .enter().append("g")
		    .attr("class", "node")
		    .attr("transform", function(d) {
		      return "translate(" + (flip(d)*d.y + 0.5*width) + "," + d.x + ")";
		    });
                   //.attr("transform", function(d) { return "rotate(" + (d.x - 90) + ")translate(" + d.y + ")"; })
    
    // Add triangles/arrows
    node.filter(d => (d.depth == 0)).append("path")
		     .attr('d', d => {
		       let size =  0.75*nodeSize(d);
		       let dx = '-'+0.9*size;
		       let dy = 0;
		       return  ('M ' + dy +' '+ dx + ' l '+size+' '+size+' l '+ -2*size+' 0 z');
		     })
		     .attr("transform", function(d) { return "rotate(" + (90) + ")"; })
      		     .attr("fill", "#fff");

    node.filter(d => (d.depth == 0)).append("path")
	.attr('d', d => {
	  let size =  0.75*nodeSize(d);
	  let dx = '-'+0.9*size;
	  let dy = 0;
	  return  ('M ' + dy +' '+ dx + ' l '+size+' '+size+' l '+ -2*size+' 0 z');
	})
	.attr("transform", function(d) { return "rotate(" + (-90) + ")"; })
      	.attr("fill", "#fff");
    
    node.filter(d => (d.depth >0 && d.children)).append("path")
	.attr('d', d => {
	  let size =  0.75*nodeSize(d);
	  let dx = '-'+size;
	  let dy = 0;
	  return  ('M ' + dy +' '+ dx + ' l '+size+' '+size+' l '+ -2*size+' 0 z');
	})
	.attr("transform", function(d) { return "rotate(" + (flip(d)*90) + ")"; })
      	.attr("fill", "#fff");

    // Add circles
    node.filter(d => (!d.children)).append("circle")
      		     .attr("fill", "#fff")
      		     .attr("r", d => nodeSize(d))
		     .attr("stroke", d => selectColor(d))
		     .attr("stroke-width", "2px")	    

      // Add text background
      node.filter(d => (d.depth > 0)).append("text")


      // Add Black Text
      node.filter(d => (d.depth > 0)).append("text")
		     .attr("dx", function(d) {
		       let f = flip(d);
		       let dx = d.children ? 0 : f*8;
		       if (d.depth == 1)  dx = f*-50;
		       return dx;
		     })
		     .attr("dy",  function(d) {
		       let  dy =  d.depth > 0 ? -15 : 3;
		       dy = d.children ? dy : 3;	 
		       return dy;
		     })
    		     .attr("font-family", "Helvetica")
    		     .attr("font-size", d => {
		       let fs = 17 - d.depth
		       return fs;
		     })
		     //.attr("font-weight", 'bold' )
		     .attr("text-anchor", function(d) {
		       if (flip(d) == 1) {
			 return d.children ? "middle" : "start";
		       } else {
			 return d.children ? "middle" : "end";
		       };
		     })
		     //.attr("fill", d => selectColor(d))
		     .attr("fill", 'black')
		     .text(function(d) {
		       return d.data.name;
		     });      
      // Add Colored Text
      node.filter(d => (d.depth > 0)).append("text")
		     .attr("dx", function(d) {
		       let f = flip(d);
		       let dx = d.children ? 0 : f*8;
		       if (d.depth == 1)  dx = f*-50;
		       return dx;
		     })
		     .attr("dy",  function(d) {
		       let  dy =  d.depth > 0 ? -15 : 3;
		       dy = d.children ? dy : 3;	 
		       return dy;
		     })
    		     .attr("font-family", "Helvetica")
    		     .attr("font-size", d => {
		       let fs = 17 - d.depth
		       return fs;
		     })
	             //.attr("font-weight", 'bold' )
		     .attr("text-anchor", function(d) {
		       if (flip(d) == 1) {
			 return d.children ? "middle" : "start";
		       } else {
			 return d.children ? "middle" : "end";
		       };
		     })
		     .attr("fill", d => selectColor(d))
		     .attr("fill-opacity", '0.5')
		     .text(function(d) {
		       return d.data.name;
		     });
    

  }

  redrawMap(){
    $("#svgMap").remove();
    this.drawMap();   
  }
  
  updateDimensions(){
    this.setState({
      width: window.innerWidth,
      height: window.innerHeight - $('.navbar').outerHeight(),
    });
  }

  componentDidMount(){
    this.updateDimensions();
    window.addEventListener("resize", this.updateDimensions.bind(this));
    if (!this.props.loading) this.drawMap();
  }

  componentDidUpdate(){
    if (!this.props.loading) this.redrawMap();
  }

  componentWillUnmount() {
    window.removeEventListener("resize", this.updateDimensions.bind(this));
  }

}


export default withTracker(() => {
  const user = Meteor.user();
  const mapnodesHandle = Meteor.subscribe('mapnodes');
  const loading = !mapnodesHandle.ready();
  const mapnodes_fetch = mapnodes.find({}, { sort: { createdAt: -1 } }).fetch();
  const mapnodesExists = !loading && !!mapnodes;
  return {
    user,
    loading,
    mapnodesExists,   
    mapnodes: mapnodesExists ? mapnodes_fetch : {}
  };
})(Map);