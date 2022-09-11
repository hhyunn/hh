const body = document.querySelector("body");


/*########## 랜덤 배경 이미지 ##########*/
// 랜덤 숫자 (이미지 5개)
const num = Math.floor(Math.random()*5);
// console.log(num);

body.style.backgroundImage = `url('img/background/s${num}.jpg')`;



/*########## 실시간 시계 ##########*/
function clock(){

    // 현재 시간
    const now = new Date();
    // console.log(now);

    // 예시: 오후 10:51 9월 11일 일요일
    const month = now.getMonth()+1;
    const date = now.getDate();
    const day = now.getDay();
    const hours = now.getHours();
    const minutes = String(now.getMinutes()).padStart(2,"0");
    const seconds = String(now.getSeconds()).padStart(2,"0");
    // console.log(month, date, day, hours, minutes, seconds);

    switch(day){
        case 0: days = "일"; break;
        case 1: days = "월"; break;
        case 2: days = "화"; break;
        case 3: days = "수"; break;
        case 4: days = "목"; break;
        case 5: days = "금"; break;
        case 6: days = "토"; break;
    }
    // console.log(`${hours}:${minutes}:${seconds} ${month}월 ${date}일 ${days}요일`);

    const loginTime = document.querySelector("#clock .time");
    const loginDate = document.querySelector("#clock .date");
    const statusBarTime = document.querySelector("#statusBar .time");
    const statusBarDate = document.querySelector("#statusBar .date");
    // console.log(statusBarTime, statusBarDate);

    loginTime.innerHTML = `${hours}:${minutes}`;
    loginDate.innerHTML = `${month}월 ${date}일 ${days}요일`;
    statusBarTime.innerText = `${hours}:${minutes}:${seconds}`;
    statusBarDate.innerText = `${month}월 ${date}일 ${days}요일`;

}

// 실시간
clock();
const timer = setInterval(clock, 1000);



/*########## 로컬 스토리지를 사용한 로그인 ##########*/
const login = document.querySelector("#login");
const loginInput = document.querySelector("#userid");
const home = document.querySelector("#home");
const test = document.querySelector(".test");

const HIDDEN_CLASSNAME = "hidden";
const USERID_KEY = "userid";

function onLoginSubmit(event){
    event.preventDefault();
    login.classList.add(HIDDEN_CLASSNAME);
    const userid = loginInput.value;
    localStorage.setItem(USERID_KEY, userid);
    useridInfo(userid);
}

function useridInfo(userid){
    test.innerText = `${userid}`;
    home.classList.remove(HIDDEN_CLASSNAME);
}

const savedUserId = localStorage.getItem(USERID_KEY);

if(savedUserId === null){
    login.classList.remove(HIDDEN_CLASSNAME);
    login.addEventListener("submit", onLoginSubmit);
} else{
    useridInfo(savedUserId);
}



/*########## 날씨와 위치 (geolocation) ##########*/
const API_KEY = "88f3d954dda032a5024c83f878a43fc9";

function onGeoOk(position){
    const lat = position.coords.latitude;
    const lon = position.coords.longitude;
    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`;
    fetch(url).then(response => response.json()).then(data => {
            const weather = document.querySelector(".weatherWidget span:nth-child(2)");
            const city = document.querySelector(".weatherWidget span:last-child");
        city.innerText = data.name;
        weather.innerText = `${data.weather[0].main} / ${data.main.temp}°`;
    });
}
function onGeoError(){
    alert("위치를 찾지 못했습니다");
}

navigator.geolocation.getCurrentPosition(onGeoOk, onGeoError);



/*########## 로컬 스토리지를 사용한 투두리스트 ##########*/
const toDoForm = document.getElementById("todoForm");
const toDoInput = toDoForm.querySelector("input");
const todoList = document.getElementById("todoList");

const TODOS_KEY = "todos";

let toDos = [];

function saveToDos(){
    localStorage.setItem(TODOS_KEY, JSON.stringify(toDos));
}

function deleteToDo(event){
    const li = event.target.parentElement;
    li.remove();
    toDos = toDos.filter((toDo) => toDo.id !== parseInt(li.id));
    saveToDos();
}

function paintToDo(newTodo){
    const li = document.createElement("li");
    li.id = newTodo.id;
    const span = document.createElement("span");
    span.innerText = newTodo.text;
    const button = document.createElement("button");
    button.innerText = "❌";
    button.addEventListener("click", deleteToDo);
    li.appendChild(span);
    li.appendChild(button);
    todoList.appendChild(li);
}

function handleToDoSubmit(event){
    event.preventDefault();
    const newTodo = toDoInput.value;
    toDoInput.value = "";
    const newTodoObj = {
        text: newTodo,
        id: Date.now(),
    };
    toDos.push(newTodoObj);
    paintToDo(newTodoObj);
    saveToDos();
}

toDoForm.addEventListener("submit", handleToDoSubmit);

const savedToDos = localStorage.getItem(TODOS_KEY);

if(savedToDos != null){
    const parsedToDos = JSON.parse(savedToDos);
    toDos = parsedToDos;
    parsedToDos.forEach(paintToDo);
}