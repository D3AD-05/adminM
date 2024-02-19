import React, { useState } from "react";
import { z } from "zod";
import "./signin.css";
import { PhoneAuth } from "../../components";
import "@fortawesome/fontawesome-free/css/all.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../utlity/authProvider";

const SignIn = () => {
  // const api = "http://www.gramboodev.com:25060/";
  const api = "http://localhost:25060/";

  const navigate = useNavigate();
  const [isSignUpMode, setIsSignUpMode] = useState(false);
  const [verifiedData, setVerifiedData] = useState({});
  const [selectedUser, setSelectedUser] = useState(3);
  const [enable, setEnable] = useState(false);
  const [formData, setFormData] = useState({
    userName: "",
    userEmail: "",
    userType: 3,
    userPhoneNo: "",
    userImage: "",
    userStatus: 1,
  });
  const [formErrors, setFormErrors] = useState({});

  const signUpSchema = z.object({
    userName: z
      .string()
      .min(1, { message: "Username is required" }) // Minimum length of 1 ensures nonemptiness
      .min(3, { message: "Username must be at least 3 characters long" }),
    userEmail: z
      .string()
      .email({ message: "Invalid email address" })
      .min(2, { message: "Email is required" }), // Minimum length of 1 ensures nonemptiness
  });

  const handleSignUpClick = () => {
    setIsSignUpMode(true);
  };

  const handleSignInClick = () => {
    setIsSignUpMode(false);
  };

  const dataFromChild = (data) => {
    setVerifiedData(data);
    if (data.from === "sign_in") {
      setIsSignUpMode(true);
      setEnable(true);

      formData["userPhoneNo"] = data.phoneNumber;
    } else if (data.from === "sign_up") {
      formData["userPhoneNo"] = data.phoneNumber;
      setEnable(true);
    }
  };

  const handleOnChange = (event) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });

    if (name === "userType") {
      setFormData((prevFormData) => ({
        ...prevFormData,
        userType: parseInt(value),
      }));
      setSelectedUser(parseInt(value));
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
    const validationResult = signUpSchema.safeParse(formData);

    if (validationResult.success) {
      axios
        .post(api + "users/createUser", formData)
        .then((res) => {
          if (res.status === 200) {
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
  const handleOnLogin = () => {
    if (verifiedData) {
      navigate("/");
    }
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

            {/* PhoneAuth component */}
            {!isSignUpMode && (
              <PhoneAuth
                sendDataToParent={dataFromChild}
                isSignUpMode={isSignUpMode}
              />
            )}

            {/* Submit button */}
            <input
              type="submit"
              value="Login"
              className={!verifiedData ? "btn solid btn2" : "btn solid"}
              onClick={handleOnLogin}
            />
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
              <i className="fas fa-user"></i>
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

            {/* Phone input field */}
            {verifiedData && verifiedData.from ? (
              <div className="input-field">
                <i className="fas fa-phone"></i>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  placeholder="Enter 10 digit Mobile Number"
                  value={verifiedData.phoneNumber}
                  pattern="[0-9]{3}-[0-9]{2}-[0-9]{3}"
                  disabled
                />
              </div>
            ) : (
              <PhoneAuth
                sendDataToParent={dataFromChild}
                isSignUpMode={isSignUpMode}
              />
            )}

            {/* Submit button */}
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
