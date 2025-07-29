const refreshBtn = document.getElementById(`refresh`);
const divIncome = document.getElementById(`incomes`);
const divExpense = document.getElementById(`expenses`);
const clearBtn = document.getElementById(`clear`);
const balanceSpan = document.getElementById(`balance`);

let incomeBalance = 0;
let expenseBalance = 0;

const userUID = localStorage.getItem(`uid`);
const token = localStorage.getItem(`token`);

clearBtn.addEventListener(`click`, clear);

function clear() {
  divIncome.textContent = ``;
  divExpense.textContent = ``;
  balanceSpan.textContent = `0.00 лв`;
}

refreshBtn.addEventListener(`click`, () => {
  let averageBalance = 0;
  incomeRefresh();
  expenseRefresh();
  setTimeout(() => {
    balance();
  }, 300);
});

async function incomeRefresh() {
  divIncome.textContent = ``;

  const url = `https://firestore.googleapis.com/v1/projects/sea-purse/databases/(default)/documents/users/${userUID}/incomes`;

  const res = await fetch(url, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  if (!res.ok) {
    console.log(`Грешка`);
    return;
  }
  const data = await res.json();
  const incomeArr = data.documents;

  incomeArr.sort((a, b) => {
    const dateA = new Date(a.fields.date.timestampValue);
    const dateB = new Date(b.fields.date.timestampValue);
    return dateB - dateA;
  });

  incomeBalance = 0;
  for (let currentEl of incomeArr) {
    const currentValue = currentEl.fields.amount.doubleValue;
    const currentDesc = currentEl.fields.description.stringValue;
    const utcTime = currentEl.fields.date.timestampValue;
    const localDate = new Date(utcTime);
    incomeBalance += Number(currentValue);

    const item = document.createElement(`div`);
    item.textContent = `${localDate.toLocaleString(
      "bg-BG"
    )} - ${currentDesc} +${currentValue.toFixed(2)} лв`;
    item.classList.add("income-item");
    divIncome.appendChild(item);
  }
}

async function expenseRefresh() {
  divExpense.textContent = ``;
  const url = `https://firestore.googleapis.com/v1/projects/sea-purse/databases/(default)/documents/users/${userUID}/expense`;
  const res = await fetch(url, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  if (!res.ok) {
    console.log(`Грешка`);
    return;
  }
  const data = await res.json();
  const expenseArr = data.documents;

  expenseArr.sort((a, b) => {
    const dateA = new Date(a.fields.date.timestampValue);
    const dateB = new Date(b.fields.date.timestampValue);
    return dateB - dateA;
  });

  expenseBalance = 0;
  for (let currentEl of expenseArr) {
    const currentValue = currentEl.fields.amount.doubleValue;
    const currentDesc = currentEl.fields.description.stringValue;
    const utcTime = currentEl.fields.date.timestampValue;
    const localDate = new Date(utcTime);
    expenseBalance += Number(currentValue);

    const item = document.createElement(`div`);
    item.textContent = `${localDate.toLocaleString(
      "bg-BG"
    )} - ${currentDesc} +${currentValue.toFixed(2)} лв`;
    item.classList.add("income-item");
    divExpense.appendChild(item);
  }
}

function balance() {
  balanceSpan.textContent = ``;
  averageBalance = incomeBalance - expenseBalance;
  if (averageBalance < 0) {
    alert(`Баланса ви е отрицателен!`);
  } else {
    balanceSpan.textContent = averageBalance + ` лв`;
  }
}
