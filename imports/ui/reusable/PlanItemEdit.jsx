import React, {useState} from 'react';
import { Meteor } from 'meteor/meteor';
import moment from 'moment';
import { Select, DatePicker, Cascader, Form, Button, Modal, Row, Col, Input } from 'antd/dist/antd.min.js';
import { withTracker } from 'meteor/react-meteor-data';
import  Schemas from '../../api/schemas';
import { planitems, subcategories, units } from '../../api/collections';
import ReactQuill from 'react-quill/dist/react-quill.min.js';
import 'react-quill/dist/quill.snow.css';
import Editor from './CustomQuill'
import GuidanceView from '../hocs/GuidanceItems'
import { uniq } from 'lodash'
import MultiDimensionInput from './MultiDimensionInput'
import MultiMaplocationInput from './MultiMaplocationInput'
const { Option } = Select;
const dateFormat = 'YYYY/MM/DD';
const dimensions = Schemas.dimensions;


const mapOptions = () => {
  let mapOptions = []
  units.find({}).fetch().forEach(u =>{
    let subcategory = u.subcategoryName() || u.subcategory.name;
    let subcategoryId = u.subcategoryId ;
    let category = u.categoryName() || u.subcategory.category.name;
    let categoryId = u.categoryId() || u.subcategory.category._id;
    let categoryOpt = mapOptions.filter(c => c.value == categoryId)[0]
    if (categoryOpt){
      let subcategoryOpt = categoryOpt.children.filter(s => s.value==subcategoryId)[0];
      if (subcategoryOpt){
        let uIds = subcategoryOpt.children.map(u => u.value);
        if (!uIds.includes(u._id)) subcategoryOpt.children.push({label:u.name, value:u._id});
      } else {
        categoryOpt.children.push({label:subcategory, value:subcategoryId, children: [{label:u.name, value:u._id}]});
      }
    } else {
      mapOptions.push({label:category, value:categoryId,   children:[
	{label:subcategory, value:subcategoryId,  children: [{label:u.name, value:u._id}]}
      ]})
    }
  });
  // Add subcategories withouth units
  subcategories.find({}).fetch().forEach(s =>{
    let subcategory = s.name;
    let subcategoryId = s._id;
    let category = s.categoryName() || s.category.name;
    let categoryId = s.categoryId ;
    let categoryOpt = mapOptions.filter(c => c.value == categoryId)[0]
    if (categoryOpt){
      let subcategoryOpt = categoryOpt.children.filter(s => s.value==subcategoryId)[0];
      if (!subcategoryOpt) categoryOpt.children.push({label:subcategory, value:subcategoryId, children:[]})
    } else {
      mapOptions.push({label:category, value:categoryId,  children:[{label:subcategory, value:subcategoryId}]});
    }
  });
   return mapOptions
}

const empty_data = {
  title: '',
  unitIds: [],
  item: {
    text: ''
  },
  ownerId: undefined,
  dueDate: undefined,
  assignedToIds: [],
  dimensions: undefined
}

