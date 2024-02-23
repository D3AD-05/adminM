import axios from "axios";
import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { API_URL } from "../../utlity/appConstants";
import "./ApprovalWaiting.scss";
import toast, { Toaster } from "react-hot-toast";

function ApprovalWaiting() {
  const location = useLocation();
  const navigate = useNavigate();

  const userId = location.state?.userId;

  const handleOnrefresh = () => {
    axios.get(API_URL + `users/checkForApproval/${userId}`).then((response) => {
      console.log(response.data.userStatus);
      if (response.data.userStatus === 1) {
        toast.error("Please contact admin");
      } else if (response.data.userStatus === 2) {
        navigate("/");
      }
    });
  };

  return (
    <div className="approval-waiting">
      <Toaster position="top-center" reverseOrder={true} />
      <img src="approvalW.png" alt="Warning" className="warning-logo" />
      <h2> Waiting for Approval</h2>
      <div className="header-bar">We are evaluating your profile</div>
      {/* {userId && <p>User ID: {userId}</p>} */}
      <br />
      <p>
        We are checking your profile and verification may take time to ensure
        your identity
      </p>
      <button onClick={handleOnrefresh}>Refresh</button>
    </div>
  );
}

export default ApprovalWaiting;
