const express = require('express');
const app = express();
const Inventory = require('./models/inventory.model.js');
const mongoose = require('mongoose');
require('dotenv').config();


app.use(express.json());
app.use(express.static('public'));

//get all inventory items
app.get('/api/inventory', async (req, res) => {
    try {
        const items = await Inventory.find();
        
        if (!items || items.length === 0) {
            return res.status(404).json({ message: "No inventory items found" });
        }
        
        res.status(200).json(items);
    } catch (error) {
        res.status(500).json({message: error.message});
    }
});

//add product to inventory
app.post('/api/inventory', async (req, res) => {
  try {
    const { itemName } = req.body;

    const exists = await Inventory.findOne({
        itemName: { $regex: new RegExp(`^${itemName}$`, 'i') }
    });

    if (exists) {
      return res.status(400).json({
        message: 'Item already exists in inventory'
      });
    }

    const newItem = await Inventory.create(req.body);
    res.status(201).json(newItem);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

//search by id
app.put('/api/inventoryUpdate/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const updatedItem = await Inventory.findByIdAndUpdate(
      id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!updatedItem) {
      return res.status(404).json({ message: `Cannot find item with ID ${id}` });
    }

    res.status(200).json(updatedItem);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

//update inventory item by id
app.put('/api/inventoryUpdate/:id', async (req, res) => {
    try {
        const {id} = req.params;
        const item = await Inventory.findByIdAndUpdate(id, req.body);

        if (!item) {
            return res.status(404).json({message: `Cannot find item with ID ${id}`});
        }

        const updatedItem = await Inventory.findById(id);
        res.status(200).json(updatedItem);
    } catch (error) {
        res.status(500).json({message: error.message});
    }
});

//delete inventory item by id
app.delete('/api/inventoryDelete/:id', async (req, res) => {
    try {
        console.log("DELETE request received:", req.params.id);
        const {id} = req.params;
        const item = await Inventory.findByIdAndDelete(id);

        if (!item) {
            return res.status(404).json({message: `Cannot find item with ID ${id}`});
        }

        res.status(200).json({message: "Item deleted successfully"});
    } catch (error) {
        res.status(500).json({message: error.message});
    }
    
});

mongoose.connect(process.env.MONGO_URI)
.then(() => {
  console.log('Connected to MongoDB');
  app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
})
.catch((err) => {
  console.error('Error connecting to MongoDB:', err);
});