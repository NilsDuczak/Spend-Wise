"use strict";

const errorMessage = document.querySelector('.error_message');
const budgetInput = document.querySelector('.budget_input');
const expensesDel = document.querySelector('.expenses_input');
const expensesAmount = document.querySelector('.expenses_amount');
const tableRecord = document.querySelector('.table_data');
const cardsContainer = document.querySelector('.cards');

//============ Cards =============
const budgetCard = document.querySelector('.budget_card');
const expensesCard = document.querySelector('.expenses_card');
const balanceCard = document.querySelector('.balance_card');

let itemList = [];
let itemId = 0;

//============ Button Events =============
function btnEvents(){
    const btnBudgetCal = document.querySelector('#btn_budget');
    const btnExpensesCal = document.querySelector('#btn_expenses');

    //============ Budget Event =============
    btnBudgetCal.addEventListener('click',(e)=>{
        e.preventDefault();
        budgetFun();
        
    })

     //============ Expenses Event =============
    btnExpensesCal.addEventListener('click',(e)=>{
        e.preventDefault();
        expensesFun();
    })
}

//============ Calling Btns =============
document.addEventListener('DOMContentLoaded', btnEvents );

//============ Expenses Function =============
function expensesFun(){
    let expensesDescValue = expensesDel.value;
    let expensesAmountValue = expensesAmount.value;


    if(expensesDescValue == "" || expensesAmountValue == "" || budgetInput < 0){
        errorMessageFun("Please Enter Expenses Desc or Expense Amount!");
    }else{
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


        // add expenses 
        addExpensesFun(expenses);
        showBalanceFun();
    }
}

//============ Add Expenses Function =============
function addExpensesFun(expensesPara){
    const html = `<ul class="tbl_tr_content">
                    <li data-id=${expensesPara.id}>${expensesPara.id}</li>
                    <li>${expensesPara.title}</li>
                    <li><span>$</span>${expensesPara.amount}</li>
                    <li>
                        <button type="button" class="btn_edit">Edit</button>
                        <button type="button" class="btn_delete">Delete</button>
                    </li>
                 </ul>`;

    tableRecord.insertAdjacentHTML("beforeend", html);

    //============ Edit =============
    const btnEdit = document.querySelectorAll('.btn_edit');
    const btnDelete = document.querySelectorAll('.btn_delete');
    const contentID = document.querySelectorAll('.tbl_tr_content');

    //============ EditButton =============
    btnEdit.forEach((btnedit)=>{
        btnedit.addEventListener("click", (el) =>{
            let id;

            contentID.forEach((ids)=>{
                id = ids.firstElementChild.dataset.id;
            });

            let element = el.target.parentElement.parentElement;
            element.remove();


            let expenses = itemList.filter(function(item){
                return item.id == id;
            });

            expensesDel.value = expenses[0].title;
            expensesAmount.value = expenses[0].amount;

            let tempList = itemList.filter(function(item){
                return item.id != id;
            });
           
            itemList = tempList;
        });
    });



    //============ Button Delete =============
    btnDelete.forEach((btndelete)=>{
        btndelete.addEventListener("click", (el) =>{
            let id;

            contentID.forEach((ids)=>{
                id = ids.firstElementChild.dataset.id;
            });

            let element = el.target.parentElement.parentElement;
            element.remove();

            let tempList = itemList.filter(function(item){
                return item.id != id;
            });
           
            itemList = tempList;
            showBalanceFun();
        });
    });


}





//============ Budget Function =============
function budgetFun(){
    const budgetValue = budgetInput.value;
    
    if (budgetValue == "" || budgetValue <= 0) {  
        errorMessageFun("Please Enter Your Budget or More Than 0")
    } else {
        budgetCard.textContent = budgetValue;
        budgetInput.value = "";
        showBalanceFun();
    }
}
//============ Show Balance Function =============
function showBalanceFun(){
const expenses = totalExpensesFun();
const total = parseInt(budgetCard.textContent) - expenses;
balanceCard.textContent = total;
}




//============ Total Expenses Function =============
function totalExpensesFun(){
    let total = 0;

    if(itemList.length > 0){
        total = itemList.reduce(function(acc,curr){
            acc += curr.amount;
            return acc;
        },0);
    }

    expensesCard.textContent = total;
    return total;
   
}


//============ Error Message Function =============
function errorMessageFun(message){
    errorMessage.innerHTML = `<p>${message}</p>`;
        errorMessage.classList.add("error");
        setTimeout(() => {
            errorMessage.classList.remove("error");
        }, 2500);
}

