import React from 'react';
import Tree from 'react-tree-graph';
import 'react-tree-graph/dist/style.css'

const LogisticMap = ({data, isLeft}) => {
  return (
  <Tree
    data={data}
    height={900}
    width={600}
    svgProps={{
      className: isLeft?'custom_left':'custom_right',
      // transform: 'rotate(-180)'
      transform: isLeft?'translate(500, 0) scale(-1, 1)':'scale(1, 1)',
      x: isLeft?0:600
    }}
    textProps={{className:"eeee", y: "-10"}}
    />
  )
}
export default LogisticMap