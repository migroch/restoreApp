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

PlanItemView = ({data, disabled, isLoading, users, catergoryData}) => {
  if (isLoading) return null
  const { subcategories, item, dimension, assignedToIds, dueDate, unitIds, ownerId } = data

  return (
    <div className="plan-item-view">
      <div className="label_1">
        Units:
        <TreeSelect
          showSearch
          style={{ width: '100%' }}
          defaultValue={unitIds}
          dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
          placeholder="Please select"
          allowClear
          multiple
          disabled={disabled}
          // treeDefaultExpandAll
          // onChange={this.onChange}
        >
          {makecategorylists(catergoryData)}
        </TreeSelect>
      </div>  
      <div>Dimension: 
        <Select defaultValue={dimension} style={{ width: 180 }} disabled={disabled}>
          { dimensions.map((item, index)=><Option key={index+item} value={item}>{item}</Option>) }
        </Select>        
      </div>
      <div>Owner: 
        <Select defaultValue={ownerId} style={{ width: 180 }} disabled={disabled} >
          { users.map((user, index)=><Option key={"owner"+user.id} value={user.id}>{user.name}</Option>) }
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
          { users.map((user, index)=><Option key={"assigned"+user.id} value={user.id}>{user.name}</Option>) }
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
    // Meteor.subscribe('allUserData'),
  ];
  const isLoading = handles.some(handle => !handle.ready());
  if(isLoading){
    return {
      data: null,
      isLoading: true
    };
  }
  const data = planitems.findOne(id)
  const catergoryData = categories.find({}).fetch().
                    map(category=>{
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
                    .map(user => ({id: user._id, name: user.profile.name}))
  return {
    data,
    users,
    catergoryData,
    isLoading: false
  };
})(PlanItemView);