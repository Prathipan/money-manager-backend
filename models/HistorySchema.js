const mongoose = require("mongoose");
const ObjectID = mongoose.Schema.Types.ObjectId;

const HistorySchema = new mongoose.Schema({
  userId: { type: ObjectID, required: true, ref: "User" },
  items: [
    {
      itemId: {
        type: ObjectID,
        ref: "Transaction",
        required: true,
      },
    },
  ],
});

module.exports = mongoose.model("History",HistorySchema);