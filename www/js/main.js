class ToDoList {
  constructor(parent, dbName) {
    //Inicion estado
    this.state = {
      todos: []
    };

    //Creo referencias a los elementos necesarios:
    //formulario
    //botón limpiar
    //botón de borrar todos
    //lista de tareas
    //Seleccionar los elementos del interface
    this.addForm = parent.querySelector("form.add");
    this.cleanButton = parent.querySelector("button.clean");
    this.destroyButton = parent.querySelector("button.destroy");
    this.todoList = parent.querySelector("ul.todolist");

    //Establezco nombre de la etiqueta de localstorage
    this.dbName = dbName;

    if (
      !this.addForm ||
      !this.cleanButton ||
      !this.destroyButton ||
      !this.todoList
    ) {
      throw new Error("Faltan elementos. Revisa el HTML");
    }

    const savedTodos = window.localStorage.getItem(this.dbName);
    if (savedTodos) {
      this.state.todos = JSON.parse(savedTodos);
      this.render();
    }
  }

  start() {
    //Añadir un todos
    this.addForm.addEventListener("submit", e => {
      e.preventDefault();
      const todoInput = this.addForm.elements.todotext;
      const todoText = todoInput.value;

      if (todoText.length > 0 && todoText.length < 200) {
        this.addToDo(todoText);
        //todoInput.value = "";
        this.addForm.reset();
      }
    });

    //CAmbiar estado de todo

    this.todoList.addEventListener("click", e => {
      const target = e.target;
      if (target.matches("input[type=checkbox]")) {
        const index = target.getAttribute("data-index");
        this.toggleTodoStatus(index);
      }
    });

    this.cleanButton.addEventListener("click", e => {
      this.cleanTodoList();
    });

    //Borrar todo

    this.destroyButton.addEventListener("click", e => {
      if (prompt("Escribe BORRAR para borrar la lista de todos") === "BORRAR") {
        this.deleteTodoList();
      }
    });
  }

  //Añadir un todo

  addToDo(text) {
    const newToDo = {
      text: text,
      done: false
    };

    this.state.todos.unshift(newToDo);

    this.sync();
  }

  //Marcar un todo como hecho/pendiente

  toggleTodoStatus(index) {
    const todo = this.state.todos[index];
    todo.done = !todo.done;

    this.sync();
  }
  //Limpiar lista de todos
  cleanTodoList() {
    const cleanList = this.state.todos.filter(function(todo) {
      return !todo.done;
    });
    this.state.todos = cleanList;

    this.sync();
  }
  //Borrar todos los todos
  deleteTodoList() {
    this.state.todos = [];

    this.sync();
  }

  sync() {
    window.localStorage.setItem(this.dbName, JSON.stringify(this.state.todos));
    this.render();
  }

  render() {
    let index = 0;
    this.todoList.innerHTML = "";
    for (const todo of this.state.todos) {
      //creo el li con el todo
      const todoItem = document.createElement("li");
      //creo el texto del todo y asigno su contenido
      const todoText = document.createElement("p");
      todoText.textContent = todo.text;
      //creo el checkbox
      const todoCheck = document.createElement("input");
      todoCheck.setAttribute("type", "checkbox");
      todoCheck.setAttribute("data-index", index);

      if (todo.done) {
        todoCheck.setAttribute("checked", true);
        todoItem.classList.add("done");
      }

      //meto el checkbox en el li
      todoItem.appendChild(todoCheck);
      //meto el texto del todo en el li
      todoItem.appendChild(todoText);

      //añado el li a la lista
      this.todoList.appendChild(todoItem);
      index++;
    }
  }
}

const main = document.querySelector("main");
const todo = new ToDoList(main, "mytodos-app");
todo.start();
