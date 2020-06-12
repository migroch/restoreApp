// initialmap_data.js
// Initial categories, subcategories and units, defining the initial logistics map/tree structure

import X2JS from 'x2js';
import convertFreemindNodes from '../api/convertFreemindNodes.js';

const x2js = new X2JS();
const data_mm = Assets.getText('LogisticsMap.mm');
const data_json = x2js.xml2js(data_mm);

const mapnodes_data = convertFreemindNodes(data_json);
const categories_data = [];
const subcategories_data = [];
const units_data = [];
console.log("RRRR", mapnodes_data)
mapnodes_data.children.forEach( (child) =>{
    let category = child.name;
    categories_data.push({name: category});
    child.children.forEach( (child) =>{
	let subcategory = child.name;
	subcategories_data.push({categoryId: category, name:child.name});
	if (child.children) child.children.forEach( (child) =>{
	    let unit =  child.name;
	    units_data.push({subcategoryId: subcategory, name: unit});
	});
    });
});

export {mapnodes_data, categories_data, subcategories_data, units_data}
