import React, { useState, useEffect } from "react";
import MUIDataTable from "mui-datatables";

const Datatable = (props) => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [sortOrder, setSortOrder] = useState({});
  const [searchText, setSearchText] = useState("");
  const [dataLoad, setDataLoad] = useState(false);

  useEffect(() => {
    if (dataLoad) {
      props.handleFilter(page, rowsPerPage, searchText, sortOrder);
      setDataLoad(false);
    }
  }, [dataLoad]);

  const options = {
    pagination: true,
    rowsPerPage: rowsPerPage,
    rowsPerPageOptions: [10, 25, 50, props.totalCount],
    sortOrder: sortOrder,
    onTableChange: (action, tableState) => {
      switch (action) {
        case "changePage":
          setPage(tableState.page);
          setDataLoad(true);
          break;
        case "search":
          setPage(0);
          setSearchText(
            tableState.searchText ? tableState.searchText.trim() : ""
          );
          setDataLoad(true);
          break;
        case "sort":
          setPage(0);
          let sortDetails = tableState.sortOrder;
          sortDetails["index"] = tableState.activeColumn;
          setSortOrder(sortDetails);
          setDataLoad(true);
          break;
        case "changeRowsPerPage":
          setPage(0);
          setRowsPerPage(tableState.rowsPerPage);
          setDataLoad(true);
          break;
        default:
          break;
      }
    },
  };

  return (
    <>
      <div className="muiDataTableCustom">
        <MUIDataTable
          title={props.title}
          data={props.data}
          columns={props.columns}
          options={options}
          className="table table-bordered"
        />
      </div>
    </>
  );
};

export default Datatable;
