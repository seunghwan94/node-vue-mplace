<template>
  <div>
      <div class="main-body">
        <div class="help-icon-container">
          <div class="help-icon" @click="openModal">?</div>
        </div>
        <div id="modal" class="modal" @click.self="closeModal">
          <div class="modal-content" @click.stop>
              <span class="close" @click="closeModal">&times;</span>
              <p style="font-weight: bold;font-size: 24px;">m/place-Korea 규칙</p>
              <p>1. 원하는 색상을 정해 픽셀을 찍는다.</p>
              <p>2. 5초에 한번씩 픽셀을 찍을 수 있다.</p>
              <p>3. 플레이시간은 아침 09:00 ~ 18:00 까지</p>
              <p style="color: gray; font-size: 14px;">TMI. URL이 magolee.shop 인 이유 : 값이 싸서</p>
              <p style="margin-top: 45px;color: red;">※ 색상 클릭이 안되는 경우 선택 버튼 말고 색깔 부분 클릭하면 됨</p>
              <p style="width: 10px;height: 10px;" @click="testButton"> </p>
          </div>
        </div>
      </div>
  </div>
</template>
<script>
export default {
  props:{
    is_main: Number,
  },
  methods: {
    openModal() {
      document.getElementById('modal').style.display = 'block';
    },
    testButton() {
      document.getElementById('modal').style.display = 'none';
      this.$emit('testButton');
    }
  }
};
</script>
<style>
/* 기존 스타일 */
.main-body {
/* position: relative; */
width: 100%; /* 전체 너비를 사용하도록 설정 */
}

.help-icon-container {
position: absolute;
top: 20px; /* 상단에서의 거리 */
right: 20px; /* 오른쪽에서의 거리 */
font-weight: bold;
z-index: 10; /* 다른 요소들 위에 표시되도록 z-index 설정 */
}

.help-icon {
font-size: 24px;
cursor: pointer;
background: #fefefe;
padding: 0 3px 5px 3px;
border-radius: 15px; /* 원형 모양으로 변경 */
width: 30px; /* 너비 설정 */
height: 30px; /* 높이 설정 */
display: flex;
justify-content: center;
align-items: center;
box-shadow: 0 2px 5px rgba(0,0,0,0.2); /* 그림자 효과 추가 */
}

.modal {
display: none; /* 초기에 모달 숨기기 */
position: fixed;
z-index: 1;
left: 0;
top: 0;
width: 100%;
height: 100%;
background-color: rgba(0, 0, 0, 0.5); /* 반투명 배경색 */
overflow: auto; /* 스크롤 가능하도록 설정 */
}

.modal-content {
background-color: #fefefe;
margin: 15% auto;
padding: 20px;
border: 1px solid #888;
width: 80%;
}

.close {
color: #aaa;
float: right;
font-size: 28px;
font-weight: bold;
cursor: pointer; /* 마우스가 올라갔을 때 포인터 커서로 변경 */
}

.close:hover,
.close:focus {
color: black;
text-decoration: none;
cursor: pointer; /* 마우스가 올라갔을 때 포인터 커서로 변경 */
}
</style>