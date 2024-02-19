import axios from "axios";
import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { API_URL } from "../../utlity/appConstants";
// const api = "http://www.gramboodev.com:25060/";
function ApprovalWaiting() {
  const location = useLocation();
  const navigate = useNavigate();

  const userId = location.state?.userId;
  console.log(location);
  const handleOnrefresh = () => {
    axios.post(API_URL + `items/createItem`).then((response) => {
      console.log(response.data.userStatus);
      if (response.data.userStatus === 1) {
        alert("pleas contact admin");
      } else if (response.data.userStatus === 2) {
        navigate("/");
      }
    });
  };

  return (
    <div>
      <h2>Approval Waiting</h2>
      {userId && <p>User ID: {userId}</p>}
      <button onClick={handleOnrefresh}>refresh</button>
    </div>
  );
}

export default ApprovalWaiting;
