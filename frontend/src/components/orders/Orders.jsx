import MUIDataTable, {
  TableBody,
  TableHead,
  TableToolbar,
} from "mui-datatables";
import React, { useEffect, useState } from "react";
import axios from "axios";
import Button from "@mui/material/Button";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Chip from "@mui/material/Chip";
import DoneIcon from "@mui/icons-material/Done";
import BlockIcon from "@mui/icons-material/Block";
import CloseIcon from "@mui/icons-material/Close";
import { API_URL } from "../../utlity/appConstants";
import Datatable from "../datatable/datatable";
import { Collapse, TableCell, TextField, Tooltip } from "@mui/material";
import Done from "@mui/icons-material/Done";
import Close from "@mui/icons-material/Close";
import VisibilityIcon from "@mui/icons-material/Visibility";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import { Typography } from "@mui/material";
import "./orders.scss";
import Slider from "react-slick";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import { TableContainer } from "@mui/material";
import { TableRow } from "@mui/material";
import { Table } from "@mui/material";
import Paper from "@material-ui/core/Paper";
/*-----------========================-------------------------*/

function Orders() {
  /* --------------- states --------------------------------- */

  const [orderDetails, setOrderDetails] = useState();
  const [popup, setPopup] = useState(false);
  const [toggle, setToggle] = useState(false);
  const [warrning, setWarnning] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState();
  const [orderList, setOrderList] = useState([]);
  const [dataLoad, setDataLoad] = useState(false);
  const [imgPopup, setImgPopup] = useState(false);
  const [img, setImg] = useState(false);
  /*-------------------- const --------------------------------*/
  const columns = [
    {
      name: "slNo",
      label: "SL . No",
      options: {
        filter: false,
        sort: false,
      },
    },

    {
      name: "orderId",
      label: "Order Number",
      align: "center",
      options: {
        align: "center",
        filter: true,
        sort: true,
      },
    },
    {
      name: "customerName",
      label: "customer Name",
      options: {
        filter: true,
        sort: true,
      },
    },
    {
      name: "orderDate",
      label: "order Date",
      options: {
        filter: true,
        sort: true,
      },
    },

    {
      name: "deliveryDate",
      label: "Delivery Date",
      options: {
        filter: true,
        sort: true,
      },
    },
    {
      name: "contactPhoneNo",
      label: "Phone Number",
      options: {
        filter: true,
        sort: true,
      },
    },
    {
      name: "contactPerson",
      label: "contact Person",
      options: {
        filter: true,
        sort: true,
      },
    },

    {
      name: "totalItems",
      label: "total Items",
      options: {
        filter: true,
        sort: true,
      },
    },
    {
      name: "aproximateWt",
      label: "aproximate Wt",
      options: {
        filter: true,
        sort: true,
      },
    },
    {
      name: "orderStatus",
      label: "Status",
      options: {
        filter: true,
        sort: true,
        customBodyRender: (value) => {
          if (!value) {
            return null;
          }
          const statusMap = {
            1: { label: "Pending", color: "primary" },
            2: { label: "Approved", color: "success" },
            3: { label: "Rejected", color: "error" },
          };
          const status = statusMap[value];
          if (!status || !status.label) {
            return null;
          }
          return (
            <Chip
              label={status.label}
              color={status.color}
              variant="outlined"
            />
          );
        },
      },
    },
    {
      name: "customerimg",
      label: "Image",
      align: "center",
      options: {
        align: "center",
        filter: true,
        sort: true,
        customBodyRender: (value) => {
          return (
            <div className="user" onClick={() => togglePopup(value)}>
              <img
                src={
                  value
                    ? value
                    : "https://cdn.vectorstock.com/i/1000x1000/30/97/flat-business-man-user-profile-avatar-icon-vector-4333097.webp"
                }
              ></img>
            </div>
          );
        },
      },
    },
    {
      name: "orderNo",
      label: "ACTION",
      options: {
        filter: false,
        sort: false,
        customBodyRender: (value, tableMeta) => {
          const orderId = tableMeta.rowData[1];
          return (
            <Button
              variant="contained"
              // color={tableMeta.rowData[5] == 1 ? "success" : "error"}
              color="success"
              className="formButton"
              name="userStatus"
              onClick={(e) => changeStatus(orderId, tableMeta)}
            >
              Change Status
            </Button>
          );
        },
      },
    },
    {
      name: "orderId",
      label: " ",
      options: {
        filter: true,
        sort: false,
        customBodyRender: (id) => {
          return (
            <DeleteForeverIcon
              className="delete-btn formButtonCancel"
              onClick={() => handleOnDelete(id)}
            ></DeleteForeverIcon>
          );
        },
      },
    },
    {
      name: "orderId",
      label: " ",
      options: {
        filter: true,
        sort: false,
        customBodyRender: (id) => {
          return (
            <VisibilityIcon
              className="delete-btn formButtonCancel"
              onClick={() => handleOnView(id)}
            ></VisibilityIcon>
          );
        },
      },
    },
  ];
  function createData(name, calories, fat, carbs, protein) {
    return { name, calories, fat, carbs, protein };
  }
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
  };
  const rows = [
    createData("Frozen yoghurt", 159, 6.0, 24, 4.0),
    createData("Ice cream sandwich", 237, 9.0, 37, 4.3),
    createData("Eclair", 262, 16.0, 24, 6.0),
    createData("Cupcake", 305, 3.7, 67, 4.3),
    createData("Gingerbread", 356, 16.0, 49, 3.9),
  ];

  const options = {
    selectableRows: false,
    expandableRows: true,
    renderExpandableRow: (rowData, rowMeta) => {
      console.log(rowData, rowMeta);
      return (
        <>
          <TableRow>
            <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
              <Collapse
                in={true} // Set to true to expand by default
                timeout="auto"
                unmountOnExit
              >
                <Box margin={1}>
                  {/* Your custom content goes here */}
                  {/* Replace this with your ImageSlider component */}
                  <Typography variant="h6" gutterBottom component="div">
                    Image Slider
                  </Typography>
                  {/* Add your ImageSlider component here */}
                  {/* <ImageSlider images={rows.map((row) => row.image)} /> */}
                </Box>
              </Collapse>
            </TableCell>
          </TableRow>
        </>
      );
    },
  };

  const togglePopup = (value) => {
    setImgPopup(!imgPopup);
    setImg(value);
  };

  /*          ------------ useEffects -------------             */
  useEffect(() => {
    fetchData();
  }, [dataLoad]);

  //--------  functions -------------->
  //       > get all orders >
  const fetchData = () => {
    axios
      .get(API_URL + "orders/getAllOrders")
      .then((response) => {
        setOrderList(response.data);
        const updatedFormDataArray = response.data
          ? response.data.map((el, key) => ({
              slNo: key + 1,
              orderId: el.order_id,
              // orderStatus: el.status,
              salesman: el.salesman_id,
              customerName: el.customer_Id,
              totalItems: el.order_totalItems,
              orderDate: el.formatted_order_date,
              deliveryDate: el.order_deliveryDate,
              orderStatus: el.status,
              contactPerson: el.customer_contactPerson,
              aproximateWt: el.order_totalApxWt,
              customerimg: el.firebase_imgUrl,
              contactPhoneNo: el.customer_phoneNo,
            }))
          : [];
        setOrderDetails(updatedFormDataArray);
      })
      .catch((error) => console.error("Error fetching data:", error));
  };

  const changeStatus = (id, tableMeta) => {
    setPopup(true);
    setSelectedOrderId(id);
  };

  const handleClose = () => {
    setPopup(false);
    setWarnning(false);
  };
  const handleOnDelete = (id) => {
    setWarnning(true);
    setSelectedOrderId(id);
  };
  const handleOnView = (id) => {
    setToggle(true);
    setSelectedOrderId(id);
  };
  const handleAction = (e) => {
    const name = e.target.name;
    const formData = orderList.find((el) => el.order_id === selectedOrderId);

    if (name == "approve") {
      formData["status"] = 2;
    } else if (name == "reject") {
      formData["status"] = 3;
    } else if (name == "delete") {
      formData["status"] = 4;
    }

    // createdBy,
    // createdDate,
    // modifiedBy,
    // modifiedDate,
    // isSynced

    axios
      .put(API_URL + `orders/updateOrderMaster/${selectedOrderId}`, formData)
      .then((res) => {
        if (res) {
          setDataLoad(!dataLoad);
        }
        setPopup(false);
        setWarnning(false);
      })
      .catch((err) => alert(err));
  };

  const handleAproveOrder = () => {
    const formData = orderDetails.find((el) => el.orderId === selectedOrderId);
    // formData["orderStatus"] = 2;
    axios
      .put(`http://localhost:8081/approveOrder/${selectedOrderId}`, formData)
      .then((res) => {
        if (res) {
          setDataLoad(!dataLoad);
        }
        setPopup(false);
      })
      .catch((err) => alert(err));
  };

  /******************* UI *********************************** */
  return (
    <div className="orderContainer">
      <div className="dataTable">
        <button onClick={fetchData}>adhsfhuisd</button>

        <MUIDataTable
          title={"Order List"}
          columns={columns}
          data={orderDetails ? orderDetails : []}
          options={options}
        />
      </div>
      <Modal open={popup} onClose={handleClose}>
        <Box sx={style}>
          <div className="modalContainer">
            <h3>Do you want to confirm</h3>
            <br />
            <Stack direction="row" spacing={2}>
              <Button
                variant="contained"
                size="small"
                color="success"
                name="approve"
                onClick={(e) => handleAction(e)}
              >
                <DoneIcon />
                Approve
              </Button>
              <Button
                variant="contained"
                size="small"
                color="error"
                name="reject"
                onClick={(e) => handleAction(e)}
              >
                <BlockIcon />
                Reject
              </Button>

              <Button
                variant="contained"
                size="small"
                color="warning"
                onClick={handleClose}
              >
                <CloseIcon />
                Cancel
              </Button>
            </Stack>
          </div>
        </Box>
      </Modal>
      <Modal
        open={warrning}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <div className="modalContainer">
            <h3>Do you want to delete</h3>
            <br />
            <Stack direction="row" spacing={2}>
              <Button
                variant="contained"
                size="small"
                color="error"
                name="delete"
                onClick={(e) => handleAction(e)}
              >
                <BlockIcon />
                Delete
              </Button>

              <Button
                variant="contained"
                size="small"
                color="warning"
                onClick={handleClose}
              >
                <CloseIcon />
                Cancel
              </Button>
            </Stack>
          </div>
        </Box>
      </Modal>

      {imgPopup && (
        <div className="popup-container" onClick={() => togglePopup()}>
          <div className="popup-content">
            <TransformWrapper>
              <TransformComponent>
                <img
                  src={
                    img
                      ? img
                      : "https://cdn.vectorstock.com/i/1000x1000/30/97/flat-business-man-user-profile-avatar-icon-vector-4333097.webp"
                  }
                  alt="Popup Image"
                />
              </TransformComponent>
            </TransformWrapper>
          </div>
        </div>
      )}

      <Modal
        open={toggle}
        onClose={() => setToggle(false)}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style2}>
          <>
            {orderList
              .filter((el) => el.order_id === selectedOrderId)
              .map((order, index) => (
                <div key={index} className="order-card">
                  <table>
                    <thead>
                      <tr>
                        <th>Contact Person</th>
                        <th>Customer Name</th>
                        <th>Customer Address</th>
                        <th>Customer Phone</th>
                        <th>Order Date</th>
                        <th>Delivery Date</th>
                        <th>Total Items</th>
                        <th>Total Weight</th>
                        <th>Remarks</th>
                        <th>Select Person</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>{order.customer_contactPerson}</td>
                        <td>{order.customer_name}</td>
                        <td>{order.customer_address}</td>
                        <td>{order.customer_phoneNo}</td>
                        <td>{order.order_date}</td>
                        <td>{order.order_deliveryDate}</td>
                        <td>{order.order_totalItems}</td>
                        <td>{order.order_totalApxWt}</td>
                        <td>{order.order_remarks}</td>
                        <td>{order.order_selectPerson}</td>
                      </tr>
                    </tbody>
                  </table>
                  <img
                    src={order.firebase_imgUrl}
                    alt=""
                    className="order-image"
                  />
                </div>
              ))}
          </>

          {/* <Slider {...settings}>
            {selectedOrder.images.map((image, index) => (
              <div key={index}>
                <img src={image} alt={`Image ${index}`} />
              </div>
            ))}
          </Slider> */}
        </Box>
      </Modal>
    </div>
  );
}

