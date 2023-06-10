const mongoose = require("mongoose");

// 3가지 컬럼이 있는 스키마 생성
const TodoSchema = new mongoose.Schema({
    value : String, // 할일이 어떤것인지 확인하는 컬럼
    doneAt : Date, // 할일이 언제 완료되었는지
    order : Number, // 몇 번째 할일인지
});

// 프론트엔드를 사용하기 위해 필요한 것
// 조회할때 생기는 가상의 칼럼
// mongoDb에서 _id는 pk값 : toHexString 타입으로 해야 에러가 줄어듬
// _id값이랑 똑같은 값을 가진 todoId : 익스프레스 내부에서만 있는 가상의 칼럼
TodoSchema.virtual("todoId").get(function(){
    return this._id.toHexString();
});

TodoSchema.set("toJson", {virtuals: true})
// mongoose.model이 TodoSchema를 바깥으로 내보냄
module.exports = mongoose.model("Todo", TodoSchema);