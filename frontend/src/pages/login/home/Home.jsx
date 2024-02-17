import React from "react";
import "./home.scss";
import { ChartBox, TopBox } from "../../../components";
import Button from "@mui/material/Button";
import SendIcon from "@mui/icons-material/Send";
import "@fortawesome/fontawesome-free/css/all.css";
import MUIDataTable from "mui-datatables";

function Home() {
  return (
    <div className="home">
      <div className="box box1">
        <ChartBox icon="cart.svg" title="New Orders" value="50" />
      </div>
      <div className="box box2">
        <ChartBox icon="progress.svg" title="In Progress" value="45" />
      </div>
      <div className="box box3">
        <ChartBox icon="completed.svg" title="Pending to Accept" value="88" />
      </div>
      <div className="box box4">
        <ChartBox icon="completed.svg" title="Completed" value="45" />
      </div>
      <div className="box box5">
        <ChartBox icon="rejected.svg" title="Rejected" value="45" />
      </div>
      <div className="box box6">
        <TopBox />
      </div>
      <div className="box box7">
        <ChartBox icon="order.svg" title="Orders Request" value="33" />
      </div>
      <div className="box box8">
        <ChartBox icon="due.svg" title="Overdue" value="50" />
      </div>

      <div className="box box9">
        <ChartBox icon="reminder.svg" title="Delivery Reminders" value="5" />
      </div>
      <div className="box box10">
        <ChartBox icon="delivery.svg" title="Today’s Delivery" value="150" />
      </div>
      <div className="box box11">
        {" "}
        <ChartBox icon="note.svg" title="To Deliver" value="50" />
      </div>
      {/* <div className="box box10">
        <ChartBox icon="order.svg" title="Orders Request" value="33" />
      </div>
      <div className="box box10">
        <ChartBox icon="order.svg" title="Orders Request" value="33" />
      </div> */}

      <div className="box box12">
        <MUIDataTable />
      </div>
    </div>
  );
}

export default Home;
