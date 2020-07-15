import React from 'react';
import { Meteor } from 'meteor/meteor';
import { Cascader, Tag, Tooltip } from 'antd/dist/antd.min.js';
import { categories, subcategories, units } from '../../api/collections';
import  Schemas from '../../api/schemas';
const Dimensions = Schemas.dimensions;
const dimColors = ["magenta","volcano","orange","blue","geekblue","purple"];
const catColors = {'Health & Safety / Operations':'#FF9263', 'Instructional Programs':'#00a6a3',  'Student Support & Family Engagement':'#2AAAE1'}

class MultiMaplocationInput extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      value: this.props.value,
      options: this.props.options,
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

  handleInputChange = value => {
    this.setState({ inputValue: value });
  };

  handleInputConfirm = inputValue => {
    if (!inputValue.length) {
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
    }, ()=>this.props.onChange(this.state.value));
  };

  handleEditInputChange = value => {
    this.setState({ editInputValue: value });
  };

  handleEditInputConfirm = (editInputValue) => {
    if (!editInputValue.length) {
      this.setState({
        editInputIndex: -1,
        editInputValue: '',
      })
      return
    }    
    this.setState(({ value, editInputIndex }) => {
      
      // const lastValues = value.map(item=>item.pop())
      // if (inputValue && lastValues.indexOf(inputValue.pop()) === -1) {
      //   value = [...value, inputValue];
      // }

      const newvalue = [...value];
      const removedValue = newvalue[editInputIndex]
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
    const { value, inputVisible, inputValue, editInputIndex, editInputValue, options } = this.state;
    return (
      <>
        {value.map((tag, index) => {
          if (editInputIndex === index) {
            return (
              <Cascader
                ref={this.saveEditInputRef}
                key={tag}
                value={editInputValue}
                showSearch={{	filter: (input, option) => option.map(o =>o.label).filter( o => o.toLowerCase().indexOf(input.toLowerCase()) >= 0 ).length }}
                style={{ width: '100%' }}
                placeholder="Map Location"
                displayRender={label => label.join(' > ')}
                changeOnSelect={false}
                expandTrigger="hover"
                options={options}
                onChange={this.handleEditInputConfirm}
              />                         
            );
          }

          
          const maplocation = !(categories.findOne(tag[0]).name && subcategories.findOne(tag[1]).name) ? null:
                              tag[2]&&(categories.findOne(tag[0]).name && subcategories.findOne(tag[1]).name && units.findOne(tag[2]).name) ? 
                              `${categories.findOne(tag[0]).name} > ${subcategories.findOne(tag[1]).name} > ${units.findOne(tag[2]).name}` :
                              `${categories.findOne(tag[0]).name} > ${subcategories.findOne(tag[1]).name}`
          const isLongTag = maplocation.length > 30;
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
                {isLongTag ? `${maplocation.slice(0, 60)}...` : maplocation}
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
          <Cascader
            ref={this.saveInputRef}
            value={inputValue}
            showSearch={{	filter: (input, option) => option.map(o =>o.label).filter( o => o.toLowerCase().indexOf(input.toLowerCase()) >= 0 ).length }}
            style={{ width: '100%' }}
            placeholder="Map Location"
            displayRender={label => label.join(' > ')}
            changeOnSelect={false}
            expandTrigger="hover"
            options={options}
            onChange={this.handleInputConfirm}
            onPopupVisibleChange={value => {if (!value) { this.setState({inputVisible:false})}}}
          />                        
        )}
        {!inputVisible && (
          <Tag className="site-tag-plus w-100" onClick={this.showInput} style={{display: "block"}}>
             + Add
          </Tag>
        )}
      </>
    );
  }
}

export default MultiMaplocationInput