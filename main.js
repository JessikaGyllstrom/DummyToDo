function checkInput() {
    let todotxt = document.getElementById("todotxt").value;
    if (!todotxt) {
        alert("Input cant be empty!")
    }
    else {
        addItem(todotxt);
        todotxt = '';
    }
}
async function getTodos() {
    const response = await fetch('https://dummyjson.com/todos?limit=10');
    if (!response.ok) {
        const message = `An error has occured: ${response.status}`;
        throw new Error(message);
    }
    const list = await response.json();
    return list;
}
getTodos().then((list) => {
    for (let i = 0; i < 10; i++) {
        let li = document.createElement('li');
        li.innerHTML = `<div id="${list.todos[i].id}" class="row"><div class="number">${list.todos[i].id}</div><div id="${list.todos[i].todo}" class="todo">${list.todos[i].todo}</div><input type="checkbox" id="check" name="check"><button name="deleteBtn">Delete</button></div>`;
        document.getElementById('list').appendChild(li);
        }
    }).catch(error => {
    error.message; 
});
document.getElementById('list').addEventListener('click', handleClick);
document.getElementById('newItems').addEventListener('click', handleClick);
document.getElementById('completed').addEventListener('click', handleClick);
document.getElementById("submitBtn").addEventListener("click", checkInput);
localStorage.setItem("index", "11");

function handleClick(e) {
    let item = e.target.parentNode;
    let id = e.target.parentNode.id;
    if (e.target.name == 'deleteBtn') {
        deleteItem(id, item);
    }
    if (e.target.name == 'check') {
        let todo = e.target.previousSibling.id;
        completeItem(id, todo);
        item.remove();
    }
    if (e.target.name == 'unCheck') {
        e.target.parentNode.classList.toggle('undo');
    }
}
function addItem(todotxt) {
    fetch('https://dummyjson.com/todos/add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            todo: `${todotxt}`,
            completed: false,
            userId: 5,
        })
    })
    .then(res => res.json())
    .then(data => {
        const todo = {
            todo: `${todotxt}`,
            completed: data.completed,
            id: localStorage.getItem('index')
        };
    alert("Item added!")
    displayNewItem(todo)
    })
    var index = localStorage.getItem('index');
    index++;
    localStorage.setItem('index', index)
}
// complete todo
function completeItem(id, todo) {
    fetch(`https://dummyjson.com/todos/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            completed: true,
        })
    })
    .then(response => response.json())
    .then(data => {
        const todoObj = { 
            todo: `${todo}`,
            id: `${id}`
        };
        console.log(todoObj);
        alert("Item completed!");
        displayCompleted(todoObj);
    }).catch(error => {
        console.log(error);
    })
}
// delete todo        
function deleteItem(id, item) {
    fetch(`https://dummyjson.com/todos/${id}`, {
    method: 'DELETE',
    })
    .then(res => res.json())
    .then(data => {
        item.remove();
        alert("Item deleted!");
    }).catch(error => {
        console.log(error);
    })
}
// display added todo 
function displayNewItem(todo) {
    let li = document.createElement('li');
    li.innerHTML = `<div id="${todo.id}" class="row"><div class="number">${todo.id}</div><div id="${todo.todo}" class="todo">${todo.todo}</div><input type="checkbox" id="check" name="check"><button name="deleteBtn">Delete</button></div>`;
    document.getElementById('newItems').appendChild(li);
}
// display completed todo 
function displayCompleted(todoObj) {
    let li = document.createElement('li');
    li.innerHTML = `<div id="${todoObj.id}" class="row"><div class="number">${todoObj.id}</div><div id="${todoObj.todo}" class="todo">${todoObj.todo}</div><input type="checkbox" id="check" name="unCheck" checked><button name="deleteBtn">Delete</button></div>`;
    document.getElementById('completed').appendChild(li);
    li.classList.toggle("checked");
}
