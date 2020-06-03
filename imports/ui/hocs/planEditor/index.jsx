import React, { useState } from 'react';
import { Meteor } from 'meteor/meteor';
import SelectWrapper from '../../reusable/SelectWrapper';
import { withTracker } from 'meteor/react-meteor-data';
import { planitems, plans } from '../../../api/collections';
import PlanItem from '../../reusable/PlanItem';
import { Input, Select, Button } from 'antd';
import { DownloadOutlined } from '@ant-design/icons';
import './index.scss';

const { Option } = Select;

const scenarios = [
  "High Restrictions",
  "Medium Restrictions",
  "Low Restrictions"
]

const PlanEdit = () => {
  return(
    <>
      edit page
    </>
  )
}



export default PlanEdit
