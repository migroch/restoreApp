// convertFreemindNodes.js
// Convert tree map nodes from the Freemind structure (.mm) to our schema structure

export default convertFreemindNodes = function (json) {
    
    var travel = function (node, out) {
	if(node["_TEXT"]) {
	    out.name = node["_TEXT"].replace(/\*/g,'').trim(); 
	}
	if(node["_LINK"]) {
	    out.url = node["_LINK"];
	}
	if(node.node && node.node.length) {
	    out.children = [];
	    for(var i = 0; i < node.node.length; i++) {
		var child = {};
		child = travel(node.node[i], child);
		out.children.push(child);
	    }
	}
	return out;
    };
    
    var tree = {};
    tree = travel(json.map.node, tree);
    
    return tree;
};

