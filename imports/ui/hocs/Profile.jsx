import React, {useState} from 'react';
import { Meteor } from 'meteor/meteor';
import { Form, Input, Tag, Avatar, Button, Tooltip  } from 'antd/dist/antd.min.js';
//import { UserOutlined, PlusOutlined } from '@ant-design/icons';
import { withTracker } from 'meteor/react-meteor-data';
import classNames from 'classnames';
const CommonField = ({fieldName, value}) => (
  <div className="mt-15">
    <h6>{fieldName}: {value}</h6>
  </div>
)

const ColorField = ({color}) => {
  return (
    <div className="mt-15">
      Color: <Avatar  size="small" style={{ verticalAlign: 'middle', backgroundColor: color}} />
    </div>
  )
}

const ProfileImage = ({src}) => {
  return (
    <div className="mt-5 mb-5" style={{marginTop: 50, marginBottom: 50}}>
      <Avatar className="d-block m-auto mt-15 mb-" size={100}/>
    </div>
  )
}

class SchoolInput extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      value: this.props.value,
      inputVisible: false,
      inputValue: '',
      editInputIndex: -1,
      editInputValue: '',
    };
  }

  handleClose = removedTag => {
    const value = this.state.value.filter(tag => tag !== removedTag);
    this.setState({ value }, ()=>this.props.onChange(this.state.value));
  };

  showInput = () => {
    this.setState({ inputVisible: true }, () => this.input.focus());
  };

  handleInputChange = e => {
    this.setState({ inputValue: e.target.value });
  };

  handleInputConfirm = () => {
    const { inputValue } = this.state;
    let { value } = this.state;
    if (inputValue && value.indexOf(inputValue) === -1) {
      value = [...value, inputValue];
    }
    
    this.setState({
      value,
      inputVisible: false,
      inputValue: '',
    }, ()=>this.props.onChange(this.state.value));
  };

  handleEditInputChange = e => {
    this.setState({ editInputValue: e.target.value });
  };

  handleEditInputConfirm = () => {
    this.setState(({ value, editInputIndex, editInputValue }) => {
      const newvalue = [...value];
      newvalue[editInputIndex] = editInputValue;

      return {
        value: newvalue,
        editInputIndex: -1,
        editInputValue: '',
      };
    }, ()=>this.props.onChange(this.state.value));
  };

  saveInputRef = input => {
    this.input = input;
  };

  saveEditInputRef = input => {
    this.editInput = input;
  };

  render() {
    const { value, inputVisible, inputValue, editInputIndex, editInputValue } = this.state;
    return (
      <>
        {value.map((tag, index) => {
          if (editInputIndex === index) {
            return (
              <Input
                ref={this.saveEditInputRef}
                key={tag}
                size="small"
                className="tag-input"
                value={editInputValue}
                onChange={this.handleEditInputChange}
                onBlur={this.handleEditInputConfirm}
                onPressEnter={this.handleEditInputConfirm}
              />
            );
          }

          const isLongTag = tag.length > 20;

          const tagElem = (
            <Tag
              className="edit-tag"
              key={tag}
              closable
              onClose={() => this.handleClose(tag)}
            >
              <span
                onDoubleClick={e => {
                    this.setState({ editInputIndex: index, editInputValue: tag }, () => {
                      this.editInput.focus();
                    });
                    e.preventDefault();
                }}
              >
                {isLongTag ? `${tag.slice(0, 20)}...` : tag}
              </span>
            </Tag>
          );
          return isLongTag ? (
            <Tooltip title={tag} key={tag}>
              {tagElem}
            </Tooltip>
          ) : (
            tagElem
          );
        })}
        {inputVisible && (
          <Input
            ref={this.saveInputRef}
            type="text"
            size="small"
            className="tag-input"
            value={inputValue}
            onChange={this.handleInputChange}
            onBlur={this.handleInputConfirm}
            onPressEnter={this.handleInputConfirm}
          />
        )}
        {!inputVisible && (
          <Tag className="site-tag-plus" onClick={this.showInput}>
            {/* <PlusOutlined /> */}
             + Add
          </Tag>
        )}
      </>
    );
  }
}

ProfileView = ({user})=> {
  if (!user) return null
  console.log("user: ", user)
  const [editMode, setEditMode] = useState(false)
  const onFinish = value => {
    //save updated user profile
    const { name , district, schools} = value
    value.schools = schools.map(school=>({name: school, type: null}))
    value.id = user._id
    Meteor.call('profile.update', value, (err, res) => {
      if (err) {
        alert(err);
      } else {
        //history.push('/plan-viewer')
        setEditMode(false)
      }
    })
  };
  const { profile:{name}, district } = user
  const schools = user.schools.map(school=>school.name)
  return (
    <div className="m-auto mt-50" style={{width: 300}}>
      <div className={classNames("container", {"d-block:": !editMode, "d-none": editMode})}>
      <ProfileImage src=""/>
      <CommonField fieldName="Email" value={user.email} />
      <CommonField fieldName="Name" value={user.profile.name} />
      <CommonField fieldName="Nick Name" value={user.profile.initials} />
      <ColorField color={user.color}/>
      <CommonField fieldName="County" value={user.county} />
      <CommonField fieldName="District" value={user.district} />
      <div className="d-flex">
        <h6>Schools:</h6>
          <div>
           {user.schools.map(school=><div>{school.name}</div>)}
          </div>
      </div>
      <Button onClick={()=>setEditMode(true)}>Edit</Button>
      </div>
      <div className={classNames("container", {"d-block:": editMode, "d-none": !editMode})}>
      <Form 
        layout='vertical'
        name="Profile Edit"
        initialValues={{ name, district, schools }}
        onFinish={onFinish}
      >
        <Form.Item
          label="Name"
          name="name"
          rules={[{ required: true, message: 'Please input name!' }]}
        >
          <Input style={{width: 300}}/>
        </Form.Item>
        <Form.Item
          label="District"
          name="district"
          rules={[{ required: true, message: 'Please input district!' }]}
        >
          <Input style={{width: 300}}/>
        </Form.Item>
        <Form.Item
          label="Schools"
          name="schools"
          rules={[{ required: true, message: 'Please add school!' }]}
        >
          <SchoolInput />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit">
            Save
          </Button>
        </Form.Item>        
      </Form>
      </div>
    </div>
  )
}

export default withTracker(() => {

  return {
    isAuthenticated: Meteor.userId() !== null,
    user: Meteor.user()
  };
})(ProfileView);


// "emails" : [
//   {
//       "address" : "vlad.yakymenko1@gmail.com", 
//       "verified" : true
//   }
// ], 
// "color" : "#8ff420", 
// "profile" : {
//   "name" : "vlad", 
//   "initials" : "v"
// }, 
// "email" : "vlad.yakymenko1@gmail.com", 
// "verified_email" : true, 
// "county" : "Santa Cruz County", 
// "district" : "Unknown", 
// "schools" : [
//   {
//       "name" : " ", 
//       "type" : null
//   }
// ]