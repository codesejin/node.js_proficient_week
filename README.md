# node.js_proficient_week_1_1
node.js 숙련주차 - easy todo list

``` npm init -y ``` : package.json 파일을 초기화하고 기본값으로 설정
``` npm install express ``` : Express 패키지를 설치
``` npm install mongoose ``` :  Mongoose 패키지를 설치

## front test displiay
  
  ![image](https://github.com/codesejin/node.js_proficient_week_1_1/assets/101460733/69938ca5-44d8-4270-954f-3f37740f3120)

## back api function
-  todo 등록
```
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
```
-  todo 조회

```
// 할일 조회
router.get("/todos", async(req,res) => {
    // sort("정렬할 컬럼명") : -를 넣으면 order의 내림차순, 안넣으면 오름차순
    const todos = await Todo.find().sort("-order").exec();
    // key와 value값이 다르면 todos:todos 로 적고, 똑같으면 하나
    res.send({todos})
})
```
-  todo 우선순위 변경

```
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

    const currentTodo = await Todo.findById(todoId).exec();
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

```
-  todo 삭제

```
// 할일 삭제
router.delete("/todos/:todoId", async (req, res) => {
    const {todoId} = req.params;
    
    const todo = await Todo.findById(todoId).exec();
    await todo.deleteOne();
    res.send({});

});
```

## Studio 3T - mongoDB client
![image](https://github.com/codesejin/node.js_proficient_week_1_1/assets/101460733/db48a359-4801-46f8-a6a2-ab33434f3a61)

