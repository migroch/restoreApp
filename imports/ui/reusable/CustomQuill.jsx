import React from 'react'
import ReactQuill from 'react-quill/dist/react-quill.min.js';

function insertStar() {
  const cursorPosition = this.quill.getSelection().index;
  this.quill.insertText(cursorPosition, "★");
  this.quill.setSelection(cursorPosition + 1);
}


class Editor extends React.Component {
  constructor(props) {
    super(props);
    this.state = { 
      text: this.props.defaultValue,
      isEnterKey: false
     };
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(value, e) {
    this.props.onChange(value);
    this.setState({ text: value });
  }
  
  onKeyDown = e => {
    console.log('crap');
    /* if (e.key === 'Enter' && !e.shiftKey) {   
       this.props.submit();
       } */
  }
  
  render() {

    const CustomToolbar = () => (
      <div id={"toolbar-"+ this.props.id} >
	<select className="ql-header" defaultValue={false} onChange={e => e.persist()}>
	  <option value="1" />
	  <option value="2" />
	  <option value="3" />

	</select>
	<button className="ql-bold" />
	<button className="ql-italic" />
	<button className="ql-underline" />
	<button className="ql-link" />
	<button type="button" className="ql-list" value="ordered"/>
	<button type="button" className="ql-list" value="bullet"/>
	<button type="button" className="ql-clean"/>
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
    
    return (
      <div className="text-editor">
        <ReactQuill
          onChange={this.handleChange}
          placeholder={this.props.placeholder}
          //modules={this.modules()}
          formats={Editor.formats}
          defaultValue={this.props.defaultValue}
	  value={this.state.text}  
          theme={"snow"} // pass false to use minimal theme
          //onKeyDown={this.onKeyDown}
        >
      </ReactQuill>  
      {/*       <CustomToolbar /> */}
      </div>
    );
  }

  modules(){
    let modules = {
      toolbar: {
	container: "#toolbar-" + this.props.id,
	handlers: {
	  insertStar: insertStar
	}
      },
      clipboard: {
	matchVisual: false,
      }
    }

    return modules;
  }
  
}


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


