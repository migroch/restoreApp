import React from 'react';
import { Input } from 'antd/dist/antd.min.js';
const { Search } = Input;
export default SearchWrapper = ({onSearchWithSearchbar}) => {
  return (
    <>
      <Search
        placeholder="Search"
        onSearch={onSearchWithSearchbar}
        style={{ width: '100%' }}
      />  
    </>
  )
}
