// client/src/App.js

import React from "react";
import "./App.css";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {Formik} from 'formik';

function App() {
  const [mainInventoryData, setMainInventoryData] = React.useState(null);
  const [deleteInventoryData, setDeleteInventoryData] = React.useState(null);
  const [deleted, setDeleted] = React.useState("");
  const [restore, setRestore] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [modalOpen, setIsOpen] = React.useState(false);
  const [editModalOpen, setEditModalOpen] = React.useState(false);
  const [editId, setEditId] = React.useState(null);
  const [editName, setEditName] = React.useState(null);
  const [editDescription, setEditDescription] = React.useState(null);
  const [editPrice, setEditPrice] = React.useState(null);
  const [editQuantity, setEditQuantity] = React.useState(null);
  const showModal = () => {
    setIsOpen(true);
  };

  const showEditModal = () => {
    setEditModalOpen(true);
  };

  const hideModal = () => {
    setIsOpen(false);
  };

  const hideEditModal = () => {
    setEditModalOpen(false);
  };

  const numberWithCommas = (x) => {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };


  const Modal = ({ handleClose, children, title }) => {
    return (
      <div className={`modalOpen`}>
        <div className="modalContent">
          <span className="modalClose" onClick={handleClose}>
            &times;
          </span>
          <h3 className="modalHeader">{title}</h3>
          {children}
        </div>
      </div>
    );
  };

  const getInventory = async () => {
    try {
      const response = await fetch("v1/api/inventory", {
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
      const response = await fetch("v1/api/deletedInventory", { mode: "cors" });
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
        `v1/api/addToDeletedInventory/${id}`,
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
        `v1/api/restore/${id}`,
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
      });
      setRestore(data.message);
      setLoading(false);
    } catch (err) {
      console.error(err.message);
    }
  };

  return (
    <>
      <button
        type="button"
        style={{
          backgroundColor: "darkmagenta",
          padding: "20px",
          color: "white",
          border: "2px solid darkmagenta",
          borderRadius: "25px",
          width: "250px",
          height: "70px",
          boxShadow: "none",
          display: "block",
          margin: "0 auto",
        }}
        onClick={showModal}
      >
        {" "}
        Click to create an inventory{" "}
      </button>
      {modalOpen && (
        <Modal handleClose={hideModal} title="Create An Inventory">
          <Formik
       initialValues={{ name: '', description: '', price: 0, quantity: 0}}
       validate={values => {
         const errors = {};
         if (!values.name) {
           errors.name = 'Required';
         } else if (
           !values.description
         ) {
           errors.description = `Description can't be blank`;
         } else if (
           values.price === 0
         ) {
          errors.price =`Price can't be 0`;
         } else if (values.quantity === 0) {
           errors.quantity = `Quantity can't be 0`;
         }
         return errors;
       }}
       onSubmit={ async (values, { setSubmitting }) => {
        try {
          setLoading(true);
          const response = await fetch(
            `v1/api/inventory`,
            {
              method: "POST",
              body: JSON.stringify({
                name: `${values?.name}`,
                description: `${values?.description}`,
                price: `${values?.price}`,
                quantity: `${values?.quantity}`,
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
          toast.success(data?.message, {
            position: "top-right",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          });
          setLoading(false);
          setSubmitting(false);
          hideModal();
        } catch (err) {
          console.error(err.message);
          toast.error(err?.message, {
            position: "top-right",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          });
          hideModal();

        }
       }}
     >
       {({
         values,
         errors,
         touched,
         handleChange,
         handleBlur,
         handleSubmit,
         isSubmitting,
         /* and other goodies */
       }) => (
        <form style={{
          'display':'flex',
          'flexDirection': 'column'
        }} onSubmit={handleSubmit}>
          <label>Name: </label>
          <input
            type="text"
            name="name"
            onChange={handleChange}
            onBlur={handleBlur}
            value={values.name}
          />
          {errors.name && touched.name && errors.name}
          
          <label style={{marginTop: '10px'}} >Description: </label>
          <input
            type="text"
            name="description"
            onChange={handleChange}
            onBlur={handleBlur}
            value={values.description}
          />
          {errors.description && touched.description && errors.description}

          <label style={{marginTop: '10px'}}>Price: </label>
          <input
            type="number"
            name="price"
            onChange={handleChange}
            onBlur={handleBlur}
            value={values.price}
          />
          {errors.price && touched.price && errors.price}

          <label style={{marginTop: '10px'}}>Quantity: </label>
          <input
            type="number"
            name="quantity"
            onChange={handleChange}
            onBlur={handleBlur}
            value={values.quantity}
          />
          {errors.quantity && touched.quantity && errors.quantity}
          
          <button style={{marginTop: '10px'}} type="submit" disabled={isSubmitting}>
            Submit
          </button>
        </form>
      )}
    </Formik>


        </Modal>
      )}

      {editModalOpen && (
        <Modal handleClose={hideEditModal} title="Edit An Inventory">
          <Formik
        initialValues={{ name: `${editName}`, description: `${editDescription}`, price: `${editPrice}`, quantity: `${editQuantity}`}}
        validate={values => {
          const errors = {};
          if (!values.name) {
            errors.name = 'Required';
          } else if (
            !values.description
          ) {
            errors.description = `Description can't be blank`;
          } else if (
            values.price === 0
          ) {
           errors.price =`Price can't be 0`;
          } else if (values.quantity === 0) {
            errors.quantity = `Quantity can't be 0`;
          }
          return errors;
        }


      }
        onSubmit={ async (values, { setSubmitting }) => {
          try {
            setLoading(true);
            const response = await fetch(
              `v1/api/inventory/${editId}`,
              {
                method: "PUT",
                body: JSON.stringify({
                  name: `${values?.name}`,
                  description: `${values?.description}`,
                  price: `${values?.price}`,
                  quantity: `${values?.quantity}`,
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
            toast.success(data?.message, {
              position: "top-right",
              autoClose: 3000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
            });
            setLoading(false);
            setSubmitting(false);
            hideEditModal();
          } catch (err) {
            console.error(err.message);
            toast.error(err?.message, {
              position: "top-right",
              autoClose: 3000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
            });
            hideEditModal();

          }
        }}
      >
        {({
          values,
          errors,
          touched,
          handleChange,
          handleBlur,
          handleSubmit,
          isSubmitting,
          /* and other goodies */
        }) => (
          <form style={{
            'display':'flex',
            'flexDirection': 'column'
          }} onSubmit={handleSubmit}>
            <label>Name: </label>
            <input
              type="text"
              name="name"
              onChange={handleChange}
              onBlur={handleBlur}
              value={values.name}
            />
            {errors.name && touched.name && errors.name}

            <label style={{marginTop: '10px'}} >Description: </label>
            <input

              type="text"
              name="description"
              onChange={handleChange}
              onBlur={handleBlur}
              value={values.description}
            />
            {errors.description && touched.description && errors.description}

            <label style={{marginTop: '10px'}}>Price: </label>
            <input

              type="number"
              name="price"
              onChange={handleChange}
              onBlur={handleBlur}
              value={values.price}
            />
            {errors.price && touched.price && errors.price}

            <label style={{marginTop: '10px'}}>Quantity: </label>
            <input

              type="number"
              name="quantity"
              onChange={handleChange}
              onBlur={handleBlur}
              value={values.quantity}
            />
            {errors.quantity && touched.quantity && errors.quantity}

            <button style={{marginTop: '10px'}} type="submit" disabled={isSubmitting}>
              Submit
            </button>
          </form>
        )}
      </Formik>

        </Modal>
      )}

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
                          width: "500px",
                        }}
                      >
                        <div className="Column">
                          <p> Name: {item.name}</p>
                          <p> Description : {item.description}</p>
                          <p>
                            {" "}
                            Price : &#8358; {numberWithCommas(item.price)}{" "}
                          </p>
                          <p> Quantity: {item.quantity}</p>
                        </div>

                        <div className="Column">
                          <button
                            onClick={() => {
                              setEditId(item._id);
                              setEditName(item.name);
                              setEditDescription(item.description);
                              setEditPrice(item.price);
                              setEditQuantity(item.quantity);
                              showEditModal();
                            }}
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
                          width: "500px",
                        }}
                      >
                        <div className="Column">
                          <p> Name: {item.name}</p>
                          <p> Description : {item.description}</p>
                          <p>
                            {" "}
                            Price : &#8358; {numberWithCommas(item.price)}{" "}
                          </p>
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
    </>
  );
}

export default App;
