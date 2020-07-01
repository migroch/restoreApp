import React from 'react'
import ReactQuill from 'react-quill/dist/react-quill.min.js';
const CustomButton = () => <span className="octicon octicon-star" />;

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
      <option selected />
    </select>
    <button className="ql-bold" />
    <button className="ql-italic" />
    <select className="ql-color">
      <option value="red" />
      <option value="green" />
      <option value="blue" />
      <option value="orange" />
      <option value="violet" />
      <option value="#d0d1d2" />
      <option selected />
    </select>
    <button className="ql-insertStar">
      <CustomButton />
    </button>
    <div>
     
    </div>
  </div>
);

class Editor extends React.Component {
  constructor(props) {
    super(props);
    this.state = { value: this.props.value };
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(value) {
    this.props.onChange(value);
  }
  onKeyUp = e => {
    if (e.key === 'Enter' && e.shiftKey) {   
      // console.log("Shit Enter Shit Enter")
    } else if (e.key === 'Enter' && !e.shiftKey) {   
      e.stopPropagation();
      e.preventDefault() 
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
          // onKeyUp={this.onKeyUp}
          onKeyDown={this.onKeyUp}
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


