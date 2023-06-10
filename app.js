const express = require("express");

const todosRouter = require("./routes/todos.router.js");

const app = express();

app.use("/api", express.json(), todosRouter);
// 정적 파일을 주소 뒤에 입력했을때 확인할 수 있다
// 예시 : http://localhost:8081/index.html
// http://localhost:8081/logo192.png
// express.static 함수는app.js 파일 기준으로, 입력 값(지금은 "./assets") 경로에 있는 파일을 아무런 가공 없이 그대로 전달해주는 미들웨어
// app.js 파일이 루트 폴더(최상위 폴더)에 있고,
// 최상위 폴더 아래이쓴 asset폴더 안에 있는 모든 파일을 정적파일 연결하는 express.static을 통해 연결
app.use(express.static("./assets"));

app.listen(8081, () => {
  console.log("서버가 켜졌어요!");
});