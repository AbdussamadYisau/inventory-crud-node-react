// client/src/App.js

import React from "react";
import logo from "./logo.svg";
import "./App.css";

function App() {
  const [mainInventoryData, setMainInventoryData] = React.useState(null);

  React.useEffect(() => {
    fetch("/v1/api/inventory")
      .then((res) => res.json())
      .then((data) => setMainInventoryData(data?.data));
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />

        <h1>Main Inventory</h1>
        <div>
          {!mainInventoryData ? (
            "Loading..."
          ) : (
            <>
              {mainInventoryData?.map((item, index) => (
                <div key={item._id}>
                  <span>{index 
                  + 1}</span>
                  <p> Name: {item.name}</p>
                  <p> Description : {item.description}</p>
                  <p> Price : {item.price}</p>
                  <p> Quantity: {item.quantity}</p>
                </div>
              ))}
            </>
          )}
        </div>
      </header>
    </div>
  );
}

export default App;
