const form = document.querySelector("#todo-form");
const todoInput = document.querySelector("#todo");
const todoList = document.querySelector(".list-group");
const firstCardBody = document.querySelectorAll(".card-body")[0];
const secondCardBody = document.querySelectorAll(".card-body")[1];
const filter = document.querySelector("#filter");
const clearButton = document.querySelector("#clear-todos");

eventListeners();

function eventListeners() {
    form.addEventListener("submit", addTodo);
    document.addEventListener("DOMContentLoaded", loadAllTodos);   //DOMContentLoaded sayfa yüklenince bu event direkt oluşur.
    secondCardBody.addEventListener("click", deleteTodo);
    filter.addEventListener("keyup",filterTodos);
    clearButton.addEventListener("click",clearAllTodos);
}

function loadAllTodos() {
    let todos = getTodosFromLocalStorage();
    todos.forEach(function (todo) {
        addTodoToUI(todo);
    })

}

function addTodo(e) {
    const newTodo = todoInput.value.trim();       //trim fonksiyonu stringin başındaki ve sonundaki boşlukları siler.
    if (newTodo === "") {
        showAlert("danger", "Lütfen bir todo girin !... ");
    } else {
        addTodoToUI(newTodo);
        showAlert("success", "Todo başarıyla eklendi !... ");
        addTodoLocalStorage(newTodo);
    }
    e.preventDefault();
}

function getTodosFromLocalStorage() {
    let todos;
    if (localStorage.getItem("todos") === null) {
        todos = [];
    } else {
        todos = JSON.parse(localStorage.getItem("todos"));
    }
    return todos;
}

function addTodoLocalStorage(newTodo) {
    let todos = getTodosFromLocalStorage();
    todos.push(newTodo);

    localStorage.setItem("todos", JSON.stringify(todos));
}

function showAlert(type, message) {
    const alert = document.createElement("div");
    alert.className = `alert alert-${type}`;
    alert.textContent = message;
    firstCardBody.appendChild(alert);

    //Alertin belirli bir saniyede görünüp kaybolması içit setTimeOut fonskiyonu kullanılabilir
    setTimeout(function () {
        alert.remove();
    }, 1000)
}

function addTodoToUI(newTodo) {
    //gelen stringi list-item olarak sayfaya ekleyecek.
    //Yeni element oluşturma
    const listItem = document.createElement("li");
    const link = document.createElement("a");
    link.href = "#";
    link.className = "delete-item";
    link.innerHTML = " <i class ='fa fa-remove'></i>"
    listItem.className = "list-group-item d-flex justify-content-between";

    //Text node ekleme
    listItem.appendChild(document.createTextNode(newTodo))
    listItem.appendChild(link)

    //Todo Liste List-item' i ekleme
    todoList.appendChild(listItem)
    todoInput.value = "";


}

function deleteTodo(e) {
    // console.log(e.target);   Elementin içinde nereye tıkladığımızı gösteriyor.
    if (e.target.className === "fa fa-remove") {
        //parentElement ile elimizdeki elementin ebeveeynine erisiriz.
       // const currentTodo = e.target.parentElement.parentElement;
        //currentTodo.remove();
        e.target.parentElement.parentElement.remove();
        deleteTodoFromLocalStorage(e.target.parentElement.parentElement.textContent);
       // deleteTodoFromLocalStorage(currentTodo.textContent);
        showAlert("success", "Todo başarıyla silindi");
    }
}
function deleteTodoFromLocalStorage(deleteTodo) {
    let todos = getTodosFromLocalStorage();
    todos.forEach(function (todo, index) {
        if (deleteTodo === todo) {

            todos.splice(index, 1);   //arrayden değeri siler.
        }
    });
    localStorage.setItem("todos", JSON.stringify(todos));
}

function filterTodos(e){
    const filterValue=e.target.value.toLowerCase();
    const listItems=document.querySelectorAll(".list-group-item")
    listItems.forEach(function (listItem){
        const text=listItem.textContent.toLowerCase();
        if (text.indexOf(filterValue)===-1){
            //bulamadı blogu
            listItem.setAttribute("style","display:none !important");
        }
        else{
            listItem.setAttribute("style","display:block");

        }
    })

}

function clearAllTodos(e){
    if(confirm("Tüm todoları silmek istediğinizden emin misiniz?")){
        // todoList.innerHTML="";  yavas yöntem
        while (todoList.firstElementChild !=null){
            todoList.removeChild(todoList.firstElementChild);
        }
        localStorage.removeItem("todos");
    }
}
