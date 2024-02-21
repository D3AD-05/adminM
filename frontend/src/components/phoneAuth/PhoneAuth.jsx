import React, { useState } from "react";
import { Button, TextField } from "@mui/material";
import { RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";
import { auth } from "../../firebase";
import { z } from "zod";
import "./phoneAuth.scss";
import axios from "axios";
import { Toaster, toast } from "react-hot-toast";
import { useDispatch } from "react-redux";
import { setUserDetails } from "../../redux/action/userAction";
import { API_URL } from "../../utlity/appConstants";

const PhoneAuth = (props) => {
  const dispatch = useDispatch();
  const { data, sendDataToParent, isSignUpMode } = props;
  const [phoneNumber, setPhoneNumber] = useState(data ? data : "");
  const [verificationCode, setVerificationCode] = useState("");
  const [confirmationResult, setConfirmationResult] = useState(null);
  const [otpError, setOtpError] = useState(false);
  const [isRecaptchaVerified, setIsRecaptchaVerified] = useState(false);
  const [phoneError, setPhoneError] = useState("");
  console.log(
    "%cisSignUpMode",
    "color: green; background: yellow; font-size: 10px",
    isSignUpMode
  );
  const phoneSchema = z
    .string()
    .nonempty({ message: "Phone number is required" })
    .length(10, { message: "Phone number must be 10 digits" });

  const handlePhoneChange = (e) => {
    setPhoneNumber(e.target.value);
    setPhoneError("");
  };

  const handleSendCode = async () => {
    console.log("handle confirm");
    try {
      const validationResult = phoneSchema.safeParse(phoneNumber);
      if (!validationResult.success) {
        setPhoneError(validationResult.error.errors[0].message);
        return;
      }

      const mobNumber = "+91" + phoneNumber.trim();
      const data = { phoneNumber: phoneNumber.trim() };
      var response = [];
      var verifiedData = null;

      // if (!isSignUpMode) {
      response = await axios.post(API_URL + "users/checkPhoneNumber", data);
      verifiedData = response.data;
      console.log(response.data);
      const userData = {
        userId: response.data[0]?.User_Id,
        userName: response.data[0]?.User_Name,
        userType: response.data[0]?.User_Type,
        userStatus: response.data[0]?.User_Status,
        userPhoneNo: response.data[0]?.User_PhoneNo,
      };
      dispatch(setUserDetails(userData));
      // verifiedData.length > 0
      //   ? ()
      //   : null;
      // console.log(verifiedData.length > 0, isSignUpMode);
      // }
      // if (verifiedData && verifiedData.length > 0) {

      const recaptcha = new RecaptchaVerifier(auth, "recaptcha", {});
      const confirmation = await signInWithPhoneNumber(
        auth,
        mobNumber,
        recaptcha
      );

      setConfirmationResult(confirmation);
      setIsRecaptchaVerified(true);
      document.cookie = "loggedIn=" + verifiedData[0]["User_Id"];
      toast.success("recaptcha succesfull!!");
      // } else {
      //   toast.error("invalid user phone number");
      // }
    } catch (error) {
      console.error("Error sending code:", error);
    }
  };

  const handleVerifyCode = async () => {
    try {
      const data = await confirmationResult.confirm(verificationCode);
      toast.promise(confirmationResult.confirm(verificationCode), {
        loading: "Verifying...",
        success: <b>Verified succesfully! click login in</b>,
        error: <b>Could not save.</b>,
      });
      if (data._tokenResponse["isNewUser"] === false) {
        goToSignUp("userCreated");
      } else if (data._tokenResponse["isNewUser"]) {
        goToSignUp("isNewUser");
      }
    } catch (error) {
      console.error("Error sending code:", error);
      setOtpError(true);
    }
  };

  const verifictionInputHandler = (e) => {
    setVerificationCode(e.target.value);
    setOtpError(false);
  };

  const goToSignUp = (name) => {
    if (name === "isNewUser") {
      sendDataToParent({ from: "sign_in", phoneNumber: phoneNumber });
    } else if (name === "userCreated") {
      sendDataToParent({
        from: "sign_up",
        phoneNumber: phoneNumber,
        msg: "Verification successfully, click sign in",
        status: "200",
      });
    }
  };

  return (
    <>
      <div className="input-field">
        <i className="fas fa-phone"></i>
        <input
          type="tel"
          id="phone"
          name="phone"
          placeholder="Enter 10 digit Mobile Number"
          value={phoneNumber}
          onChange={handlePhoneChange}
        />
      </div>
      {phoneError && <span style={{ color: "red" }}>{phoneError}</span>}
      {isRecaptchaVerified ? (
        ""
      ) : (
        <Button variant="text" onClick={handleSendCode}>
          Confirm
        </Button>
      )}
      {!isRecaptchaVerified ? <div id="recaptcha"></div> : ""}
      <TextField
        className="input-field"
        label="Verification Code"
        variant="standard"
        value={verificationCode}
        onChange={verifictionInputHandler}
      />{" "}
      {otpError ? <span style={{ color: "red" }}>Invalid OTP</span> : null}
      <Button variant="text" onClick={handleVerifyCode}>
        Verify Code
      </Button>
      <Toaster position="top-center" reverseOrder={true} />
    </>
  );
};

export default PhoneAuth;
