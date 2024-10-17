const rootElement = document.getElementById("root");

// creates modal to create new todo item
const openAddDialogue = (rootElement, todosContainer) => {
  const addModal = createCustomEl("div", rootElement, "addModal");
  const darkBackground = createCustomEl("div", rootElement, "grey");

  const modalHeader = createCustomEl("h1", addModal, "modal_header");
  modalHeader.textContent = "new note";

  const modalInput = createCustomEl("input", addModal, "modal_input");

  const modalButtonsContainer = createCustomEl(
    "div",
    addModal,
    "modal_buttons_container"
  );

  const applyButton = createCustomEl(
    "button",
    modalButtonsContainer,
    "apply_button"
  );
  applyButton.textContent = "apply";
  applyButton.addEventListener("click", () =>
    addNewTodo(modalInput.value, todosContainer, addModal, darkBackground)
  );

  const denyButton = createCustomEl(
    "button",
    modalButtonsContainer,
    "deny_button"
  );
  denyButton.textContent = "deny";
  denyButton.addEventListener("click", () => {
    addModal.remove();
    darkBackground.remove();
  });
};

// changes styles depending on whether todoElement is checked or not
const toggleTodo = (todoCheckBox, todoText, todo, todosContainer) => {
  if (todoCheckBox.classList.contains("checked")) {
    editItem({ id: todo.id, text: todo.text, checked: false }, todosContainer);
  } else {
    editItem({ id: todo.id, text: todo.text, checked: true }, todosContainer);
  }
};

const editTodo = (todo, todoElement, todosContainer) => {
  clearList(todoElement);

  const inputElement = createCustomEl("input", todoElement, "todo_edit_input");
  inputElement.value = todo.text;

  // for correct aligning
  const iconsContainer = createCustomEl("div", todoElement, "icons_container");

  const acceptIcon = createCustomEl("img", iconsContainer, "icon");
  acceptIcon.setAttribute("src", "assets/accept.png");
  // send data to the server
  acceptIcon.addEventListener("click", () =>
    editItem(
      { id: todo.id, check: todo.check, text: inputElement.value },
      todosContainer
    )
  );

  const denyIcon = createCustomEl("img", iconsContainer, "icon");
  denyIcon.setAttribute("src", "assets/deny.png");
  // refresh todos list to remove open inputs
  denyIcon.addEventListener("click", () => {
    clearList(todosContainer);
    createList(todosContainer);
  });
};

// clear all todos after deleting an item
const clearList = (container) => {
  while (container.firstChild) {
    container.removeChild(container.firstChild);
  }
};

const addNewTodo = async (text, todosContainer, addModal, darkBackground) => {
  try {
    const response = await fetch(`/api/v1/items/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ text }),
    });

    const result = await response.json();

    addModal.remove();
    darkBackground.remove();
    // removes all inner content to create list with new data
    clearList(todosContainer);
    await createList(todosContainer);

    return result;
  } catch (error) {}
};

// fetch todos list from the server
const fetchData = async () => {
  try {
    const response = await fetch("/api/v1/items");
    const data = await response.json();

    return data;
  } catch (error) {
    console.error("Error trying to get data: ", error);
  }
};

// deletes item with certain id from databases
const deleteItem = async (id, todosContainer) => {
  try {
    const response = await fetch(`/api/v1/items/`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id }),
    });

    const result = await response.json();

    // removes all inner content to create list with new data
    clearList(todosContainer);
    await createList(todosContainer);

    return result;
  } catch (error) {
    console.error("Error trying to delete an item:", error);
  }
};

const editItem = async (todoItem, todosContainer) => {
  try {
    await fetch("api/v1/items/", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(todoItem),
    });

    clearList(todosContainer);
    createList(todosContainer);
  } catch (error) {
    console.error("Error trying to edit an item", error);
  }
};

const createCustomEl = (elementName, fatherElement, className) => {
  const createdElement = document.createElement(elementName);
  fatherElement.appendChild(createdElement);
  createdElement.classList.add(className);

  return createdElement;
};

// Creates main  part which contains todos
const createList = async (mainContainer) => {
  const todos = await fetchData();

  todos.items.forEach((todo, index) => {
    const todoElement = createCustomEl("div", mainContainer, "todo_element");

    const statusContainer = createCustomEl(
      "div",
      todoElement,
      "status_container"
    );

    const todoCheckBox = createCustomEl("div", statusContainer, "checkbox");
    if (todo.checked) {
      todoCheckBox.innerHTML = "&#10003;";
      todoCheckBox.classList.add("checked");
    }

    todoCheckBox.addEventListener("click", () =>
      toggleTodo(todoCheckBox, todoText, todo, mainContainer)
    );

    const todoText = createCustomEl("p", statusContainer, "todo_text");
    todo.checked && todoText.classList.add("t_checked");
    todoText.textContent = todo.text;
    todoText.addEventListener("click", () =>
      editTodo(todo, todoElement, mainContainer)
    );

    // for correct icons aligning
    const iconsContainer = createCustomEl(
      "div",
      todoElement,
      "icons_container"
    );

    // create icons to modify todoELement
    const removeIcon = createCustomEl("img", iconsContainer, "icon");
    removeIcon.setAttribute("src", "assets/trash.png");
    removeIcon.addEventListener("click", async () => {
      await deleteItem(todo.id, mainContainer);
    });

    const editIcon = createCustomEl("img", iconsContainer, "icon");
    editIcon.setAttribute("src", "assets/edit.png");
    editIcon.addEventListener("click", () =>
      editTodo(todo, todoElement, mainContainer)
    );

    if (index !== todos.items.length - 1) {
      const divider = createCustomEl("hr", mainContainer, "divider");
    }
  });
};

// Create toDoList
const toDoList = createCustomEl("div", rootElement, "todo_list");
const headerContainer = createCustomEl("div", toDoList, "header_container");
const mainContainer = createCustomEl("div", toDoList, "main_container");

const header = createCustomEl("h1", headerContainer, "todo_list_header");
header.textContent = "todo list";

const addButton = createCustomEl("button", toDoList, "add_button");
addButton.textContent = "+";
addButton.addEventListener("click", () =>
  openAddDialogue(rootElement, mainContainer)
);

// all todos
createList(mainContainer);
