import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { db } from '../services/firebaseFunctions';
import { ref, onValue, push, set, update, remove } from 'firebase/database';

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
  const [searchTerm, setSearchTerm] = useState('');
  const theme = useSelector((state) => state.userData.theme);
  const [isEditing, setIsEditing] = useState(false);
  const [editItemId, setEditItemId] = useState(null);
  const [alertMessage, setAlertMessage] = useState(null);

  useEffect(() => {
    const menuRef = ref(db, 'restaurantMenu/categories');
    onValue(
      menuRef,
      (snapshot) => {
        const data = snapshot.val();
        if (data) {
          const items = Object.keys(data).map((key) => ({
            id: key,
            ...data[key],
          }));
          setCategories(items);
        }
      },
      (error) => {
        console.error('Error fetching data: ', error);
      }
    );
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
        setAlertMessage({ type: 'success', text: 'Item updated successfully!' });
      } else {
        await onValue(
          categoryRef,
          (snapshot) => {
            const data = snapshot.val();
            if (data) {
              const keys = Object.keys(data);
              const indices = keys.map((key) => parseInt(key));
              newIndex = Math.max(...indices) + 1;
            } else {
              newIndex = 0;
            }
          },
          {
            onlyOnce: true,
          }
        );

        const newItemRef = ref(db, `restaurantMenu/categories/${category}/items/${newIndex}`);
        await set(newItemRef, {
          name,
          price: parseFloat(price),
          cost: parseFloat(cost),
          amountInStock: parseInt(amountInStock, 10),
          size,
        });
        setAlertMessage({ type: 'success', text: 'Item added successfully!' });
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
      setAlertMessage({ type: 'error', text: 'An error occurred. Please try again.' });
    }
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
  };

  const handleDelete = async (category, itemId) => {
    try {
      const itemRef = ref(db, `restaurantMenu/categories/${category}/items/${itemId}`);
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
      setAlertMessage({ type: 'success', text: 'Item deleted successfully!' });
    } catch (error) {
      setAlertMessage({ type: 'error', text: 'Failed to delete item. Please try again.' });
    }
  };

  const filteredItems = categories
    .map((category) => ({
      ...category,
      items: Object.keys(category.items || {})
        .filter(
          (key) =>
            category.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
            category.items[key].name.toLowerCase().includes(searchTerm.toLowerCase())
        )
        .reduce((acc, key) => {
          acc[key] = category.items[key];
          return acc;
        }, {}),
    }))
    .filter((category) => Object.keys(category.items).length > 0);

  return (
    <div className={`inventory-page ${theme}`} id="editForm">
      {alertMessage && <div className={`alert ${alertMessage.type}`}>{alertMessage.text}</div>}

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
      </form>

      <input
        type="text"
        placeholder="Search by category or name"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="search-input"
      />

      <h2>Menu Items</h2>
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
            Object.keys(category.items).map((key) => (
              <tr key={key}>
                <td>{category.id.charAt(0).toUpperCase() + category.id.slice(1)}</td>
                <td>{category.items[key].name}</td>
                <td>{category.items[key].price}</td>
                <td>{category.items[key].cost}</td>
                <td>{category.items[key].amountInStock}</td>
                <td>{category.items[key].size}</td>
                <td className="actions">
                  <button
                    className="edit"
                    href="editForm"
                    onClick={() => handleEdit(category.id, key, { id: key, ...category.items[key] })}
                  >
                    Edit
                  </button>
                  <button className="delete" onClick={() => handleDelete(category.id, key)}>
                    Delete
                  </button>
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
