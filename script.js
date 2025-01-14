"use strict";

// Elemente aus dem DOM auswählen
const errorMessage = document.querySelector(".error_message");
const budgetInput = document.querySelector(".budget_input");
const expensesInput = document.querySelector(".expenses_input");
const expensesAmount = document.querySelector(".expenses_amount");
const tableRecord = document.querySelector(".table_data");
const cardsContainer = document.querySelector(".cards");

// Karten-Elemente aus dem DOM auswählen
const budgetCard = document.querySelector(".budget_card");
const expensesCard = document.querySelector(".expenses_card");
const balanceCard = document.querySelector(".balance_card");

//  Variablen Initialisieren
let itemList = [];
let itemId = 1;

// Button-Events
function btnEvents() {
  const btnBudgetCal = document.querySelector("#btn_budget");
  const btnExpensesCal = document.querySelector("#btn_expenses");

  // Event-Listener für Budget-Button
  btnBudgetCal.addEventListener("click", (e) => {
    e.preventDefault();
    budgetFun();
  });

  // Event-Listener für Ausgaben-Button
  btnExpensesCal.addEventListener("click", (e) => {
    e.preventDefault();
    expensesFun(); // Ausgaben-Funktion aufrufen
  });
}

// Daten laden und Event-Listener hinzufügen, wenn das Dokument geladen ist
document.addEventListener("DOMContentLoaded", () => {
  btnEvents();

  // Budget aus dem Local Storage laden
  const storedBudget = localStorage.getItem("budget");
  if (storedBudget) {
    budgetCard.textContent = storedBudget;
  }

  // Ausgaben aus dem Local Storage laden
  const storedExpenses = localStorage.getItem("expenses");
  if (storedExpenses) {
    itemList = JSON.parse(storedExpenses);
    itemId = itemList.length > 0 ? itemList[itemList.length - 1].id + 1 : 1;

    // Jede gespeicherte Ausgabe hinzufügen
    itemList.forEach((expense) => addExpensesFun(expense));
  }

  showBalanceFun(); // Saldo anzeigen
});

// Funktion zum Hinzufügen von Ausgaben
function expensesFun() {
  let expensesDescValue = expensesInput.value;
  let expensesAmountValue = expensesAmount.value;

  //  Eingaben korrekt?
  if (expensesDescValue == "" || expensesAmountValue == "" || budgetInput < 0) {
    errorMessageFun("Please Enter Expenses Desc or Expense Amount!");
  } else {
    let amount = parseInt(expensesAmountValue);
    expensesAmount.value = "";
    expensesInput.value = "";

    // Ausgabe-Objekt erstellen
    let expenses = {
      id: itemId,
      title: expensesDescValue,
      amount: amount,
    };

    itemId++;
    itemList.push(expenses);

    // Ausgaben im Local Storage speichern
    localStorage.setItem("expenses", JSON.stringify(itemList));

    // Ausgabe hinzufügen und Saldo aktualisieren
    addExpensesFun(expenses);
    showBalanceFun();
  }
}

//  Hinzufügen von Ausgaben zu Details
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

  // Event-Listener für Bearbeiten- und Löschen-Buttons
  const btnEdit = document.querySelectorAll(".btn_edit");
  const btnDelete = document.querySelectorAll(".btn_delete");
  const contentID = document.querySelectorAll(".tbl_tr_content");

  // Bearbeiten-Button-Event
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

      // Local Storage aktualisieren
      localStorage.setItem("expenses", JSON.stringify(itemList));
    });
  });

  // Löschen-Button-Event
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

      showBalanceFun(); // Saldo aktualisieren
    });
  });
}

// Funktion zum Hinzufügen des Budgets
function budgetFun() {
  const budgetValue = budgetInput.value;

  // Validierung der Eingabe
  if (budgetValue == "" || budgetValue <= 0) {
    errorMessageFun("Bitte gib dein Budget ein | Mehr als 0€");
  } else {
    budgetCard.textContent = budgetValue;
    budgetInput.value = "";

    // Budget im Local Storage speichern
    localStorage.setItem("budget", budgetValue);

    showBalanceFun(); // Saldo aktualisieren
  }
}

// Funktion zum Anzeigen des Saldos
function showBalanceFun() {
  const expenses = totalExpensesFun();
  const total = parseInt(budgetCard.textContent || 0) - expenses;
  balanceCard.textContent = total;
}

// Funktion zur Berechnung der Gesamtausgaben
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

// Anzeige von Fehlermeldung
function errorMessageFun(message) {
  errorMessage.innerHTML = `<p>${message}</p>`;
  errorMessage.classList.add("error");
  setTimeout(() => {
    errorMessage.classList.remove("error");
  }, 2500);
}
