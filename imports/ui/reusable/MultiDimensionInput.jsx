import React from 'react';
import { Select, Tag, Tooltip } from 'antd/dist/antd.min.js';
import  Schemas from '../../api/schemas';
const Dimensions = Schemas.dimensions;
const dimColors = ["magenta","volcano","orange","blue","geekblue","purple"];


class MultiDimensionInput extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      value: this.props.value,
      inputVisible: false,
      inputValue: '',
      editInputIndex: -1,
      editInputValue: '',
      dimensions: Dimensions.filter(item=>this.props.value.indexOf(item) < 0)
    };
  }

  handleClose = removedTag => {
    const value = this.state.value.filter(tag => tag !== removedTag);
    this.setState({ value, dimensions: [...this.state.dimensions, removedTag] }, ()=>this.props.onChange(this.state.value));
  };

  showInput = () => {
    this.setState({ inputVisible: true }, () => this.input.focus());
  };

  handleInputChange = value => {
    this.setState({ inputValue: value });
  };

  handleInputConfirm = inputValue => {
    if (typeof inputValue === 'object') {
      this.setState({
        inputVisible: false,
        inputValue: '',
      })
      return
    }

    let { value } = this.state;
    if (inputValue && value.indexOf(inputValue) === -1) {
      value = [...value, inputValue];
    }

    this.setState({
      value,
      inputVisible: false,
      inputValue: '',
      dimensions: [...this.state.dimensions].filter(item=>item != inputValue)
    }, ()=>this.props.onChange(this.state.value));
  };

  handleEditInputChange = value => {
    this.setState({ editInputValue: value });
  };

  handleEditInputConfirm = (editInputValue) => {
    if (typeof editInputValue === 'object') {
      this.setState({
        editInputIndex: -1,
        editInputValue: '',
      })
      return
    }
    this.setState(({ value, editInputIndex, dimensions }) => {
      const newvalue = [...value];
      const removedValue = newvalue[editInputIndex]
      newvalue[editInputIndex] = editInputValue;
      return {
        value: newvalue,
        editInputIndex: -1,
        editInputValue: '',
        dimensions: [...dimensions].filter(item=>item != editInputValue).concat(removedValue)
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
    const { value, inputVisible, inputValue, editInputIndex, editInputValue, dimensions } = this.state;
    return (
      <>
        {value.map((tag, index) => {
          if (editInputIndex === index) {
            return (
              <Select
                placeholder="Dimension" 
                ref={this.saveEditInputRef}
                key={tag}
                value={editInputValue}
                onChange={this.handleEditInputConfirm}
                onBlur={this.handleEditInputConfirm}
              >
                <Option key={editInputValue} value={editInputValue}>{editInputValue}</Option>
                { dimensions.map((d, index)=><Option key={index+d} value={d}>{d}</Option>) }
              </Select>               
            );
          }

          const isLongTag = tag.length > 40;
          const tagElem = (
            <Tag
              color={ dimColors[Dimensions.findIndex(D => D==tag)]}
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
                {isLongTag ? `${tag.slice(0, 40)}...` : tag}
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
          <Select
            ref={this.saveInputRef}
            value={inputValue}
            onChange={this.handleInputConfirm}
            onBlur={this.handleInputConfirm}
          >
            { dimensions.map((d, index)=><Option key={index+d} value={d}>{d}</Option>) }
          </Select>           
        )}
        {!inputVisible && (
          <Tag className="site-tag-plus w-100" onClick={this.showInput} style={{display: "block"}}>
            {/* <PlusOutlined /> */}
             + Add
          </Tag>
        )}
      </>
    );
  }
}

export default MultiDimensionInput