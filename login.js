const url = `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=API_KEY`;
const apiKey = `AIzaSyCekegpJ9XgHKFOZ7GMviTZ_VSkHw3ZpsM`;

const loginForm = document.getElementById(`loginForm`);

loginForm.addEventListener(`submit`, login);

async function login(e) {
  const email = document.getElementById(`email`).value;
  const password = document.getElementById(`password`).value;

  e.preventDefault();

  fetch(
    `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${apiKey}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: email,
        password: password,
        returnSecureToken: true,
      }),
    }
  )
    .then((res) => res.json())
    .then((data) => {
      if (data.error) {
        console.error(`Грешка: `, data.error.message);
      } else {
        localStorage.setItem("token", data.idToken);
        localStorage.setItem("uid", data.localId);

        window.location.href = "dashboard.html";
      }
    });
}
