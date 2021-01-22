import React, { useState, useEffect } from "react";
import { FaShoppingCart, FaClipboardList } from "react-icons/fa";
import List from "./List";
import Alert from "./Alert";

// If user enters duplicate, set up alert to ask user if they want to add it again. If so, keep function the same, if not, switch to new Set() function.
// Create array with previously entered items to choose from as a drop down suggestion list?
// Add button to check off list and put item in secondary array
// Add toggle button to display secondary array
const getLocalStorage = () => {
  let list = localStorage.getItem("list");
  if (list) {
    return JSON.parse(localStorage.getItem("list"));
  } else {
    return [];
  }
};
function App() {
  const [name, setName] = useState("");
  const [list, setList] = useState(getLocalStorage());
  const [isEditing, setIsEditing] = useState(false);
  const [editID, setEditID] = useState(null);
  const [alert, setAlert] = useState({ msg: "", type: "" });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name) {
      showAlert("danger", "Please add an item");
    } else if (name && isEditing) {
      setList(
        list.map((item) => {
          if (item.id === editID) {
            return { ...item, title: name };
          }
          return item;
        })
      );
      setName("");
      setEditID(null);
      setIsEditing(false);
      showAlert("success", "item name changed");
    } else {
      showAlert("success", "Item added to list");
      const newItem = { id: new Date().getTime().toString(), title: name };
      setList([...list, newItem]);
      setName("");
    }
  };

  const showAlert = (type = "placeholder", msg = "") => {
    setAlert({ type, msg });
  };

  const clearList = () => {
    showAlert("danger", "List cleared");
    setList([]);
  };

  const removeItem = (id) => {
    showAlert("danger", "Item removed");
    setList(list.filter((item) => item.id !== id));
  };

  const editItem = (id) => {
    const specificItem = list.find((item) => item.id === id);
    setIsEditing(true);
    setEditID(id);
    setName(specificItem.title);
  };

  useEffect(() => {
    localStorage.setItem("list", JSON.stringify(list));
  }, [list]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      showAlert();
    }, 3000);
    return () => clearTimeout(timeout);
  }, [alert]);

  return (
    <section className="section-center">
      <form className="grocery-form" onSubmit={handleSubmit}>
        <Alert {...alert} list={list} />
        <header>
          <FaShoppingCart className="icon" />
          <h3>Shopping List</h3>
        </header>
        <div className="form-control">
          <input
            type="text"
            className="grocery"
            placeholder="e.g. eggs"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <button className="submit-btn" type="submit">
            {isEditing ? "edit" : "submit"}
          </button>
        </div>
      </form>
      {list.length > 0 && (
        <div className="grocery-container">
          <List items={list} removeItem={removeItem} editItem={editItem} />
          <button className="clear-btn" onClick={clearList}>
            Clear list
          </button>
        </div>
      )}
    </section>
  );
}

export default App;