/******************************************************************* */
const style = {
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  position: "fixed",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  height: "20%",
  width: 360,
  bgcolor: "background.paper",
  p: 4,
};
const style2 = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "80%",
  height: "90%",
  bgcolor: "background.paper",
  border: "none",
  boxShadow: 24,
  p: 4,
};
export default Orders;

// const paymentModeColumns = [
//   {
//     name: "#",
//     style: {
//       maxWidth: "20%",
//       textAlign: "left",
//     },
//   },
//   {
//     name: "freightType.formLabels.freightType",
//     style: {
//       minWidth: "40%",
//       textAlign: "left",
//     },
//     sort: true,
//   },
//   {
//     name: "freightType.formLabels.status",
//     style: {
//       textAlign: "left",
//     },
//     sort: true,
//     filter: ["Active", "Blocked"],
//   },
//   {
//     name: "freightType.gridLabels.Edit",
//     style: {
//       textAlign: "left",
//     },
//     sort: false,
//   },
// ];

// const renderTableData = () => {
//   let dataTableOBJ = [];
//   orderDetails &&
//     orderDetails.map((value, i) => {
//       dataTableOBJ.push([
//         i + 1,
//         value.customerName,
//         value.Status == 1 ? (
//           <Tooltip title="Active">
//             <Done color="success" />
//           </Tooltip>
//         ) : (
//           <Tooltip title="Blocked">
//             <Close color="error" />
//           </Tooltip>
//         ),
//         <Tooltip title="Edit">
//           {/* <Edit color="success" onClick={() => editTableRow(value)} /> */}
//         </Tooltip>,
//       ]);
//     });
//   return dataTableOBJ;
// };
