# node.js_proficient_week_1_1
node.js 숙련주차 - easy todo list

- Q. **Node.js는 프로그래밍 언어이다!?**
    
    A. 🙅‍♂️! Node.js는 JavaScript를 브라우저 없이 단독으로 실행할 수 있는 하나의 플랫폼입니다. ([위키피디아 참고](https://ko.wikipedia.org/wiki/Node.js))

- Q. **npm은 Node.js와 같은 프로그램이다!?**
    
    A. 🙅‍♂️! npm은 여러분이 Node.js에서 오픈소스 라이브러리를 쉽게 사용하기 위해 개발된 "**패키지 관리자**"라는 형식의 프로그램입니다.
    
- Q. **express는 서버라고 불러도 된다?!**
    
    A. 🙅‍♂️! `express`라는 라이브러리는 여러분이 쉽게 서버 프로그램을 구성할 수 있게 만들어진 "**오픈소스 라이브러리**"입니다.
    
    ## express를 써야하는 이유
    
    1. **Node.js**에서는 필요하다면, `express`를 사용하지 않고 `http` 라이브러리를 이용해 웹 서버를 만들 수 있다.
        - 🧩  **`http`를 통한 웹 서버 만들기 예제**
            
            ```jsx
            const http = require('http');
            
            // 서버 객체를 생성합니다.
            http.createServer(function (req, res) {
              res.write('Hello World!'); // 클라이언트에게 전달할 응답을 작성합니다.
              res.end(); // 클라이언트에게 응답을 전달합니다.
            }).listen(8080); // 서버를 8080포트로 실행합니다.
            ```
            
    2. `express`를 이용하면 `http` 라이브러리를 사용하는 것 보다 손쉽게 웹 서버를 만들 수 있다.
        - **🧩  `express`를 이용한 웹 서버 만들기 예제**
            
            ```jsx
            const app = require("express")(); // express의 app객체를 가져옵니다.
            
            app.listen(8080,()=> {}); // 서버를 8080포트로 실행합니다.
            ```
            
    3. `express`는 `http` 라이브러리보다 더욱 많은 기능을 제공하여 웹 서버를 견고하게 구현할 수 있다.

  ## 라이브러리(프레임워크) `express`에 대한 이해
    1. **Node.js**를 이용해 `express`로 웹 서버를 만들 수 있다.
    2. **미들웨어**의 개념을 이해할 수 있다.
    3. 내가 만든 서버로 "**정적 파일(Static file)**"을 제공할 수 있다.
        
        <aside>
        💡 **정적 파일?** 말 그대로 "변하지 않는 파일"이라고 생각하면 좋습니다.
        (["정적"의 사전적 의미](https://ko.wiktionary.org/wiki/%EC%A0%95%EC%A0%81))
        서버에서 파일 내용을 변형하여 사용하지 않고, 클라이언트(요청자)에게 그대로 전달하기 위한 목적의 파일입니다.
        
        </aside>
        
        우리가 사용하는 `express` 라는 라이브러리는 정적 파일을 쉽게 제공할 수 있게 해주는 **미들웨어**가 존재합니다.
        
    4. **라우터**를 이용해 원하는 **Method**와 **경로**로 HTTP 요청을 받아 처리하는 방법을 안다.
---
``` npm init -y ``` : package.json 파일을 초기화하고 기본값으로 설정

``` npm install express ``` : Express 패키지를 설치

``` npm install mongoose ``` :  Mongoose 패키지를 설치

``` npm i express mongoose ``` : npm i express mongoose는 npm install express mongoose의 축약형입니다.
npm install 명령어는 패키지를 설치하는 명령어이며, -i는 -install의 축약형

---

## front test displiay
  
![image](https://github.com/codesejin/node.js_proficient_week_1_1/assets/101460733/cd205ac6-04a0-4cf9-82e6-a5faea2006dd)

## back api function
### -  todo 등록
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
### -  todo 조회

```
// 할일 조회
router.get("/todos", async(req,res) => {
    // sort("정렬할 컬럼명") : -를 넣으면 order의 내림차순, 안넣으면 오름차순
    const todos = await Todo.find().sort("-order").exec();
    // key와 value값이 다르면 todos:todos 로 적고, 똑같으면 하나
    res.send({todos})
})
```

### -  todo 우선순위 변경

```
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
    res.send();
})
```
<img width="1090" alt="image" src="https://github.com/codesejin/node.js_proficient_week_1_1/assets/101460733/9adcdaed-1008-47ae-b282-8bcf73032a79">

### -  todo 삭제

```
// 할일 삭제
router.delete("/todos/:todoId", async (req, res) => {
    const {todoId} = req.params;
    
    const todo = await Todo.findById(todoId).exec();
    await todo.deleteOne();
    res.send({});

});
```
<img width="1091" alt="image" src="https://github.com/codesejin/node.js_proficient_week_1_1/assets/101460733/af4f7ee0-007f-456f-9620-e07a15ee4405">

### - todo 수정하기 기능 추가 (순서, 메모, 완료여부 각 하나씩 요청 바디에 전송)
```
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
```
<img width="1088" alt="image" src="https://github.com/codesejin/node.js_proficient_week_1_1/assets/101460733/0327426c-6d7f-4ddd-92ee-f9fbb4ca8ecb">

![image](https://github.com/codesejin/node.js_proficient_week_1_1/assets/101460733/45f45840-ffae-4e45-b156-cae503108995)

## Studio 3T - mongoDB client
robo3t 설치법 : https://tychejin.tistory.com/353

![image](https://github.com/codesejin/node.js_proficient_week_1_1/assets/101460733/db48a359-4801-46f8-a6a2-ab33434f3a61)

## Directory Structure
```
내 프로젝트 폴더 이름
├── app.js
├── assets
│   ├── asset-manifest.json
│   ├── favicon.ico
│   ├── index.html
│   ├── logo192.png
│   ├── logo512.png
│   ├── manifest.json
│   ├── robots.txt
│   └── static
│       ├── css
│       │   ├── main.6842b365.chunk.css
│       │   └── main.6842b365.chunk.css.map
│       └── js
│           ├── 2.96129310.chunk.js
│           ├── 2.96129310.chunk.js.LICENSE.txt
│           ├── 2.96129310.chunk.js.map
│           ├── 3.0962e34f.chunk.js
│           ├── 3.0962e34f.chunk.js.map
│           ├── main.c5ceafa0.chunk.js
│           ├── main.c5ceafa0.chunk.js.map
│           ├── runtime-main.2ec3457b.js
│           └── runtime-main.2ec3457b.js.map
├── models
│   ├── index.js
│   └── todo.js
├── routes
│   └── todos.router.js
├── package-lock.json
└── package.json
```

# MongoDB 설치

https://zzang9ha.tistory.com/361
