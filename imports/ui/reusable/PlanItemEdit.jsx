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

function handleChange(value) {
  console.log(`selected ${value}`);
}
handleChangeItem = (value) => {
  console.log("item text: ", value)
}
const dimensions = Schemas.dimensions;

const owners = [
  {
    name: 'owner_1',
  },
  {
    name: 'owner_2',
  },
  {
    name: 'owner_3',
  },
]

const sample_categories = [
  {
    name: "category-1",
    subcategories: [
      {
        name: "subcategory-1",
        units: [
          {
            name: "unit-11"
          },
          {
            name: "unit-13"
          },
          {
            name: "unit-15"
          },
        ]
      },
      {
        name: "subcategory-2",
        units: [
          {
            name: "unit-21"
          },
          {
            name: "unit-25"
          },
        ]
      },
      {
        name: "subcategory-3",
        units: [
          {
            name: "unit-31"
          },
          {
            name: "unit-33"
          },
          {
            name: "unit-35"
          },
        ]
      },
    ]
  },
  {
    name: "category-2",
    subcategories: [
      {
        name: "subcategory-22",
        units: [
          {
            name: "unit-82"
          },
          {
            name: "unit-84"
          },
          {
            name: "unit-85"
          },
        ]
      },
      {
        name: "subcategory-23",
        units: [
          {
            name: "unit--91"
          },
          {
            name: "unit-95"
          },
        ]
      },
      {
        name: "subcategory-4",
        units: [
          {
            name: "unit-51"
          },
          {
            name: "unit-53"
          },
          {
            name: "unit-5"
          },
        ]
      },
    ]
  },
]

const makecategorlists = (categories) => {
  return (
    categories.map((category, idx)=>(
      <TreeNode title={category.name} value={category.name} selectable={false} key={'category'+idx+category.name}>
        {
          category.subcategories.map((subcategory, idx)=>(
            <TreeNode title={subcategory.name} value={subcategory.name}  selectable={false} key={'subcategory'+idx+subcategory.name}>
              {
                subcategory.units.map((unit, idx)=>(
                  <TreeNode value={unit.name} title={unit.name} key={'unit'+idx+unit.name}/>
                ))
              }
            </TreeNode>
          ))
        }
      </TreeNode>
    ))    
  )
}

PlanItem = ({id, data, disabled, isLoading, disableEditMode}) => {
  if (isLoading) return null
  const { subcategories, item, dimension, assignedToIds, dueDate, unitIds, ownerId } = data
  const onFinish = planItem => {
    console.log("PlanItem: ", planItem)
    planItem.dueDate = planItem.dueDate.format(dateFormat)
    console.log("Updated-PlanItem: ", planItem)
    Meteor.call('planItem.update', {planItemId:id, planItem}, (err, res) => {
      if (err) {
       alert(err);
      } else {
        // history.push('/plan-viewer')
        disableEditMode();
      }
    })
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
            style={{ width: '20%' }}
            // defaultValue={['unit-21', 'unit-11']}
            dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
            placeholder="Please select unit"
            allowClear
            multiple
            disabled={disabled}
          >
            {makecategorlists(sample_categories)}
          </TreeSelect>
        </Form.Item>        
        <Form.Item
          label="Dimension"
          name="dimension"
          rules={[{ required: true, message: 'Please input Dimension!' }]}
        >
          <Select disabled={disabled} onChange={handleChange}>
            { dimensions.map((item, index)=><Option key={index+item} value={item}>{item}</Option>) }
          </Select>   
        </Form.Item>  
        <Form.Item
          label="Owner"
          name="ownerId"
          rules={[{ required: true, message: 'Please input Dimension!' }]}
        >
          <Select disabled={disabled} onChange={handleChange}>
            { owners.map((item, index)=><Option key={index+item.name} value={item.name}>{item.name}</Option>) }
          </Select>   
        </Form.Item>  
        <Form.Item
          label="Assigned To"
          name="assignedToIds"
          // rules={[{ required: true, message: 'Please input Dimension!' }]}
        >
          <Select
            mode="tags"
            disabled={disabled}
            // placeholder="Please select"
            // onChange={handleChange}
            style={{ width: '30%' }}
            listHeight={30}
          >
            {/* {children} */}
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
          : 
          <DatePicker disabled={disabled}  format={dateFormat} />
        </Form.Item>     
        <Form.Item
          label=""
          name={["item", "text"]}
        >
          <ReactQuill onChange={handleChangeItem} />
        </Form.Item>      
        <Form.Item style={{display:disabled?"none":"block"}}>
          <Button type="primary" htmlType="submit">
            Save
          </Button>
          <Button type="cancel" style={{marginLeft: 50}} onClick={disableEditMode}>
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
  ];
  const isLoading = handles.some(handle => !handle.ready());
  if(isLoading){
    return {
      data: null,
      isLoading: true
    };
  }
  let data = planitems.findOne(id)
  return {
    data,
    isLoading: false
  };
})(PlanItem);


// "_id" : "K5X3yPvTbZbPcF2om", 
// "item" : {
//     "text" : "dummy1 plan item"
// }, 
// "assignedToIds" : [
//     "NNDBCzLdEG3cb9nTP"
// ], 
// "dimension" : "Professional Development", 
// "dueDate" : ISODate("2020-06-04T16:08:37.268+0000"), 
// "ownerId" : "ReuhYSY42CB52487P", 
// "unitIds" : [
//     "4zYjujorqFD2QJ7yk"
// ]