const express = require("express");
const Todo = require("../models/todo.js");

const router = express.Router();

router.get("/", (req, res) => {
    res.send("Hi!");
})

// api 만들때는 라우터로 만들어야 함

// 할일 추가(생성)
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

// 할일 조회
router.get("/todos", async(req,res) => {
    // sort("정렬할 컬럼명") : -를 넣으면 order의 내림차순, 안넣으면 오름차순
    const todos = await Todo.find().sort("-order").exec();
    // key와 value값이 다르면 todos:todos 로 적고, 똑같으면 하나
    res.send({todos})
})

// 할일 순서 수정
router.patch("/todos/:todoId", async (req, res) => {
    const {todoId} = req.params;
    const {order} = req.body;

    // 1. todoId에 해당하는 할 일이 있는가?
    // 1-1. todoId에 해당하는 할 일이 없으면, 저희는 에러를 출력해야 합니다.

    const currentTodo = await Todo.findById(todoId);
    if (!currentTodo) {
        return res.status($00).json({"errorMessage" : "존재하지 않는 할 일 입니다."});
    }
    res.send();

    if (order) {
        const targetTodo = await Todo.findOne({order: order}).exec();
        if(targetTodo) {
            // 2 -> 1
            targetTodo.order = currentTodo.order;
            await targetTodo.save();
        }
        // 1 -> 2
        currentTodo.order = order;
        await currentTodo.save();
    }
})

module.exports = router;