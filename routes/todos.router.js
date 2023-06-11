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
router.patch("/todo/:todoId", async (req, res) => {
    const {todoId} = req.params;
    const {order} = req.body;

    // 1. todoId에 해당하는 할 일이 있는가?
    // 1-1. todoId에 해당하는 할 일이 없으면, 저희는 에러를 출력해야 합니다.

    const currentTodo = await Todo.findById(todoId).exec();
    if (!currentTodo) {
       // return res.status(400).json({"errorMessage" : "존재하지 않는 할 일 입니다."});
       throw new Error("존재하지 않는 할 일 입니다.");
    }


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

        res.send();
    }
})

// 퀴즈 1 : 할일 삭제
router.delete("/todos/:todoId", async (req, res) => {
    const {todoId} = req.params;
    
    const todo = await Todo.findById(todoId).exec();
    await todo.deleteOne();
    res.send({});

});

// 퀴즈 2 : 할 일 내용/체크박스 수정 API를 구현
// - 프론트엔드로부터 전송되는 데이터 형식
// - 내용 데이터 수정
// ```jsx
// { value: '변경될 데이터' }
// ```
// - 할일 체크 여부 수정
//```jsx
//{ done: true }
//{ done: false }
// ```

///todos/:todoId 엔드포인트의 PATCH 메서드를 처리합니다.
router.patch("/todos/:todoId", async (req, res) => {
    //클라이언트는 요청 URL의 :todoId 자리에 특정 할 일의 식별자를 전달해야 합니다.
    //요청 본문에서 order, value, done 세 가지 필드를 받습니다.
    const {todoId} = req.params;
    const {order, value, done} = req.body;

    //todoId를 사용하여 해당 식별자에 해당하는 할 일을 MongoDB에서 찾습니다.
    const currentTodo = await Todo.findById(todoId).exec();
    //currentTodo가 존재하지 않는 경우, 에러를 발생시킵니다.
    if (!currentTodo) {
        throw new Error("존재하지 않는 할 일 입니다.");
    }

    //order 필드가 제공된 경우:
    if (order) {
        // 동일한 order 값을 가진 다른 할 일을 찾습니다.
        const targetTodo = await Todo.findOne({ order }).exec();
        // 해당 할 일이 존재하는 경우, 그 할 일의 order 값을 현재 할 일의 order 값으로 설정하고 저장합니다.
        if (targetTodo) {
            targetTodo.order = currentTodo.order;
            await targetTodo.save();
        }
        // 현재 할 일의 order 값을 요청에서 받은 값으로 업데이트합니다.
        currentTodo.order = order;
    //value 필드가 제공된 경우, 현재 할 일의 value 값을 요청에서 받은 값으로 업데이트합니다.
    } else if (value) {
        currentTodo.value = value;
    //done 필드가 제공된 경우:
    } else if (done !== undefined) {
        //done이 true인 경우, 현재 할 일의 doneAt 필드를 현재 시간으로 설정합니다.
        //done이 false인 경우, 현재 할 일의 doneAt 필드를 null로 설정합니다.
        currentTodo.doneAt = done ? new Date() : null;
    }
    //현재 할 일을 저장합니다.
    await currentTodo.save();
    //응답으로 빈 JSON 객체를 보냅니다.
    res.send({});

});

module.exports = router;