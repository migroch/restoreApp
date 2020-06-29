// Map.jsx
// Logistic Map component

import React, { Component } from 'react';
// import { withRouter } from 'react-router-dom';
import { withTracker } from 'meteor/react-meteor-data';
import {mapnodes, categories } from '../../api/collections.js'
import Schemas from '../../api/schemas.js'
import { Tag, Divider } from 'antd/dist/antd.min.js';
import * as d3 from "d3";
import queryString from 'query-string';

const catColors = {'Health & Safety / Operations':'#FF9263', 'Instructional Programs':'#00a6a3',  'Student Support & Family Engagement':'#2AAAE1'}
//const Colors = ['#FF9263','#00a6a3','#2AAAE1'] ;
const LeftCategories = ['Instructional Programs',  'Student Support & Family Engagement'];
const Dimensions = Schemas.dimensions;
//const dimColors = ["#ff595e","#087e8b","#ffca3a","#8ac926","#1982c4","#6a4c93"]
const dimColors = ["magenta","volcano","orange","blue","geekblue","purple"]

//const dendradius = width / 2, // radius of dendrogram
const treeOpacity = 0.7;
const noderadius = 12; // radius of nodes

class Map extends Component {
  constructor(props) {
    super(props);

    this.state = {
      width: window.innerWidth,
      height: window.innerHeight - $('.navbar').outerHeight(),
    };

    this.handleNodeClick = this.handleNodeClick.bind(this);
    this.handleDimensionClick = this.handleDimensionClick.bind(this);
    this.updateDimensions = this.updateDimensions.bind(this);
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
		  <div className="m-auto text-center"  onClick={this.handleDimensionClick}>
		    <Tag style={{"cursor":"pointer"}} color={dimColors[index]}><p className="m-1">{dim}</p></Tag>
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

    // Config values
    let  width = this.state.width,
	 height =this.state.height - $('#dimensions').outerHeight(true);

    // Creage top svg container
    const svg = d3.select("#mapcanvas").append("svg")
		  .attr("id", "svgMap")
		  .attr("width", width)
		  .attr("height", height)
		  .attr("transform",  "translate(" + 20  + "," + 0 + ")" );

    // Links layer
    svg.append('g')
       .attr("id", "linksLayer")
       .attr("width", width)
       .attr("height", height);

    // Nodes layer
    svg.append('g')
       .attr("id", "nodesLayer")
       .attr("width", width)
       .attr("height", height);

   
    
    // Define nodes
    const nodes_data = this.props.mapnodes[0];
      
    // Create root hirarchy
    const root = d3.hierarchy(nodes_data);
  
    // Give id's to nodes
    root.descendants().forEach((d, i) => {
      d.id = i;
      d._children = d.children;
      if (d.depth > 0) d.children = null;
    });
   
    root.left_children = root.children.filter( d => LeftCategories.includes(d.data.name));
    root.right_children = root.children.filter( d => !LeftCategories.includes(d.data.name));
    this.root = root
    
    // this.updateTree(rootRight, rootRight);
    this.updateTree(root);
  }

