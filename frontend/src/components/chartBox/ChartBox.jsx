import React from "react";
import { Link } from "react-router-dom";
import "./chartBox.scss";

function ChartBox(props) {
  return (
    <div className="chartBox">
      <div className="boxInfo">
        <div className="boxHeader">
          <img src={props.icon} alt="" />
          <span>{props.title}</span>
        </div>
        <h1>{props.value}</h1>
        <Link>View all -</Link>
      </div>
    </div>
  );
}

export default ChartBox;
