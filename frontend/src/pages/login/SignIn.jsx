import React, { useState } from "react";
import { z } from "zod";
import "./signin.css";
import "@fortawesome/fontawesome-free/css/all.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { API_URL } from "../../utlity/appConstants";
import { Button, TextField } from "@mui/material";
import { Toaster, toast } from "react-hot-toast";
import { useDispatch } from "react-redux";
import { RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";
import { auth } from "../../firebase";

const SignIn = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isSignUpMode, setIsSignUpMode] = useState(false);
  const [verifiedData, setVerifiedData] = useState({});
  const [selectedUser, setSelectedUser] = useState(3);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [phoneNumber2, setPhoneNumber2] = useState("");
  const [enable, setEnable] = useState(false);
  const [isRecaptchaVerified, setIsRecaptchaVerified] = useState(false);
  const [verificationCode, setVerificationCode] = useState("");
  const [otpError, setOtpError] = useState(false);
  const [confirmationResult, setConfirmationResult] = useState(null);

  const [formData, setFormData] = useState({
    userName: "",
    userEmail: "",
    userType: 3,
    userPhoneNo: "",
    userImage: "",
    userStatus: 1,
  });
  const [formErrors, setFormErrors] = useState({});
  const [phoneError, setPhoneError] = useState("");
  const [phoneError2, setPhoneError2] = useState("");
  const [userExist, setUserExist] = useState(false);

  // ---------------------------------------------------------->
  const phoneSchema = z
    .string()
    .nonempty({ message: "Phone number is required" })
    .length(10, { message: "Phone number must be 10 digits" });

  const signUpSchema = z.object({
    userName: z
      .string()
      .min(1, { message: "Username is required" })
      .min(3, { message: "Username must be at least 3 characters long" }),
    userPhoneNo: z
      .string()
      .nonempty({ message: "Phone number is required" })
      .length(10, { message: "Phone number must be 10 digits" }),
    userEmail: z
      .string()
      .email({ message: "Invalid email address" })
      .min(2, { message: "Email is required" }),
  });

  const handleSignUpClick = () => {
    setIsSignUpMode(true);
  };

  const handleSignInClick = () => {
    setIsSignUpMode(false);
  };

  const handleOnChange = (event) => {
    const { name, value } = event.target;
    console.log(name);
    setFormData({ ...formData, [name]: value });

    if (name === "userType") {
      setFormData((prevFormData) => ({
        ...prevFormData,
        userType: parseInt(value),
      }));
      setSelectedUser(parseInt(value));
    } else if (name === "userPhoneNo") {
      setPhoneNumber(value);
      setPhoneError("");
    } else if (name === "phone2") {
      setPhoneNumber2(value);
      setPhoneError2("");
    }
  };

  const handleOnBlur = (fieldName) => {
    const validationResult = signUpSchema
      .pick(fieldName)
      .safeParse({ [fieldName]: formData[fieldName] });

    if (!validationResult.success) {
      setFormErrors((prevErrors) => ({
        ...prevErrors,
        [fieldName]: validationResult.error.errors[0].message,
      }));
    } else {
      setFormErrors((prevErrors) => ({
        ...prevErrors,
        [fieldName]: "",
      }));
    }
  };

  const handleOnSubmit = (e) => {
    e.preventDefault();
    console.log(formData);
    const validationResult = signUpSchema.safeParse(formData);
    console.log(!userExist);
    if (validationResult.success && userExist) {
      axios
        .post(API_URL + "users/createUser", formData)
        .then((res) => {
          console.log(res);
          if (res.data.insertId > 0) {
            const userId = res.data.insertId;
            document.cookie = "loggedIn=" + userId;

            navigate("/approvalWaiting", { state: { userId: userId } });
          }
        })
        .catch((err) => alert(err));
    } else {
      setFormErrors(
        validationResult.error.errors.reduce((acc, curr) => {
          return {
            ...acc,
            [curr.path[0]]: curr.message,
          };
        }, {})
      );
    }
  };

  const handleOnLogin = (e) => {
    e.preventDefault();
    const validationResult = phoneSchema.safeParse(phoneNumber2);
    if (!validationResult.success) {
      setPhoneError2(validationResult.error.errors[0].message);
      return;
    } else {
      setPhoneError2("");
    }

    if (validationResult.success) {
      const data = {
        phoneNumber: phoneNumber2,
        userType: selectedUser,
      };

      axios
        .post(API_URL + "users/checkPhoneNumber", data)
        .then((response) => {
          if (response.data.length > 0) {
            console.log(response.data, "------");
            const userId = response.data[0]?.User_Id;
            let extendTill = new Date();
            extendTill.setDate(extendTill.getDate() + 1);
            document.cookie = `loggedIn=${userId}; expires=${extendTill.toUTCString()}; path=/`;

            navigate("/");
            window.location.reload();
          } else {
            setPhoneError2("Invalid credential");
            // setTimeout(() => {
            //   setIsSignUpMode(true);
            // }, 1200);
          }
        })
        .catch((error) => {
          console.error("Error checking phone number:", error);
        });
    }
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
      var response = [];
      const data = { phoneNumber: phoneNumber };
      axios
        .get(API_URL + `users/isUserExist/${phoneNumber}`)
        .then((response) => {
          console.log(response.data.length);

          if (response.data.length > 0) {
            toast.error("phone number already used!!");
            setPhoneError("number already in use!!!");
            setUserExist(false);
            return;
          } else {
            console.log("aaaaaaaaa");
            setUserExist(true);
          }
        });
      console.log("userExist", userExist);
      // if (userExist) {
      const recaptcha = new RecaptchaVerifier(auth, "recaptcha", {
        size: "invisible",
      });
      const confirmation = await signInWithPhoneNumber(
        auth,
        mobNumber,
        recaptcha
      );

      setConfirmationResult(confirmation);
      setIsRecaptchaVerified(true);
      toast.success("recaptcha succesfull!!");
      // }
    } catch (error) {
      console.error("Error sending code:", error);
    }
  };

  const handleVerifyCode = async () => {
    try {
      const data = await confirmationResult.confirm(verificationCode);

      toast.success(<b>Verified successfully! Click login.</b>);
    } catch (error) {
      console.error("Error verifying code:", error);
      setOtpError(true);
    }
  };

  const verifictionInputHandler = (e) => {
    setVerificationCode(e.target.value);
    setOtpError(false);
  };

  return (
    <div className={`container ${isSignUpMode ? "sign-up-mode" : ""}`}>
      <div className="forms-container">
        <div className="signin-signup">
          <form
            action="#"
            className={`sign-in-form ${isSignUpMode ? "" : "active-form"}`}
          >
            {/* Input field for user type */}
            <div className="input-field">
              <i
                className={
                  selectedUser === "3"
                    ? "fas fa-user"
                    : selectedUser === "2"
                    ? "fas fa-hammer"
                    : "fa-solid fa-user-tie"
                }
              ></i>
              <select
                className="dropdown-field"
                id="userType"
                name="userType"
                value={selectedUser}
                onChange={handleOnChange}
              >
                <option value={3}>Customer</option>
                <option value={2}>Smith</option>
                <option value={1}>Admin</option>
              </select>
            </div>

            <div className="input-field">
              <i className="fas fa-phone"></i>
              <input
                type="tel"
                id="phone"
                name="phone2"
                placeholder="Enter 10 digit Mobile Number"
                value={phoneNumber2}
                onChange={handleOnChange}
              />
            </div>
            {phoneError2 && <span style={{ color: "red" }}>{phoneError2}</span>}
            {/* PhoneAuth component
            {!isSignUpMode && (
              <PhoneAuth
                sendDataToParent={dataFromChild}
                isSignUpMode={isSignUpMode}
              />
            )} */}

            {/* Submit button */}
            <button
              type="submit"
              value="Login"
              className={"btn solid"}
              onClick={(e) => handleOnLogin(e)}
            >
              Login
            </button>
          </form>

          {/* Sign up form */}
          <form
            action="#"
            className={`sign-up-form ${isSignUpMode ? "active-form" : ""}`}
            onSubmit={handleOnSubmit}
          >
            {/* Sign up form title */}
            <h2 className="title">Sign up</h2>
            {/* Error messages */}
            {verifiedData && verifiedData.from === "isNewUser" ? (
              <h3 style={{ color: "red" }}>
                You are not Registerd to us Please fill the fields{" "}
              </h3>
            ) : verifiedData && verifiedData.from === "sign_up" ? (
              <h3 style={{ color: "green" }}>{verifiedData.msg}</h3>
            ) : null}
            {/* {formErrors.userType && (
              <p className="error-message">{formErrors.userType}</p>
            )}
            {formErrors.phone && (
              <p className="error-message">{formErrors.phone}</p>
            )} */}
            {/* User name input field */}
            <div className="input-field">
              <i className="fas fa-user"></i>
              <input
                type="text"
                name="userName"
                placeholder="User Name"
                onChange={handleOnChange}
                onBlur={() => handleOnBlur("userName")}
              />
            </div>
            {formErrors.userName && (
              <p className="error-message">{formErrors.userName}</p>
            )}
            {/* User email input field */}
            <div className="input-field">
              <i className="fas fa-envelope"></i>
              <input
                type="text"
                name="userEmail"
                placeholder="Email"
                onChange={handleOnChange}
                onBlur={() => handleOnBlur("userEmail")}
              />
            </div>
            {formErrors.userEmail && (
              <span className="error-message">{formErrors.userEmail}</span>
            )}
            {/* User type select field */}
            <div className="input-field">
              <i
                className={
                  selectedUser === "3"
                    ? "fas fa-user"
                    : selectedUser === "2"
                    ? "fas fa-hammer"
                    : "fa-solid fa-user-tie"
                }
              ></i>
              <select
                className="dropdown-field"
                id="userType"
                name="userType"
                value={selectedUser}
                onChange={handleOnChange}
                onBlur={() => handleOnBlur("userType")}
              >
                <option value={3}>Customer</option>
                <option value={2}>Smith</option>
                <option value={1}>Admin</option>
              </select>
            </div>
            <div className="input-field">
              <i className="fas fa-phone"></i>
              <input
                type="tel"
                id="userPhoneNo"
                name="userPhoneNo"
                placeholder="Enter 10 digit Mobile Number"
                value={phoneNumber}
                onChange={handleOnChange}
              />
            </div>
            {formErrors.userPhoneNo && (
              <span className="error-message">{formErrors.userPhoneNo}</span>
            )}
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
            {otpError ? (
              <span style={{ color: "red" }}>Invalid OTP</span>
            ) : null}
            <Button variant="text" onClick={handleVerifyCode}>
              Verify Code
            </Button>
            <Toaster position="top-center" reverseOrder={true} />
            <input
              type="submit"
              className={enable ? "btn btn" : "btn btn2"}
              value="Sign up"
              onClick={(e) => handleOnSubmit(e)}
              // disabled={!enable}
            />
          </form>
        </div>
      </div>

      {/* Panels container */}
      <div className="panels-container">
        {/* Left panel */}
        <div className="panel left-panel">
          <div className="content">
            <h3>New to our community ?</h3>
            <p>
              Discover a world of possibilities! Join us and explore a vibrant
              community where ideas flourish and connections thrive.
            </p>
            <button className="btn transparent" onClick={handleSignUpClick}>
              Sign up
            </button>
          </div>
          <img
            src="https://i.ibb.co/6HXL6q1/Privacy-policy-rafiki.png"
            className="image"
            alt=""
          />
        </div>

        {/* Right panel */}
        <div className="panel right-panel">
          <div className="content">
            <h3>One of Our Valued Members</h3>
            <p>
              Thank you for being part of our community. Your presence enriches
              our shared experiences. Let's continue this journey together!
            </p>
            <button className="btn transparent" onClick={handleSignInClick}>
              Sign in
            </button>
          </div>
          <img
            src="https://i.ibb.co/nP8H853/Mobile-login-rafiki.png"
            className="image"
            alt=""
          />
        </div>
      </div>
    </div>
  );
};

export default SignIn;