  updateTree(sourceNode){
    // Config values    
    let  width = this.state.width,
	 height =this.state.height - $('#dimensions').outerHeight(true),
	 treeWidth = 0.3*width,
	 treeHeight = 0.95*height,
	 x0 = height/2, // position of root node
	 dx0 = 0.02*height,
	 y0 = 0,
	 dy0 = 0.5*width,
	 duration = 750; // transition duration

    let flip = this.flip;
    let selectColor = this.selectColor;
    let nodeSize = this.nodeSize;


    let separation = (a, b) => {
      return (a.parent == b.parent ? 1 : 2) / a.depth;
    }
    
    // Define Tree layout generator  
    //const tree = d3.cluster().size([treeHeight, treeWidth]);
    const tree = d3.tree()
		   .size([treeHeight, treeWidth])
		   .separation( (a, b) => {
		     return (a.parent == b.parent ? 1 : 2) / a.depth;
		   });

    let root = this.root;
    if (root.children) {
      root.children = root.left_children;
      tree(root);
      root.left_children = root.children;
      root.children = root.right_children;
      tree(root);
      root.right_children = root.children;
      root.children = root.right_children.concat(root.left_children);
    } else {
      tree(root)
    } 
   
    root.x0 = x0+dx0; root.y0=y0+dy0;
    root.x = x0; root.y=y0;
    this.root = root;

    let nodes = root.descendants().reverse();
    nodes.forEach(d => {
      d.y = flip(d)*d.y + dy0;
      d.x = d.x + dx0;
    });

    // Create links between nodes
    let links = root.links();
    
    // Define Link generator
    const link = d3.select("#linksLayer").selectAll("path.link")
		   .data(links, d => d.target.id);

    let linksGenerator = d3.linkHorizontal()
			   .x( d => sourceNode.y0 )
			   .y( d =>  sourceNode.x0);
    
    const linkEnter = link.enter().append("path")
			  .attr("d", linksGenerator)
			  .attr("class", "link")
			  .attr("fill", "none")
			  .attr("stroke", d => selectColor(d))
			  .attr("stroke-width", d=> nodeSize(d))
			  .attr("stroke-opacity", treeOpacity);	    	    
 
    // Update Links
    linksGenerator = d3.linkHorizontal()
		       .x( d => d.y )
		       .y( d =>  d.x);
    link.merge(linkEnter).transition()
	.duration(duration)
	.attr("d", linksGenerator);
    
    linksGenerator = d3.linkHorizontal()
		       .x( d => sourceNode.y )
		       .y( d =>  sourceNode.x);
    link.exit().transition().remove()
	.duration(duration)
	.attr("d", linksGenerator);

    // Create/update the nodes.
    const node = d3.select("#nodesLayer").selectAll("g.node")
		   .data(nodes, d =>  d.id );

    const nodeEnter = node.enter().append("g")
			  .attr("class", "node")
			  .attr("transform", function(d) {
			    return "translate(" + sourceNode.y0  + "," + sourceNode.x0 + ")"; // initially placed at source node
			  })
			  .attr("fill-opacity", 0)
			  .attr("stroke-opacity", 0)
			  .attr("cursor", "pointer")
			  .attr("pointer-events", "all")
			  .on('click', this.handleNodeClick);
    
    // Add triangles/arrows
    nodeEnter.filter(d => (d.depth == 0)).append("path")
	     .attr('d', d => {
	       let size =  0.75*nodeSize(d);
	       let dx = '-'+0.9*size;
	       let dy = 0;
	       return  ('M ' + dy +' '+ dx + ' l '+size+' '+size+' l '+ -2*size+' 0 z');
	     })
	     .attr("transform", function(d) { return "rotate(" + (90) + ")"; })
	     .attr("fill", "#fff");
    nodeEnter.filter(d => (d.depth == 0)).append("path")
	     .attr('d', d => {
	       let size =  0.75*nodeSize(d);
	       let dx = '-'+0.9*size;
	       let dy = 0;
	       return  ('M ' + dy +' '+ dx + ' l '+size+' '+size+' l '+ -2*size+' 0 z');
	     })
	     .attr("transform", function(d) { return "rotate(" + (-90) + ")"; })
      	     .attr("fill", "#fff");
    
    nodeEnter.filter(d => (d.depth >0 && d._children)).append("path")
	     .attr('d', d => {
	       let size =  0.75*nodeSize(d);
	       let dx = '-'+size;
	       let dy = 0;
	       return  ('M ' + dy +' '+ dx + ' l '+size+' '+size+' l '+ -2*size+' 0 z');
	     })
	     .attr("transform", function(d) { return "rotate(" + (flip(d)*90) + ")"; })
      	     .attr("fill", d => selectColor(d))
	     .attr("stroke", 'white')
	     .attr("stroke-width", "2px");

    // Add circles
    nodeEnter.filter(d => (!d._children)).append("circle")
      	     .attr("fill", "#fff")
      	     .attr("r", d => nodeSize(d))
	     .attr("stroke", d => selectColor(d))
	     .attr("stroke-width", "2px");

    // Add  Text
    [{color:'black', opacity:'1'}, {color:selectColor, opacity:'0.5'} ].forEach( tprops =>{
      nodeEnter.filter(d => (d.depth > 0)).append("text")
	       .attr("dx", function(d) {
		 let f = flip(d);
		 let dx = d._children ? 0 : f*8;
		 if ( d.depth == 1)  dx = f*-50;
		 return dx;
	       })
	       .attr("dy",  function(d) {
		 let  dy =  d.depth > 0 ? -15 : 3;
		 dy = d._children ? dy : 3;	 
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
		   return d._children ? "middle" : "start";
		 } else {
		   return d._children ? "middle" : "end";
		 };
	       })
	//.attr("fill", d => selectColor(d))
	       .attr("fill", d => (typeof(tprops.color) == "string" ? tprops.color : tprops.color(d)))
	       .attr("fill-opacity", tprops.opacity)
	       .text(function(d) {
		 return d.data.name;
	       }); 
    });

    // Update positions and transition to them
    const nodeUpdate = node.merge(nodeEnter).transition()
			   .duration(duration)
			   .attr("fill-opacity", 1)
			   .attr("stroke-opacity", 1)
			   .attr("transform", function(d) { return "translate(" + d.y  + "," + d.x + ")"; });

    const nodeExit = node.exit().transition().remove()
			 .duration(duration)
			 .attr("transform", function(d) { return "translate(" + sourceNode.y  + "," + sourceNode.x + ")"; })
			 .attr("fill-opacity", 0)
			 .attr("stroke-opacity", 0);

      
    // Stash the old positions for transition.
    nodes.forEach(function(d) {
      d.x0 = d.x;
      d.y0 = d.y;
    }); 
  } 
  
  handleNodeClick(node) {
    if(node._children){
      node.children = node.children ? null : node._children;
      this.updateTree(node);
    } else {
      const depths = ['category', 'subcategory', 'unit']
      const item = depths[node.depth-1]
      this.props.history.push({
	pathname: '/plan-viewer',
	search: `?${queryString.stringify({[item]: node.data.name})}`
      })
    }
  }

  handleDimensionClick(e){
    let target = e.target;
    let dimension = target.innerHTML;
    this.props.history.push({
      pathname: '/plan-viewer',
      search: `?${queryString.stringify({dimension})}`
    })
  }


  flip(node){
    let anames = node.ancestors().map( a => a.data.name);
    let inLeft = anames.filter(e => LeftCategories.includes(e) );
    let flip = 1;
    if (inLeft.length) flip = -1;
    return flip;
  };

  selectColor(nodeOrLink){
    let node =  nodeOrLink.target ?  nodeOrLink.target :  nodeOrLink;
    let anames = node.ancestors().map( a => a.data.name);
    let category = Object.keys(catColors).find( cat => anames.includes(cat) );
    return catColors[category];
  }

  nodeSize(nodeOrLink){
    let node =  nodeOrLink.source ?  nodeOrLink.source :  nodeOrLink;
    let size = noderadius - 0.25*noderadius*node.depth;
    return size;
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
    window.addEventListener("resize", this.updateDimensions);
    if (!this.props.loading) this.drawMap();
  }

  componentDidUpdate(){
    if (!this.props.loading) this.redrawMap();
  }

  componentWillUnmount() {
    window.removeEventListener("resize", this.updateDimensions);
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
