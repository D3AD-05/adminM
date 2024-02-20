import React from "react";

function OrderDetailsView() {
  return (
    <div className="orderView">
      <div className="header">
        <h3>Order Details</h3>
        <div className="orderContainer">
          <div className="orderMaster">
            <table className="orderMaterDetails"></table>
          </div>
          <div className="itemsContainer"></div>
        </div>
      </div>
    </div>
  );
}

export default OrderDetailsView;
