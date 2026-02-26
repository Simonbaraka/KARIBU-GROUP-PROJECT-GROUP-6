const express = require('express');
const Procurement_Model = require('../Karibu-models/procurement-Model');
const Router = express.Router();

//Get Procurement

Router.get('/', async (req, res) => {
  try {
    const _procurement = await Procurement_Model.find();
    res
      .status(200)
      .json({ message: 'Procurement Received ', data: _procurement });
  } catch (err) {
    res
      .status(500)
      .json({ message: 'Procurement Not Received', error: err.message });
  }
});

Router.get('/:id', async (req, res, next) => {
  try {
    let sale = await Procurement_Model.findById(req.params.id);
    if (!sale) {
      return res.status(404).json({ message: 'Not found' });
    }
    res
      .status(200)
      .json({ message: 'Sales Data collection was a success ', data: sale });
  } catch (err) {
    res.status(500).json({ message: 'Sales not found', error: err.message });
  }
});
//POST PROCUREMENT

Router.post('/', async (req, res) => {
  try {
    const { Produce_name, Produce_tonnage, Produce_Cost, Branch } = req.body;
    console.log('RAW BODY:', req.body);
    console.log('Produce_tonnage:', Produce_tonnage);
    console.log('Type:', typeof Produce_tonnage);

    let produce = await Procurement_Model.findOne({ Produce_name, Branch });
    if (produce) {
      produce.Produce_tonnage += Number(Produce_tonnage);
      await produce.save();

      return res.status(200).json({
        message: 'Stock updated successfully',
        data: produce,
      });
    }
    const _procurement = new Procurement_Model(req.body);
    console.log('DATA RECEIVED:', req.body);
    await _procurement.save();
    res.status(201).json({
      message: 'Procurement Recorded Successfully',
      data: _procurement,
    });
  } catch (err) {
    console.log('SAVE ERROR:', err.message);
    res.status(500).json({
      message: 'Failed to Create Procurement Data',
      error: err.message,
    });
  }
});

//UPDATE PROCUREMENT

Router.patch('/:id', async (req, res) => {
  try {
    let pro_id = req.params.id;
    let pro_body = req.body;
    const _Updated = await Procurement_Model.findByIdAndUpdate(
      pro_id,
      pro_body,
      { new: true }
    );

    res
      .status(200)
      .json({ message: 'Procurement Update successful', data: _Updated });
  } catch (err) {
    res
      .status(500)
      .json({ message: 'Procurement Update Failed', error: err.message });
  }
});

//DELETING PROCUREMENT

Router.delete('/:id', async (req, res) => {
  try {
    let _Produce_name = req.params.id;
    //Validating input
    if (!_Produce_name) {
      res.status(400).json({ message: 'Produce name required' });
    }

    const Produce_Deleted =
      await Procurement_Model.findByIdAndDelete(_Produce_name);

    if (!Produce_Deleted) {
      res.status(404).json({
        message: 'Produce Not found',
      });
    }

    res.status(200).json({
      message: 'Procurement Deleted Successfully ',
      data: Produce_Deleted,
    });
  } catch (err) {
    res
      .status(500)
      .json({ message: 'Procurement Deletion Failed', error: err.message });
  }
});

module.exports = Router;
