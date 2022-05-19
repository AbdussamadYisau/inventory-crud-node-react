// client/src/App.js

import React from "react";
import "./App.css";
import { toast, ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

function App() {
  const [mainInventoryData, setMainInventoryData] = React.useState(null);
  const [deleteInventoryData, setDeleteInventoryData] = React.useState(null);
  const [deleted, setDeleted] = React.useState("");
  const [restore, setRestore] = React.useState("");
  const [loading, setLoading] = React.useState(false);

  
  

  const getInventory = async () => {
    try {
      const response = await fetch("http://localhost:3001/v1/api/inventory", {
        mode: "cors",
      });
      const json = await response.json();
      setMainInventoryData(json?.data);
      console.log(json);
    } catch (err) {
      console.error(err.message);
    }
  };

  const getDeletedInventory = async () => {
    try {
      const response = await fetch(
        "http://localhost:3001/v1/api/deletedInventory",
        { mode: "cors" }
      );
      const json = await response.json();
      setDeleteInventoryData(json?.data);
    } catch (err) {
      console.error(err.message);
    }
  };
  React.useEffect(() => {
    getInventory();
    getDeletedInventory();
  }, []);

  React.useEffect(() => {
    getInventory();
    getDeletedInventory();
  }, [deleted, restore, loading]);

  const handleDelete = async (id) => {
    try {
      setLoading(true);
      const response = await fetch(
        `http://localhost:3001/v1/api/addToDeletedInventory/${id}`,
        {
          method: "PUT",
          body: JSON.stringify({
            category: "Deleted",
          }),
          headers: {
            "Content-Type": "application/json",
          },
        },
        {
          mode: "cors",
        }
      );
      const data = await response.json();
      toast.success(data.message, {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        // transition: "slide",
      });

      setDeleted(data.message);

      setLoading(false);
    } catch (err) {
      console.error(err.message);
    }
  };

  const handleRestore = async (id) => {
    try {
      setLoading(true);
      const response = await fetch(
        `http://localhost:3001/v1/api/restore/${id}`,
        {
          method: "PUT",
        },
        {
          mode: "cors",
        }
      );
      const data = await response.json();
      toast.success(data.message, {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        // transition: "slide",
      });
      setRestore(data.message);
      setLoading(false);
    } catch (err) {
      console.error(err.message);
    }
  };

  return (
    <div className="App">
      <ToastContainer />;
      <div className="Column">
        <h1>Main Inventory</h1>
        <div>
          {!mainInventoryData ? (
            "Loading..."
          ) : (
            <>
              {mainInventoryData.length === 0 ? (
                <p>No Inventory items</p>
              ) : (
                <>
                  {mainInventoryData?.map((item, index) => (
                    <div
                      key={item._id}
                      style={{
                        border: "2px solid red",
                        borderRadius: "25px",
                        padding: "10px",
                        marginTop: "10px",
                        display: "flex",
                        width: "300px",
                      }}
                    >
                      <div className="Column">
                        <p> Name: {item.name}</p>
                        <p> Description : {item.description}</p>
                        <p> Price : {item.price}</p>
                        <p> Quantity: {item.quantity}</p>
                      </div>

                      <div className="Column">
                        <button
                          onClick={() => console.log("Hi")}
                          style={{ marginRight: "10px" }}
                        >
                          Edit
                        </button>
                        <button onClick={() => handleDelete(item._id)}>
                          Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </>
              )}
            </>
          )}
        </div>
      </div>

      <div className="Column">
        <h2>Deleted Inventory</h2>

        <div>
          {!deleteInventoryData ? (
            "Loading..."
          ) : (
            <>
              {deleteInventoryData.length === 0 ? (
                <p>No deleted items</p>
              ) : (
                <>
                  {deleteInventoryData?.map((item, index) => (
                    <div
                      key={item._id}
                      style={{
                        border: "2px solid red",
                        borderRadius: "25px",
                        padding: "10px",
                        marginTop: "10px",
                        display: "flex",
                        width: "300px",
                      }}
                    >
                      <div className="Column">
                        <p> Name: {item.name}</p>
                        <p> Description : {item.description}</p>
                        <p> Price : {item.price}</p>
                        <p> Quantity: {item.quantity}</p>
                        <p>Delete Comments: {item.deleteComment}</p>
                      </div>

                      <div>
                        <button onClick={() => handleRestore(item._id)}>
                          Undo
                        </button>
                      </div>
                    </div>
                  ))}
                </>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
