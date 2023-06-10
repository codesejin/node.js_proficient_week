const express = require("express");
const Todo = require("../models/todo.js");

const router = express.Router();

router.get("/", (req, res) => {
    res.send("Hi!");
})


// api 만들때는 라우터로 만들어야 함
router.post("/todos", async(req, res) => {
    // 수신 받는 
    const {value} = req.body;
    const maxOrderByUserId = await Todo.findOne().sort("-order").exec(); // order값을 역순으로 조회

    const order = maxOrderByUserId ?
     maxOrderByUserId.order + 1 : // maxOrderByUserId 있을 때,
      1; // maxOrderByUserId가 없을 때
      const todo = new Todo({value, order: order });
      await todo.save();

      res.send({todo});
})
module.exports = router;