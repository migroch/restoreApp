import React from 'react'
import ReactQuill from 'react-quill/dist/react-quill.min.js';

function insertStar() {
  const cursorPosition = this.quill.getSelection().index;
  this.quill.insertText(cursorPosition, "★");
  this.quill.setSelection(cursorPosition + 1);
}

const CustomToolbar = () => (
  <div id="toolbar">
    <select className="ql-header" defaultValue={""} onChange={e => e.persist()}>
      <option value="1" />
      <option value="2" />
      <option value="3" />
      <option selected />
    </select>
    <button className="ql-bold" />
    <button className="ql-italic" />
    <button className="ql-underline" />
    <button className="ql-link" />
    <button type="button" class="ql-list" value="ordered"/>
    <button type="button" class="ql-list" value="bullet"/>
    <button type="button" class="ql-clean"/>
    <select className="ql-color">
      <option value="red" />
      <option value="green" />
      <option value="blue" />
      <option value="orange" />
      <option value="violet" />
      <option value="#d0d1d2" />
      <option selected />
    </select>
    <div>
     
    </div>
  </div>
);

class Editor extends React.Component {
  constructor(props) {
    super(props);
    this.state = { 
      value: this.props.value,
      isEnterKey: false
     };
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(value, e) {
    this.props.onChange(value);
  }
  onKeyDown = e => {
    if (e.key === 'Enter' && !e.shiftKey) {   
      this.props.submit();
    }
  }
  render() {
    return (
      <div className="text-editor my-1">
        <ReactQuill
          onChange={this.handleChange}
          placeholder={this.props.placeholder}
          modules={Editor.modules}
          formats={Editor.formats}
          value={this.props.value}
          theme={"snow"} // pass false to use minimal theme
          onKeyDown={this.onKeyDown}
        >
      </ReactQuill>  
      <CustomToolbar />
      </div>
    );
  }
}

Editor.modules = {
  toolbar: {
    container: "#toolbar",
    handlers: {
      insertStar: insertStar
    }
  },
  keyboard: {
    bindings: {
      handleEnter: {
        key: 13,
        handler: function (range, context) {
          // do nothing
        }
      },
      handleShiftEnter: {
        key: 13,
        shiftKey: true,
        handler: function (range, context) {
          this.quill.insertText(range.index, '\n');
        }
      },
    }
  },
  clipboard: {
    matchVisual: false,
  }
};

Editor.formats = [
  "header",
  "font",
  "size",
  "bold",
  "italic",
  "underline",
  "strike",
  "blockquote",
  "list",
  "bullet",
  "indent",
  "link",
  "image",
  "color"
];

export default Editor


