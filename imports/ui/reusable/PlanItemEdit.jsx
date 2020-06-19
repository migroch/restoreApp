import React from 'react';
import { Meteor } from 'meteor/meteor';
import moment from 'moment';
import { Select, DatePicker, TreeSelect, Form, Button } from 'antd/dist/antd.min.js';
import { withTracker } from 'meteor/react-meteor-data';
import  Schemas from '../../api/schemas';
import { planitems, categories, subcategories, units } from '../../api/collections';
import ReactQuill from 'react-quill/dist/react-quill.min.js';
import 'react-quill/dist/quill.snow.css';

const { Option } = Select;
const { TreeNode } = TreeSelect;
const dateFormat = 'YYYY/MM/DD';
const dimensions = Schemas.dimensions;


const makecategorylists = (categories) => {
  return (
    categories.map((category, idx)=>(
      <TreeNode title={category.name} value={category.id} selectable={false} key={'category'+idx+category.name}>
        {
          category.subcategories.map((subcategory, idx)=>(
            <TreeNode title={subcategory.name} value={subcategory.id}  selectable={false} key={'subcategory'+idx+subcategory.name}>
              {
                subcategory.units.map((unit, idx)=>(
                  <TreeNode value={unit.id} title={unit.name} key={'unit'+idx+unit.name}/>
                ))
              }
            </TreeNode>
          ))
        }
      </TreeNode>
    ))    
  )
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

PlanItem = ({id, data, disabled, isLoading, disableEditMode, finishAddItem, planId, users, catergoryData}) => {
  if (isLoading) return null

  const { subcategories, item, dimension, assignedToIds, dueDate, unitIds, ownerId } = (id) ? data : empty_data

  const onFinish = planItem => {
    planItem.dueDate = planItem.dueDate.format(dateFormat)
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
  return (
    <div className="plan-item-edit">
      <Form
        // {...layout}
        name="Plan Item Edit"
        initialValues={{ unitIds, dueDate:moment(dueDate, dateFormat), assignedToIds, item, dimension, ownerId }}
        onFinish={onFinish}
        // onFinishFailed={onFinishFailed}
      >
        <Form.Item
          label="Units"
          name="unitIds"
          rules={[{ required: true, message: 'Please add unit!' }]}
        >
          <TreeSelect
            showSearch
            style={{ width: '100%' }}
            // defaultValue={['unit-21', 'unit-11']}
            dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
            placeholder="Please select unit"
            allowClear
            multiple
            disabled={disabled}
          >
            {makecategorylists(catergoryData)}
          </TreeSelect>
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
          <Button type="primary" htmlType="submit">
            Save
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

  const catergoryData = categories.find({}).fetch()
                                  .map(category=>{
                                    category.subcategories = subcategories.find({categoryId:category._id}).fetch()
                                          .map(sub=>{
                                                sub.units = units.find({subcategoryId:sub._id}).fetch()
                                                            .map(unit=>({id:unit._id, name:unit.name}))
                                                return {
                                                  id: sub._id,
                                                  name:sub.name,
                                                  units:sub.units
                                                }
                                          })
                                    return {
                                      id: category._id,
                                      name:category.name,
                                      subcategories: category.subcategories
                                    }
                                  })                    
  const users = Meteor.users.find({}).fetch()
                    .map(user => ({id: user._id, name: user.profile.name}));

  let data
  if (id) {
    data = planitems.findOne(id)
  }
  return {
    data,
    users,
    catergoryData,
    isLoading: false
  };
})(PlanItem);