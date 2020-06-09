import React from 'react';
import { Meteor } from 'meteor/meteor';
import moment from 'moment';
import { Select, DatePicker, TreeSelect } from 'antd/dist/antd.min.js';
import { withTracker } from 'meteor/react-meteor-data';
import  Schemas from '../../api/schemas';
import { planitems, categories, subcategories, units } from '../../api/collections';
// import ShowMoreText from 'react-show-more-text'
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
PlanItemView = ({data, disabled, isLoading}) => {
  if (isLoading) return null
  const { subcategories, item, dimension, assignedToIds, dueDate, unitIds, ownerId } = data

  return (
    <div className="plan-item-view">
      <div className="label_1">
        Units:
        <TreeSelect
          showSearch
          style={{ width: '20%' }}
          defaultValue={['unit-21', 'unit-11']}
          dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
          placeholder="Please select"
          allowClear
          multiple
          disabled={disabled}
          // treeDefaultExpandAll
          // onChange={this.onChange}
        >
          {/* <TreeNode value="Category_1" title="parent 1" selectable={false}>
            <TreeNode value="Subcategory_2" title="parent 1-0" >
              <TreeNode value="leaf1" title="my leaf" />
              <TreeNode value="leaf2" title="your leaf" />
            </TreeNode>
            <TreeNode value="parent 1-1" title="parent 1-1" selectable={false}>
              <TreeNode value="sss" title={<b style={{ color: '#08c' }}>sss</b>} />
            </TreeNode>
          </TreeNode> */}
          {
            sample_categories.map((category, idx)=>(
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
          }
        </TreeSelect>
      </div>  
      <div>Dimension: 
        <Select defaultValue={dimension} style={{ width: 180 }} disabled={disabled} onChange={handleChange}>
          { dimensions.map((item, index)=><Option key={index+item} value={item}>{item}</Option>) }
        </Select>        
      </div>
      <div>Owner: 
        <Select defaultValue={"owner"} style={{ width: 180 }} disabled={disabled} onChange={handleChange}>
          { owners.map((item, index)=><Option key={index+item.name} value={item.name}>{item.name}</Option>) }
        </Select>        
      </div>
      <div>Assigned To: 
        <Select
          mode="tags"
          disabled={disabled}
          defaultValue={assignedToIds}
          // placeholder="Please select"
          // onChange={handleChange}
          style={{ width: '30%' }}
          listHeight={30}
        >
          {/* {children} */}
        </Select>      
      </div>      
      <div>
        Due Date: 
        <DatePicker defaultValue={moment(dueDate, dateFormat)} disabled={disabled}  format={dateFormat} />
      </div>     
      <div style={{border: "1px solid", padding:10, marginTop: 10}}>
        <div dangerouslySetInnerHTML={{__html: item.text}} />
        {/* <ShowMoreText
            lines={1}
            more='more'
            less='less'
            anchorClass=''
            expanded={false}
        >
          <div dangerouslySetInnerHTML={{__html: item.text}} />
         </ShowMoreText>         */}
      </div>
    </div>
  )
}
export default withTracker(({id}) => {
  const handles = [
    Meteor.subscribe('planitems'),
    Meteor.subscribe('categories'),
    Meteor.subscribe('subcategories'),
    Meteor.subscribe('units'),
    Meteor.subscribe('allUserData'),
  ];
  const isLoading = handles.some(handle => !handle.ready());
  if(isLoading){
    return {
      data: null,
      isLoading: true
    };
  }
  let data = planitems.findOne(id)

  // let users = Meteor.users.find({}).fetch().map(user=>user.profile.name)
  // console.log("users:::::", users)
  return {
    data,
    isLoading: false
  };
})(PlanItemView);