import React, { useState } from "react";
import "./navbar.scss";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { Box, Button, Menu, MenuItem, Modal, Stack } from "@mui/material";

function NavBar() {
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const userData = useSelector((state) => state.user.userData);

  const handleOnNotification = () => {
    navigate("/notifications");
  };

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  return (
    <div className="navbar">
      <div className="logo">
        <img src="manjaliLogo.svg" alt="" />
        <span>Manjali Admin</span>
      </div>
      <div className="icons">
        <img src="/search.svg" alt="" className="icon" />
        <img src="/app.svg" alt="" className="icon" />
        <img src="/expand.svg" alt="" className="icon" />
        <div className="notification">
          <img src="/notifications.svg" alt="" onClick={handleOnNotification} />
          <span>1</span>
        </div>
        <div className="user">
          <img
            src="https://cdn.vectorstock.com/i/1000x1000/30/97/flat-business-man-user-profile-avatar-icon-vector-4333097.webp"
            alt=""
            onClick={handleClick}
          />
          <span>{userData ? userData.userName : "user"}</span>
        </div>
        <img src="/settings.svg" alt="" className="icon" />
      </div>
      <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          "aria-labelledby": "basic-button",
        }}
      >
        <MenuItem onClick={handleClose}>Profile</MenuItem>
        <MenuItem onClick={handleClose}>My account</MenuItem>
        <MenuItem onClick={handleClose}>Logout</MenuItem>
      </Menu>
    </div>
  );
}

export default NavBar;
