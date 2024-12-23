import React from "react";
import { Quill } from "react-quill";
function Toolbar() {
  // Register icon toolbar
  const icons = Quill.import("ui/icons");
  icons["link"] = '<i class="fa fa-link" style="color: blue;"></i>';
  icons["image"] = '<i class="fa fa-image" style="color: red;"></i>';
  icons["video"] = '<i class="fa fa-play" style="color: green;"></i>';
  icons["emoji"] = '<i class="fa fa-play" style="color: green;"></i>';

  return (
    <>
      <div id="toolbar">
        <span className="ql-formats">
          <button className="ql-emoji"></button>
        </span>

        <span className="ql-formats">
          <select className="ql-size">
            <option value="small">Nhỏ</option>
            <option selected>Thường</option>
            <option value="large">To</option>
            <option value="huge">Khổng lồ</option>
          </select>
        </span>

        <span className="ql-formats">
          <button className="ql-bold"></button>
          <button className="ql-italic"></button>
          <button className="ql-underline"></button>
          <button className="ql-strike"></button>
        </span>

        <span className="ql-formats">
          <button className="ql-list" value="ordered"></button>
          <button className="ql-list" value="bullet"></button>
          <button className="ql-list" value="check"></button>
        </span>

        <span className="ql-formats">
          <button className="ql-link"></button>
          <button className="ql-image"></button>
          <button className="ql-video"></button>
        </span>
      </div>
    </>
  );
}

export default Toolbar;
