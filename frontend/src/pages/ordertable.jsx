import React, { useState } from "react";
import ReactModal from "react-modal";
import Slider from "react-slick";

const OrderTable = () => {
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const data = [
    {
      orderNumber: "ORD001",
      orderDate: "2024-02-20",
      deliveryDate: "2024-02-25",
      customer: "John Doe",
      salesmen: "Jane Smith",
      status: "Pending",
      images: ["image1.jpg", "image2.jpg", "image3.jpg"],
    },
    {
      orderNumber: "ORD002",
      orderDate: "2024-02-21",
      deliveryDate: "2024-02-26",
      customer: "Alice Johnson",
      salesmen: "Bob Brown",
      status: "Completed",
      images: ["image4.jpg", "image5.jpg"],
    },
    // Add more sample orders as needed
  ];

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
  };

  const handleShowDetails = (order) => {
    setSelectedOrder(order);
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
    setSelectedOrder(null);
  };

  return (
    <div>
      <table>
        <thead>
          <tr>
            <th>Order Number</th>
            <th>Order Date</th>
            <th>Delivery Date</th>
            <th>Customer</th>
            <th>Salesmen</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {data.map((order) => (
            <tr key={order.orderNumber}>
              <td>{order.orderNumber}</td>
              <td>{order.orderDate}</td>
              <td>{order.deliveryDate}</td>
              <td>{order.customer}</td>
              <td>{order.salesmen}</td>
              <td>{order.status}</td>
              <td>
                <button onClick={() => handleShowDetails(order)}>
                  Show Details
                </button>
                <button>Change Status</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <ReactModal isOpen={modalIsOpen} onRequestClose={closeModal}>
        {selectedOrder && (
          <div>
            <h2>Order Details</h2>
            <p>Order Number: {selectedOrder.orderNumber}</p>
            <p>Order Date: {selectedOrder.orderDate}</p>
            <p>Delivery Date: {selectedOrder.deliveryDate}</p>
            <p>Customer: {selectedOrder.customer}</p>
            <p>Salesmen: {selectedOrder.salesmen}</p>
            <h3>Order Images</h3>
            <Slider {...settings}>
              {selectedOrder.images.map((image, index) => (
                <div key={index}>
                  <img src={image} alt={`Image ${index}`} />
                </div>
              ))}
            </Slider>
            <button onClick={closeModal}>Close</button>
          </div>
        )}
      </ReactModal>
    </div>
  );
};

export default OrderTable;
