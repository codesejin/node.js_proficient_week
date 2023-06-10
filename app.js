const express = require("express");

const app = express();
// router는 앱 객체를 좀더 작게 만듬. 그래서 간단한 미니앱을 라우터로 만들고, 앱에다가 여러 미니앱을 합쳐서 사용
const router = express.Router();

router.get("/", (req, res) => {
    res.send("Hi!");
})
// 앱 객체에 .user()라는 미들웨어 등록
// - /api로 요청이 들어올때 다음으로 express.json이라는 미들웨어를 거치고
// 그 다음으로 해당하는 라우터를 찾아가도록 함
// 또한, express.json이라는 미들웨어는 바디로 들어오는 데이터에 대해서 사용할 수 있게 해줌
app.use("/api", express.json(), router);

app.listen(8081, () => {
    console.log("서버가 켜졌어요!");
})