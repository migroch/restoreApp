import React from 'react'
import { useHistory } from "react-router-dom";
import { Form, Input, Button, Select } from 'antd';
import { Meteor } from 'meteor/meteor';

const layout = {
  labelCol: { span: 2 },
  wrapperCol: { span: 12 },
};
const tailLayout = {
  wrapperCol: { offset: 2, span: 12 },
};

const scenarios = ['High Restrictions', 'Medium Restrictions', 'Low Restrictions'];

const PlanEditComponent = ({id, data}) => {
  const history = useHistory()
  const { title, scenario, planItemIds } = data
  const onFinish = plan => {
    const { title, scenario } = plan
      
    if (!id) //in case of adding new plan
      Meteor.call('plans.add', { title, scenario, planItemIds }, (err, res) => {
        if (err) {
          alert(err);
        } else {
          history.push('/plan-viewer')
        }
      })
    else // in case of updating the plan
      Meteor.call('plans.update', { id, title, scenario, planItemIds }, (err, res) => {
        if (err) {
          alert(err);
        } else {
          history.push('/plan-viewer')
        }
      })
  };
  const onFinishFailed = errorInfo => {
    console.log('Failed:', errorInfo);
  };
  return (
    <Form
      {...layout}
      name="Plan Edit"
      initialValues={{ title, scenario }}
      onFinish={onFinish}
      onFinishFailed={onFinishFailed}
    >
      <Form.Item
        label="Title"
        name="title"
        rules={[{ required: true, message: 'Please input title!' }]}
      >
        <Input placeholder={title || "Title"} defaultValue={title}/>
      </Form.Item>

      <Form.Item
        label="Scenario"
        name="scenario"
        rules={[{ required: true, message: 'Please input scenario!' }]}
      >
        <Select
          placeholder={scenario || "Scenario"}
          defaultValue={scenario}
          // onChange={onChangeScenario}
        >
          {
            scenarios.map(item=>(
              <Option value={item}>{item}</Option>
            ))
          }
        </Select>
      </Form.Item>

      <Form.Item {...tailLayout}>
        <Button type="primary" htmlType="submit">
          Save
        </Button>
        <Button type="cancel" style={{marginLeft: 50}} onClick={()=>history.push('/plan-viewer')}>
          Cancel
        </Button>        
      </Form.Item>
    </Form>
  );
};

export default PlanEditComponent