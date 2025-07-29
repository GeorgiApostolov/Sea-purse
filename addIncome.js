const incomeForm = document.getElementById(`incomeForm`);

incomeForm.addEventListener(`submit`, addIncome);

async function addIncome(e) {
  e.preventDefault();
  const idToken = localStorage.getItem("token");
  const uid = localStorage.getItem("uid");
  const projectId = "sea-purse";

  const amount = document.getElementById(`amount`).value;
  const description = document.getElementById(`description`).value;

  const url = `https://firestore.googleapis.com/v1/projects/${projectId}/databases/(default)/documents/users/${uid}/incomes`;
  const date = new Date();
  const firestoreDate = date.toISOString();

  const incomeData = {
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
    body: JSON.stringify(incomeData),
  });

  const data = await response.json();

  if (response.ok) {
    alert(`Прихода е добавен успешно`);
    window.location.href = `dashboard.html`;
  } else {
    console.error(`Грешка при добавяне на приход: `, data);
  }
}
