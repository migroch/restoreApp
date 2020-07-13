import React from 'react'
import { useHistory } from "react-router-dom";
import { Form, Input, Button, Select } from 'antd/dist/antd.min.js';
import { Meteor } from 'meteor/meteor';
import  Schemas from '../../api/schemas';
import { planitems, categories, subcategories, units } from '../../api/collections';

const layout = {
   labelCol: { span: 8 },
   wrapperCol: { span: 16 },
};
const tailLayout = {
  wrapperCol: { offset: 8, span: 16 },
};

const scenarios = Schemas.scenarios;

const PlanEditComponent = ({id, data, onCreatedPlan, changemode, planItemOrders}) => {
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
    {
      Meteor.call('plans.update', { id, title, scenario, planItemIds:planItemOrders }, (err, res) => {
        if (err) {
          alert(err);
        } else {
          // history.push('/plan-viewer')
          changemode();
        }
      })
    }
  };
  
  const [form] = Form.useForm();
  form.setFieldsValue({
    title,
    scenario
  });
  
  return (
    <>
    <div className="container text-center my-2">
      <h3 className="d-inline">{title} </h3>
      <p className="d-inline"> edit </p>
    </div>
    <div className="container d-flex">
      <Form className=""
	  //{...layout}
	  layout='vertical'
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

	<Form.Item >
          <Button type="primary" htmlType="submit" style={{backgroundColor: '#2176BB' }} >
            Done Editing
          </Button>
	</Form.Item>
      </Form>
    </div>
    </>
  );
};

export default PlanEditComponent