PlanItem = ({id, data, disabled, isLoading, disableEditMode, finishAddItem, planId, users }) => {
  if (isLoading) return null;
  //if id is null or undefined, it is when add new plan item
  let { item, dimensions, assignedToIds, dueDate, unitIds, ownerId, title } = (id) ? data : empty_data ;
  const [guidance, setGuidance] = useState({visible: false, selectedItem: null}) ;
  const [guidanceItem, setGuidanceItem] = useState(null) ; // selected guidance item but not confirmed
  const [itemHtml, setItemHtml]  = useState(item.text) ;

    const submit = planItem => {
    planItem.title = planItem.title;
    planItem.dueDate = planItem.dueDate.format(dateFormat);
    planItem.unitIds = uniq(planItem.unitIds.map(item=>item.pop()))
    planItem.ownerId = Meteor.userId(); //TODO: changed to signed user.
    planItem.item = {text: itemHtml} ;
    if (id) {
      Meteor.call('planItem.update', {planItemId:id, planItem}, (err, res) => {
        if (err) {
         alert(err);
         disableEditMode();
        } else {
          disableEditMode();
        }
      })
    } else {
      Meteor.call('planItem.add', {planId, planItem}, (err, res) => {
        if (err) {
         alert(err);
         finishAddItem();
        } else {
          finishAddItem();
        }
      })
    }
  }

  handleOk = e => {
    setGuidance({visible: false, selectedItem: guidanceItem})
    setItemHtml(guidanceItem.item.text)
  };

  handleCancel = e => {
    setGuidance({visible: false, selectedItem: null})
  };
  
  const [form] = Form.useForm();
  
  if (!!guidance.selectedItem){
    let unitIds_fromGuidance = guidance.selectedItem.unitIds.map(id =>  units.findOne(id) ? [units.findOne(id).categoryId(), units.findOne(id).subcategoryId, id] :  subcategories.findOne(id) && [subcategories.findOne(id).categoryId, id] );
    unitIds_fromGuidance = unitIds_fromGuidance.filter(u => u);
    form.setFieldsValue({
      title: "New Plan Item",
      dimensions: guidance.selectedItem.dimensions.filter(d => d),
      unitIds: unitIds_fromGuidance , 
    });
    // if (itemHtml !== guidance.selectedItem.item.text) setItemHtml(guidance.selectedItem.item.text);
    // unitIds = guidance.selectedItem.unitIds
  }

  initialValues = ()=>{
    let values = { 
      title,
      unitIds: unitIds.map(id =>  units.findOne(id) ? [units.findOne(id).categoryId(), units.findOne(id).subcategoryId, id] :  subcategories.findOne(id) && [subcategories.findOne(id).categoryId, id] ), 
      assignedToIds, 
      dimensions: dimensions,
      item,
    }
    if (dueDate) values.dueDate = moment(dueDate, dateFormat) ;
    return values;
  }
  
  return (
    <div className="plan-item-edit">
       
      {/* <Button onClick={()=>setGuidance({visible:true, selectedItem: null})} className="my-2 w-100" style={{color:"#2AAAE1"}}><p> <strong>Use Guidance</strong> </p></Button> */}
      
        <Modal
          title="Guidance Items"
          visible={guidance.visible}
          width="90%"
          bodyStyle={{height: window.innerHeight - $("nav").outerHeight() -120}}
          okText ="Use Selected Item"
          //cancetText="Go Back"
          onOk={this.handleOk}
          okButtonProps={{ disabled: !guidanceItem }}
          onCancel={this.handleCancel}
        >
            <GuidanceView isComponent onSelect={g=>setGuidanceItem(g)}/>
        </Modal>

      <Form 
          // {...layout}
	//layout="inline"  
        name="Plan Item Edit"
        form={form}
        initialValues={initialValues()}
        onFinish={submit}
        // onFinishFailed={onFinishFailed}
      >
  <Row gutter={[8,0]} align="middle">
  <Form.Item
    placeholder="Title"
    name="title"
    rules={[{ required: true, message: 'Please input title' }]}
  >
    <Input />
  </Form.Item>      
  </Row>
	<Row gutter={[8,0]} align="middle">

	  <Col span={10}>
	    <Form.Item
              //label="Map Location"
	      placeholder="Map Location"
              name="unitIds"
              rules={[{ required: true, message: 'Please add a Map Location!' }]}
            >
              <MultiMaplocationInput options={mapOptions()} />
            </Form.Item>
	  </Col>

	  <Col span={5}>
	    <Form.Item
		name="dimensions"
		rules={[{ required: true, message: 'Please add a Dimension!' }]}
            >
              {/* <Select
		  disabled={disabled}
		  placeholder="Dimension" 
	      >
		{ dimensions.map((d, index)=><Option key={index+d} value={d}>{d}</Option>) }
              </Select>    */}
              <MultiDimensionInput />
            </Form.Item>
	  </Col>

	  <Col span={5}>
	    <Form.Item
            //label="Assigned To"
	      placeholder="Assigned to"
              name="assignedToIds"
              rules={[{ required: true, message: 'Please assign to at least one user!' }]}
            >
              <Select
		  mode="tags"
		  disabled={disabled}
		  placeholder="Assigned to"
		  // onChange={handleChange}
		  //style={{ width: '30%' }}
		  // listHeight={30}
              >
		{/* {children} */}
		{ users.map((user, index)=><Option key={"assigned"+user.id} value={user.id}>{user.name}</Option>) }
              </Select>   
            </Form.Item>  
	  </Col>

	  <Col span={4}>
	    <Form.Item
            //label="Due Date"
              name="dueDate"
	      placeholder="Due date"
              //className="date-input"
              rules= {[
		{
		  type: 'object',
		  required: false,
		  message: 'Please enter a Due Date',
		  whitespace: true,
		},
              ]}
            >
              <DatePicker disabled={disabled}  format={dateFormat} />
            </Form.Item>       
  	  </Col>

	</Row>
      </Form>

      {/* <Form.Item
      name={["item", "text"]}
      > */}
      
      {/*       <Editor onChange={setItemHtml} defaultValue={itemHtml} submit={()=>form.submit()} id={id ?  id : Random.id()} /> */}
      {/* </Form.Item> */}

      <div className="text-editor">
        <ReactQuill
            onChange={(v,e)=>setItemHtml(v)}
	    value={itemHtml}  
            theme={"snow"} // pass false to use minimal theme
        >
	</ReactQuill>
      </div>
      
      <Button type="primary" onClick={form.submit} className="mt-2">
        Save Plan Item
      </Button>
      <Button type="cancel" style={{marginLeft: 50}} className="mt-2" onClick={ id ? disableEditMode : finishAddItem }>
        Cancel
      </Button>        
            
    </div>
  )
}
export default withTracker(({id}) => {
  const handles = [
    Meteor.subscribe('planitems'),
    Meteor.subscribe('categories'),
    Meteor.subscribe('subcategories'),
    Meteor.subscribe('units'),
    // Meteor.subscribe('allUserData'),

  ];
  const isLoading = handles.some(handle => !handle.ready());

  if(isLoading){
    return {
      data: null,
      isLoading: true
    };
  }

  const users = Meteor.users.find({}).fetch()
                    .map(user => ({id: user._id, name: user.profile.name}));

  let data
  if (id) {
    data = planitems.findOne(id)
  }
  return {
    data,
    users,
    isLoading: false
  };
})(PlanItem);
