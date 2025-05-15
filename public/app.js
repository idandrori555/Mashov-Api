let sessionId = "";

document.getElementById("loginForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const semel = document.getElementById("semel").value;
  const year = document.getElementById("year").value;
  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;

  const res = await fetch("/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ semel, year, username, password }),
  });

  const data = await res.json();
  if (data.sessionId) {
    sessionId = data.sessionId;
    document.getElementById("actions").classList.remove("hidden");
    document.getElementById("output").innerHTML = "";
  } else {
    renderOutput(data, true);
  }
});

async function fetchData(endpoint) {
  let url = `/${endpoint}/${sessionId}`;

  const res = await fetch(url);
  const data = await res.json();
  renderOutput(data, endpoint === "grades");
}

function getGrades() {
  fetchData("grades");
}

function getAbsences() {
  fetchData("absences");
}

// <!> DEPRECATED <!>
//   function getBehaviour() {
//     fetchData("behaviour");
//   }

function renderOutput(data, isGrades = false) {
  const container = document.getElementById("output");
  container.innerHTML = "";

  if (typeof data === "string") {
    container.innerHTML = data;
    return;
  }

  if (!Array.isArray(data)) {
    const pre = document.createElement("pre");
    pre.textContent = JSON.stringify(data, null, 2);
    pre.className = "bg-dark p-3";
    container.appendChild(pre);
    return;
  }

  if (data.length === 0) {
    container.innerHTML = "<p>No data available.</p>";
    return;
  }

  const table = document.createElement("table");
  table.className =
    "table table-bordered table-hover table-sm text-center table-striped rounded";

  const headers = isGrades
    ? [
        "year",
        "grade",
        "teacherName",
        "groupName",
        "eventDate",
        "gradingEvent",
        "gradeType",
      ]
    : Object.keys(data[0]);

  const thead = document.createElement("thead");
  thead.innerHTML = `<tr>${headers.map((h) => `<th>${h}</th>`).join("")}</tr>`;

  const tbody = document.createElement("tbody");
  data.reverse().forEach((item) => {
    const row = `<tr>${headers
      .map((h) => {
        let value = item[h];
        if (h === "eventDate" && value) {
          value = new Date(value).toLocaleDateString();
        }
        return `<td>${value !== undefined ? value : ""}</td>`;
      })
      .join("")}</tr>`;
    tbody.innerHTML += row;
  });

  table.appendChild(thead);
  table.appendChild(tbody);
  container.appendChild(table);
}
