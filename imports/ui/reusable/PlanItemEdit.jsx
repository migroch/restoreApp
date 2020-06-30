import React, {useState} from 'react';
import { Meteor } from 'meteor/meteor';
import moment from 'moment';
import { Select, DatePicker, Cascader, TreeSelect, Form, Button, Modal } from 'antd/dist/antd.min.js';
import { withTracker } from 'meteor/react-meteor-data';
import  Schemas from '../../api/schemas';
import { plans, planitems, categories, subcategories, units } from '../../api/collections';
import ReactQuill from 'react-quill/dist/react-quill.min.js';
import 'react-quill/dist/quill.snow.css';
import GuidanceView from '../hocs/GuidanceItems'

const { Option } = Select;
const { TreeNode } = TreeSelect;
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
  unitIds: [],
  item: {
    text: ''
  },
  ownerId: '',
  dueDate: new Date(),
  assignedToIds: [],
  dimension: ''
}

PlanItem = ({id, data, disabled, isLoading, disableEditMode, finishAddItem, planId, users }) => {
  if (isLoading) return null
  let guidanceItem = null
  let { item, dimension, assignedToIds, dueDate, unitIds, ownerId } = (id) ? data : empty_data
  const [guidance, setGuidance] = useState({visible: false, selectedItem: null})
  const onFinish = planItem => {
    planItem.dueDate = planItem.dueDate.format(dateFormat);
    planItem.unitIds = [planItem.unitIds.pop()];
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
  };

  handleCancel = e => {
    setGuidance({visible: false, selectedItem: null})
  };
  
  const [form] = Form.useForm();
  if (!!guidance.selectedItem){
    form.setFieldsValue({
      item:guidance.selectedItem.item,
      dimension:guidance.selectedItem.dimensions[0],
      unitIds:  guidance.selectedItem.unitIds.map(id =>  units.findOne(id) ? [units.findOne(id).categoryId(), units.findOne(id).subcategoryId, id] :  subcategories.findOne(id) && [subcategories.findOne(id).categoryId, id] )[0], 
    });
    // unitIds = guidance.selectedItem.unitIds
  }
  return (
    <div className="plan-item-edit">
      <Button onClick={()=>setGuidance({visible:true, selectedItem: null})} className="my-2 w-100" style={{color:"#2AAAE1"}}><p> <strong>Use Guidance</strong> </p></Button>
        <Modal
          title="Guidance Items"
          visible={guidance.visible}
          width="90%"
          bodyStyle={{height: window.innerHeight - $("nav").outerHeight() -120}}
	  okText ="Use Selected Item"
	  //cancetText="Go Back"
          onOk={this.handleOk}
          onCancel={this.handleCancel}
          // confirmLoading={confirmLoading}
        >
            <GuidanceView isComponent onSelect={g=>guidanceItem = g}/>
        </Modal>      
      <Form
        // {...layout}
        name="Plan Item Edit"
        form={form}
        initialValues={{ 
            unitIds:unitIds.map(id =>  units.findOne(id) ? [units.findOne(id).categoryId(), units.findOne(id).subcategoryId, id] :  subcategories.findOne(id) && [subcategories.findOne(id).categoryId, id] )[0], 
            dueDate:moment(dueDate, dateFormat), 
            assignedToIds, 
            item, 
            dimension, 
            ownerId 
      }}
        onFinish={onFinish}
        // onFinishFailed={onFinishFailed}
      >
        <Form.Item
          label="Map Location"
          name="unitIds"
          rules={[{ required: true, message: 'Please add a Map Location!' }]}
        >
	  <Cascader
	      showSearch={{	filter: (input, option) => option.map(o =>o.label).filter( o => o.toLowerCase().indexOf(input.toLowerCase()) >= 0 ).length }}
	      style={{ width: '100%' }}
	      placeholder="Select Map Location"
	      displayRender={label => label.join(' > ')}
	      changeOnSelect={false}
	      expandTrigger="hover"
	      options={mapOptions()}
	      disabled={disabled}
	      onChange={(values) => { }}
	  />
        </Form.Item>        
        <Form.Item
          label="Dimension"
          name="dimension"
          rules={[{ required: true, message: 'Please input Dimension!' }]}
        >
          <Select disabled={disabled}>
            { dimensions.map((item, index)=><Option key={index+item} value={item}>{item}</Option>) }
          </Select>   
        </Form.Item>  
        <Form.Item
          label="Owner"
          name="ownerId"
          rules={[{ required: true, message: 'Please input Owner!' }]}
        >
          <Select disabled={disabled}>
            { users.map((user, index)=><Option key={"owner"+user.id} value={user.id}>{user.name}</Option>) }
          </Select>   
        </Form.Item>  
        <Form.Item
          label="Assigned To"
          name="assignedToIds"
          rules={[{ required: true, message: 'Please input AssignedTo!' }]}
        >
          <Select
            mode="tags"
            disabled={disabled}
            // placeholder="Please select"
            // onChange={handleChange}
            style={{ width: '30%' }}
            // listHeight={30}
          >
            {/* {children} */}
            { users.map((user, index)=><Option key={"assigned"+user.id} value={user.id}>{user.name}</Option>) }
          </Select>   
        </Form.Item>  
 
        <Form.Item
          label="Due Date"
          name="dueDate"
          rules= {[
            {
              type: 'object',
              required: false,
              message: 'Please input publishDate',
              whitespace: true,
            },
          ]}
        >
          <DatePicker disabled={disabled}  format={dateFormat} />
        </Form.Item>     
        <Form.Item
          label=""
          name={["item", "text"]}
        >
          <ReactQuill/>
        </Form.Item>      
        <Form.Item style={{display:disabled?"none":"block"}}>
          <Button type="primary" htmlType="submit"  style={{backgroundColor: '#2176BB' }}>
            Save Plan Item
          </Button>
          <Button type="cancel" style={{marginLeft: 50}} onClick={ id ? disableEditMode : finishAddItem }>
            Cancel
          </Button>        
        </Form.Item>        
      </Form>      
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
