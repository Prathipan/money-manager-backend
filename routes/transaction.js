const Transaction = require("../models/TransactonModel");
const User = require("../models/UserModel");
const { verifyToken } = require("./verifyToken");

const router = require("express").Router();

router.post("/create", verifyToken, async (req, res) => {
  const user = req.user;
  try {
    const trans = new Transaction({
      userId: user.id,
      name: req.body.name,
      type: req.body.type,
      TransDate: req.body.TransDate,
      amount: req.body.amount,
    });
    const newTrans =await trans.save();
    res.status(200).json(newTrans);
  } catch (error) {
    res.status(500).json(error);
  }
});

router.delete("/trans/:id",verifyToken,async(req,res) => {
   const transId = req.params.id;
   try {
    const deleted = await Transaction.findOneAndDelete({_id : transId});
    res.status(200).json("Item deleted Successfully");
   } catch (error) {
     res.status(500).json(error)
   }  
})

router.get("/get-all",verifyToken,async(req,res) => {
    const user = req.user;
    // console.log(user)
    try {
        const transactions = await Transaction.find({userId : user.id});
        res.status(200).json(transactions);
    } catch (error) {
        res.status(500).json(error);
    }
})

module.exports = router;
