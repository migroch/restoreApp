import React from 'react';
import { Input } from 'antd/dist/antd.min.js';
const { Search } = Input;
export default SearchWrapper = ({onChangeSearchbar}) => {
  return (
    <>
      <Search
        placeholder="Search"
        onSearch={onChangeSearchbar}
        style={{ width: '100%' }}
      />  
    </>
  )
}
