const refreshBtn = document.getElementById(`refresh`);
const divIncome = document.getElementById(`incomes`);
const divExpense = document.getElementById(`expenses`);
const clearBtn = document.getElementById(`clear`);

const userUID = localStorage.getItem(`uid`);
const token = localStorage.getItem(`token`);

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
  for (let currentEl of expenseArr) {
    const currentValue = currentEl.fields.amount.doubleValue;
    const currentDesc = currentEl.fields.description.stringValue;
    const utcTime = currentEl.fields.date.timestampValue;
    const localDate = new Date(utcTime);

    const item = document.createElement(`div`);
    item.textContent = `${localDate.toLocaleString(
      "bg-BG"
    )} - ${currentDesc} +${currentValue.toFixed(2)} лв`;
    item.classList.add("income-item");
    divExpense.appendChild(item);
  }
}
