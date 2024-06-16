import React, { useEffect, useState, useRef } from 'react';
import { useSelector } from 'react-redux';
import { db } from '../services/firebaseFunctions';
import { ref, onValue, set, update, remove } from 'firebase/database';

import './Inventory.css';

const InventoryPage = () => {
  const [categories, setCategories] = useState([]);
  const [newItem, setNewItem] = useState({
    category: '',
    name: '',
    price: '',
    cost: '',
    amountInStock: '',
    size: 'standard',
  });
  const theme = useSelector(state => state.userData.theme);
  const [isEditing, setIsEditing] = useState(false);
  const [editItemId, setEditItemId] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [alert, setAlert] = useState({ visible: false, message: '', type: '' });
  const editFormRef = useRef(null);

  useEffect(() => {
    const menuRef = ref(db, 'restaurantMenu/categories');
    onValue(menuRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const items = Object.keys(data).map((key) => ({
          id: key,
          ...data[key],
        }));
        setCategories(items);
      }
    }, (error) => {
      console.error("Error fetching data: ", error);
    });
  }, [db]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewItem((prevItem) => ({
      ...prevItem,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { category, name, price, cost, amountInStock, size } = newItem;
    if (!category || !name || !price || !cost || !amountInStock || !size) return;

    const categoryRef = ref(db, `restaurantMenu/categories/${category}/items/`);
    let newIndex = 0;

    try {
      if (isEditing) {
        const itemRef = ref(db, `restaurantMenu/categories/${category}/items/${editItemId}`);
        await update(itemRef, {
          name,
          price: parseFloat(price),
          cost: parseFloat(cost),
          amountInStock: parseInt(amountInStock, 10),
          size,
        });
        setIsEditing(false);
        setEditItemId(null);
        showAlert('Item updated successfully!', 'success');
      } else {
        await onValue(categoryRef, (snapshot) => {
          const data = snapshot.val();
          if (data) {
            const keys = Object.keys(data);
            const indices = keys.map(key => parseInt(key));
            newIndex = Math.max(...indices) + 1;
          } else {
            newIndex = 0;
          }
        }, {
          onlyOnce: true
        });

        const newItemRef = ref(db, `restaurantMenu/categories/${category}/items/${newIndex}`);
        await set(newItemRef, {
          name,
          price: parseFloat(price),
          cost: parseFloat(cost),
          amountInStock: parseInt(amountInStock, 10),
          size,
        });
        showAlert('Item added successfully!', 'success');
      }

      setNewItem({
        category: '',
        name: '',
        price: '',
        cost: '',
        amountInStock: '',
        size: 'standard',
      });
    } catch (error) {
      showAlert('Operation failed. Please try again.', 'error');
    }
  };

  const handleClear = () => {
    setNewItem({
      category: '',
      name: '',
      price: '',
      cost: '',
      amountInStock: '',
      size: 'standard',
    });
    setIsEditing(false);
    setEditItemId(null);
  };

  const handleEdit = (category, key, item) => {
    setNewItem({
      category,
      name: item.name,
      price: item.price,
      cost: item.cost,
      amountInStock: item.amountInStock,
      size: item.size,
    });
    setIsEditing(true);
    setEditItemId(key);
    editFormRef.current.scrollIntoView({ behavior: 'smooth' });
  };

  const handleDelete = async (category, itemId) => {
    const itemRef = ref(db, `restaurantMenu/categories/${category}/items/${itemId}`);
    try {
      await remove(itemRef);
      setCategories((prevItems) =>
        prevItems.map((cat) => {
          if (cat.id === category) {
            return {
              ...cat,
              items: cat.items.filter((item) => item.id !== itemId),
            };
          }
          return cat;
        })
      );
      showAlert('Item deleted successfully!', 'success');
    } catch (error) {
      showAlert('Delete operation failed. Please try again.', 'error');
    }
  };

  const showAlert = (message, type) => {
    setAlert({ visible: true, message, type });
    setTimeout(() => {
      setAlert({ visible: false, message: '', type: '' });
    }, 3000);
  };

  const filteredItems = categories.map(category => ({
    ...category,
    items: category.items && Object.keys(category.items)
      .filter(key => category.items[key].name.toLowerCase().includes(searchQuery.toLowerCase())
        || category.id.toLowerCase().includes(searchQuery.toLowerCase()))
      .reduce((obj, key) => {
        obj[key] = category.items[key];
        return obj;
      }, {})
  }));

  return (
    <div className={`inventory-page ${theme}`}>
      {alert.visible && (
        <div className={`alert ${alert.type}`}>
          {alert.message}
        </div>
      )}
      <div ref={editFormRef}>
        <br/>
        <form onSubmit={handleSubmit}>
          <select name="category" value={newItem.category} onChange={handleChange}>
            <option value="">Select Category</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.id.charAt(0).toUpperCase() + category.id.slice(1)}
              </option>
            ))}
          </select>
          <input
            type="text"
            name="name"
            value={newItem.name}
            placeholder="Item Name"
            onChange={handleChange}
          />
          <input
            type="number"
            name="price"
            value={newItem.price}
            placeholder="Price (PHP)"
            onChange={handleChange}
          />
          <input
            type="number"
            name="cost"
            value={newItem.cost}
            placeholder="Cost (PHP)"
            onChange={handleChange}
          />
          <input
            type="number"
            name="amountInStock"
            value={newItem.amountInStock}
            placeholder="Amount in Stock"
            onChange={handleChange}
          />
          <select name="size" value={newItem.size} onChange={handleChange}>
            <option value="standard">Standard</option>
            <option value="small">Small</option>
            <option value="medium">Medium</option>
            <option value="large">Large</option>
          </select>
          <button type="submit">{isEditing ? 'Update Item' : 'Add Item'}</button>
          <button type="button" id="clear" onClick={handleClear}>Clear</button>
        </form>
      </div>

      <h2>Menu Items</h2>
      <input
        type="text"
        placeholder="Search items"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />
      <table>
        <thead>
          <tr>
            <th>Category</th>
            <th>Name</th>
            <th>Price (PHP)</th>
            <th>Cost (PHP)</th>
            <th>Amount in Stock</th>
            <th>Size</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredItems.map((category) =>
            category.items && Object.keys(category.items).map((key) => (
              <tr key={key}>
                <td>{category.id.charAt(0).toUpperCase() + category.id.slice(1)}</td>
                <td>{category.items[key].name}</td>
                <td>{category.items[key].price}</td>
                <td>{category.items[key].cost}</td>
                <td>{category.items[key].amountInStock}</td>
                <td>{category.items[key].size}</td>
                <td className="actions">
                  <button className="edit" onClick={() => handleEdit(category.id, key, { id: key, ...category.items[key] })}>Edit</button>
                  <button className="delete" onClick={() => handleDelete(category.id, key)}>Delete</button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default InventoryPage;
