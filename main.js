const ul = document.querySelector("list");
document.getElementById("submitBtn").addEventListener("click", checkInput);
localStorage.setItem("index", "150");

function checkInput() {
    let todotxt = document.getElementById("todotxt").value;
    if (!todotxt) {
        console.log("no input");
        alert("Input cant be empty!")
    }
    else {
        addItem(todotxt);
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
        li.innerHTML = `<div id="${list.todos[i].id}" class="row"><div>${list.todos[i].id}</div><div id="item" class="todo">${list.todos[i].todo}</div><input type="checkbox" id="check" name="check"><button name="deleteBtn">Delete</button></div>`;
        if (list.todos[i].completed) {
            li.classList.toggle('checked');
        }
        document.getElementById('list').appendChild(li);
    }
}).catch(error => {
    error.message; 
});

document.querySelector('ul').addEventListener('click', handleClick);
document.getElementById('newItems').addEventListener('click', handleClick);

function handleClick(e) {
    let item = e.target.parentNode;
    let id = e.target.parentNode.id;
    console.log(e.target.parentNode.id);
    if (e.target.name == 'deleteBtn') {
        deleteItem(id, item);
    }
    if (e.target.name == 'check') {
        item.classList.toggle('checked');
        completeItem(id);
    }
}
function addItem(todotxt) {
    console.log("adding item");
    console.log(todotxt);
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
    .then(console.log);
    alert("New item added!")
    var tempIndex = localStorage.getItem("index");
    tempIndex++;
    localStorage.setItem("index", `${tempIndex}`);
    localStorage.setItem("todo", `${todotxt}`);
    localStorage.setItem("completed", "false");
    localStorage.setItem("userId", "5");
    document.getElementById("todotxt").value = "";
    displayNewItem();
}
function completeItem(id) {
    fetch(`https://dummyjson.com/todos/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            completed: true,
        })
    })
    .then(res => res.json())
    .then(console.log);
    alert("Item completed!");
}
function deleteItem(id, item) {
    fetch(`https://dummyjson.com/todos/${id}`, {
    method: 'DELETE',
    })
    .then(res => res.json())
    .then(console.log);
    item.remove();
    alert("Item deleted!");
}
function displayNewItem() {
    const id = localStorage.getItem("index");
    const todo = localStorage.getItem("todo");
    const index = "140";
    let li = document.createElement('li');
    li.innerHTML = `<div id="${index}" class="row"><div>${id}</div><div id="item" class="todo">${todo}</div><input type="checkbox" id="check" name="check"><button name="deleteBtn">Delete</button></div>`;
    document.getElementById('newItems').appendChild(li);
}