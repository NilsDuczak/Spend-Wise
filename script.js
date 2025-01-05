"use strict";

const errorMessage = document.querySelector(".error_message");
const budgetInput = document.querySelector(".budget_input");
const expensesDel = document.querySelector(".expenses_input");
const expensesAmount = document.querySelector(".expenses_amount");
const tableRecord = document.querySelector(".table_data");
const cardsContainer = document.querySelector(".cards");

//============ Cards =============
const budgetCard = document.querySelector(".budget_card");
const expensesCard = document.querySelector(".expenses_card");
const balanceCard = document.querySelector(".balance_card");

let itemList = [];
let itemId = 1;

//============ Button Events =============
function btnEvents() {
  const btnBudgetCal = document.querySelector("#btn_budget");
  const btnExpensesCal = document.querySelector("#btn_expenses");

  //============ Budget Event =============
  btnBudgetCal.addEventListener("click", (e) => {
    e.preventDefault();
    budgetFun();
  });

  //============ Expenses Event =============
  btnExpensesCal.addEventListener("click", (e) => {
    e.preventDefault();
    expensesFun();
  });
}

//============= Load Storage Data =========
document.addEventListener("DOMContentLoaded", () => {
  btnEvents();

  // Budget aus dem Speicher laden
  const storedBudget = localStorage.getItem("budget");
  if (storedBudget) {
    budgetCard.textContent = storedBudget;
  }

  // Expenses aus dem Speicher laden
  const storedExpenses = localStorage.getItem("expenses");
  if (storedExpenses) {
    itemList = JSON.parse(storedExpenses);
    itemId = itemList.length > 0 ? itemList[itemList.length - 1].id + 1 : 1;

    // Gerenderte gespeicherte Einträge hinzufügen
    itemList.forEach((expense) => addExpensesFun(expense));
  }

  showBalanceFun();
});

//============ Expenses Function =============
function expensesFun() {
  let expensesDescValue = expensesDel.value;
  let expensesAmountValue = expensesAmount.value;

  if (expensesDescValue == "" || expensesAmountValue == "" || budgetInput < 0) {
    errorMessageFun("Please Enter Expenses Desc or Expense Amount!");
  } else {
    let amount = parseInt(expensesAmountValue);
    expensesAmount.value = "";
    expensesDel.value = "";

    // Store Value inside the object
    let expenses = {
      id: itemId,
      title: expensesDescValue,
      amount: amount,
    };

    itemId++;
    itemList.push(expenses);

    // Daten im Local Storage speichern
    localStorage.setItem("expenses", JSON.stringify(itemList));

    // add expenses
    addExpensesFun(expenses);
    showBalanceFun();
  }
}

//============ Add Expenses Function =============
function addExpensesFun(expensesPara) {
  const html = `<ul class="tbl_tr_content">
                    <li data-id=${expensesPara.id}>${expensesPara.id}</li>
                    <li>${expensesPara.title}</li>
                    <li>${expensesPara.amount}<span>€</span></li>
                    <li>
                        <button type="button" class="btn_edit">Edit</button>
                        <button type="button" class="btn_delete">Delete</button>
                    </li>
                 </ul>`;

  tableRecord.insertAdjacentHTML("beforeend", html);

  //============ Edit =============
  const btnEdit = document.querySelectorAll(".btn_edit");
  const btnDelete = document.querySelectorAll(".btn_delete");
  const contentID = document.querySelectorAll(".tbl_tr_content");

  //============ EditButton =============
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

      expensesDel.value = expenses[0].title;
      expensesAmount.value = expenses[0].amount;

      let tempList = itemList.filter(function (item) {
        return item.id != id;
      });

      itemList = tempList;

      // Local Storage aktualisieren
      localStorage.setItem("expenses", JSON.stringify(itemList));
    });
  });

  //============ Button Delete =============
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

      // Local Storage aktualisieren
      localStorage.setItem("expenses", JSON.stringify(itemList));

      showBalanceFun();
    });
  });
}

//============ Budget Function =============
function budgetFun() {
  const budgetValue = budgetInput.value;

  if (budgetValue == "" || budgetValue <= 0) {
    errorMessageFun("Bitte gib dein Budget ein | Mehr als 0€");
  } else {
    budgetCard.textContent = budgetValue;
    budgetInput.value = "";

    // Budget im Local Storage speichern
    localStorage.setItem("budget", budgetValue);

    showBalanceFun();
  }
}

//============ Show Balance Function =============
function showBalanceFun() {
  const expenses = totalExpensesFun();
  const total = parseInt(budgetCard.textContent || 0) - expenses;
  balanceCard.textContent = total;
}

//============ Total Expenses Function =============
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

//============ Error Message Function =============
function errorMessageFun(message) {
  errorMessage.innerHTML = `<p>${message}</p>`;
  errorMessage.classList.add("error");
  setTimeout(() => {
    errorMessage.classList.remove("error");
  }, 2500);
}
