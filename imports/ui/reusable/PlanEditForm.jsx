import React from 'react'
import { useHistory } from "react-router-dom";
import { Form, Input, Button, Select } from 'antd/dist/antd.min.js';
import { Meteor } from 'meteor/meteor';
import  Schemas from '../../api/schemas';
import { planitems, categories, subcategories, units } from '../../api/collections';

const layout = {
  // labelCol: { span: 2 },
  // wrapperCol: { span: 8 },
};
const savelayout = {
 wrapperCol: { offset: 20},
};

const scenarios = Schemas.scenarios;

const PlanEditComponent = ({id, data, onCreatedPlan}) => {
  
  const history = useHistory()
  let { title, scenario, planItemIds } = data
  const onFinish = plan => {
    const { title, scenario } = plan
      
    if (!id) //in case of adding new plan
      Meteor.call('plans.add', { title, scenario, planItemIds:[] }, (err, res) => {
        if (err) {
          alert(err);
        } else {
          
          onCreatedPlan(res)
          form.setFieldsValue({
            title,
            scenario
          });
       }
      })
    else // in case of updating the plan
      Meteor.call('plans.update', { id, title, scenario, planItemIds }, (err, res) => {
        if (err) {
          alert(err);
        } else {
          // history.push('/plan-viewer')
        }
      })
  };
  const [form] = Form.useForm();
  form.setFieldsValue({
    title,
    scenario
  });
  return (
    <Form
      {...layout}
      // layout='inline'
      form={form}
      name="Plan Edit"
      initialValues={{ title, scenario }}
      onFinish={onFinish}
    >
      <Form.Item
        label="Title"
        name="title"
        rules={[{ required: true, message: 'Please input title!' }]}
      >
        <Input style={{width: 300}}/>
      </Form.Item>

      <Form.Item
        label="Scenario"
        name="scenario"
        rules={[{ required: true, message: 'Please input scenario!' }]}
      >
        <Select
          // placeholder={scenario || "Scenario"}
          // defaultValue={"High Restrictions"}
          // value={"High Restrictions"}
          style={{width: 200}}
        >
          {
            scenarios.map((item, index)=>(
              <Option key={index} value={item}>{item}</Option>
            ))
          }
        </Select>
      </Form.Item>

      <Form.Item {...savelayout}>
        <Button type="primary" htmlType="submit" style={{backgroundColor: '#2176BB' }}>
          Save
        </Button>
      </Form.Item>
    </Form>
  );
};

export default PlanEditComponent
