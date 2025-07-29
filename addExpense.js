const expenseForm = document.getElementById(`expenseForm`);

expenseForm.addEventListener(`submit`, addExpense);

async function addExpense(e) {
  e.preventDefault();
  const idToken = localStorage.getItem("token");
  const uid = localStorage.getItem("uid");
  const projectId = "sea-purse";

  const amount = document.getElementById(`amount`).value;
  const description = document.getElementById(`description`).value;

  const url = `https://firestore.googleapis.com/v1/projects/${projectId}/databases/(default)/documents/users/${uid}/expense`;
  const date = new Date();
  const firestoreDate = date.toISOString();

  const expenseData = {
    fields: {
      amount: { doubleValue: amount },
      description: { stringValue: description },
      date: { timestampValue: firestoreDate },
    },
  };

  const response = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${idToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(expenseData),
  });

  const data = await response.json();

  if (response.ok) {
    alert(`Разхода е добавен успешно`);
    window.location.href = `dashboard.html`;
  } else {
    console.error(`Грешка при добавяне на разход: `, data);
  }
}
