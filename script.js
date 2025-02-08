"use strict";

// Select Elements
const errorMessage = document.querySelector(".error_message");
const budgetInput = document.querySelector(".budget_input");
const expensesInput = document.querySelector(".expenses_input");
const expensesAmount = document.querySelector(".expenses_amount");
const tableRecord = document.querySelector(".table_data");
const cardsContainer = document.querySelector(".cards");

const budgetCard = document.querySelector(".budget_card");
const expensesCard = document.querySelector(".expenses_card");
const balanceCard = document.querySelector(".balance_card");

let itemList = [];
let itemId = 1;

// Button-Events
function btnEvents() {
  const btnBudgetCal = document.querySelector("#btn_budget");
  const btnExpensesCal = document.querySelector("#btn_expenses");

  //  Budget-Button
  btnBudgetCal.addEventListener("click", (e) => {
    e.preventDefault();
    budgetFun();
  });

  //  Spendings-Button
  btnExpensesCal.addEventListener("click", (e) => {
    e.preventDefault();
    expensesFun(); // Ausgaben-Funktion aufrufen
  });
}

// Load Data
document.addEventListener("DOMContentLoaded", () => {
  btnEvents();

  // load budget
  const storedBudget = localStorage.getItem("budget");
  if (storedBudget) {
    budgetCard.textContent = storedBudget;
  }

  // load spendings
  const storedExpenses = localStorage.getItem("expenses");
  if (storedExpenses) {
    itemList = JSON.parse(storedExpenses);
    itemId = itemList.length > 0 ? itemList[itemList.length - 1].id + 1 : 1;

    itemList.forEach((expense) => addExpensesFun(expense));
  }

  showBalanceFun();
});

function expensesFun() {
  let expensesDescValue = expensesInput.value;
  let expensesAmountValue = expensesAmount.value;

  if (expensesDescValue == "" || expensesAmountValue == "" || budgetInput < 0) {
    showErrorMessage("Please Enter Expenses Desc or Expense Amount!");
  } else {
    let amount = parseInt(expensesAmountValue);
    expensesAmount.value = "";
    expensesInput.value = "";

    let expenses = {
      id: itemId,
      title: expensesDescValue,
      amount: amount,
    };

    itemId++;
    itemList.push(expenses);

    // set local storage
    localStorage.setItem("expenses", JSON.stringify(itemList));

    addExpensesFun(expenses);
    showBalanceFun();
  }
}

function addExpensesFun(expenses) {
  const html = `<ul class="tbl_tr_content">
                    <li data-id=${expenses.id}>${expenses.id}</li>
                    <li>${expenses.title}</li>
                    <li>${expenses.amount}<span>€</span></li>
                    <li>
                        <button type="button" class="btn_edit">Edit</button>
                        <button type="button" class="btn_delete">Löschen</button>
                    </li>
                 </ul>`;

  tableRecord.insertAdjacentHTML("beforeend", html);

  const btnEdit = document.querySelectorAll(".btn_edit");
  const btnDelete = document.querySelectorAll(".btn_delete");
  const contentID = document.querySelectorAll(".tbl_tr_content");

  btnEdit.forEach((btnedit) => {
    btnedit.addEventListener("click", (el) => {
      let id;

      contentID.forEach((ids) => {
        id = ids.firstElementChild.dataset.id;
      });

      let element = el.target.parentElement.parentElement;
      element.remove();

      let expenses = itemList.filter(function (item) {
        return item.id == id;
      });

      expensesInput.value = expenses[0].title;
      expensesAmount.value = expenses[0].amount;

      let tempList = itemList.filter(function (item) {
        return item.id != id;
      });

      itemList = tempList;

      localStorage.setItem("expenses", JSON.stringify(itemList));
    });
  });

  btnDelete.forEach((btndelete) => {
    btndelete.addEventListener("click", (el) => {
      let id;

      contentID.forEach((ids) => {
        id = ids.firstElementChild.dataset.id;
      });

      let element = el.target.parentElement.parentElement;
      element.remove();

      let tempList = itemList.filter(function (item) {
        return item.id != id;
      });

      itemList = tempList;

      localStorage.setItem("expenses", JSON.stringify(itemList));

      showBalanceFun();
    });
  });
}

function budgetFun() {
  const budgetValue = budgetInput.value;

  if (budgetValue == "" || budgetValue <= 0) {
    showErrorMessage("Bitte gib dein Budget ein | Mehr als 0€");
  } else {
    budgetCard.textContent = budgetValue;
    budgetInput.value = "";

    localStorage.setItem("budget", budgetValue);

    showBalanceFun();
  }
}

function showBalanceFun() {
  const expenses = totalExpensesFun();
  const total = parseInt(budgetCard.textContent || 0) - expenses;
  balanceCard.textContent = total;
}

function totalExpensesFun() {
  let total = 0;

  if (itemList.length > 0) {
    total = itemList.reduce(function (acc, curr) {
      acc += curr.amount;
      return acc;
    }, 0);
  }

  expensesCard.textContent = total;
  return total;
}

function showErrorMessage(message) {
  errorMessage.innerHTML = `<p>${message}</p>`;
  errorMessage.classList.add("error");
  setTimeout(() => {
    errorMessage.classList.remove("error");
  }, 2500);
}
