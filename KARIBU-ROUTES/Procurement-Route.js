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

//POST PROCUREMENT

Router.post('/', async (req, res) => {
  try {
    const _procurement = new Procurement_Model(req.body);

    await _procurement.save();
    res.status(201).json({
      message: 'Procurement Recorded Successfully',
      data: _procurement,
    });
  } catch (err) {
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

Router.delete('/:Produce_name', async (req, res) => {
  try {
    let _Produce_name = req.params.Produce_name;
    //Validating input
    if (!_Produce_name) {
      res.status(400).json({ message: 'Produce name required' });
    }

    const Produce_Deleted = await Procurement_Model.findOneAndDelete({
      Produce_name: _Produce_name,
    });

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
