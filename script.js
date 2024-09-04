// Select elements
const monthPopUp = document.querySelector(".add-month-popup");
const addMonthBtn = document.querySelector(".add-monthly-expense-btn");
const submitBtn = document.querySelector(".add-month-popup .submit-btn");
const cancelBtn = document.querySelector(".add-month-popup .cancel-btn");
const exitBtns = document.querySelectorAll(".exit-button");
const displayContainer = document.querySelector(".expense-period-container");
const monthInput = document.querySelector("#add-month");
const yearInput = document.querySelector("#add-year");
const memoInput = document.querySelector("#add-memo");
const editMonthPopUp = document.querySelector(".edit-month-popup");
const editSubmitBtn = document.querySelector(".edit-month-popup .submit-btn");
const editCancelBtn = document.querySelector(".edit-month-popup .cancel-btn");
const editMonthInput = document.querySelector("#edit-month");
const editYearInput = document.querySelector("#edit-year");
const editMemoInput = document.querySelector("#edit-memo");
const editDeleteRadioNo = document.querySelector("#edit-delete-no");
const editDeleteRadioYes = document.querySelector("#edit-delete-yes");

// Variables to store current edit item
let itemToEdit = null;

// Local data object
let data = {
  expenses: [],
};

// Function to get month name from month number
function getMonthName(monthNumber) {
  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  return monthNames[monthNumber - 1] || "Unknown";
}

// Function to sort expense periods from most recent to oldest
function sortExpensePeriods() {
  const items = Array.from(
    displayContainer.querySelectorAll(".expense-period")
  );
  items.sort((a, b) => {
    const monthA = parseInt(
      a.querySelector(".expense-period-month").dataset.month,
      10
    );
    const yearA = parseInt(
      a.querySelector(".expense-period-year").textContent,
      10
    );
    const monthB = parseInt(
      b.querySelector(".expense-period-month").dataset.month,
      10
    );
    const yearB = parseInt(
      b.querySelector(".expense-period-year").textContent,
      10
    );

    if (yearA !== yearB) {
      return yearB - yearA;
    }
    return monthB - monthA;
  });

  displayContainer.innerHTML = "";
  items.forEach((item) => displayContainer.appendChild(item));
}

// Function to display expenses from local data
function displayExpenses() {
  displayContainer.innerHTML = "";
  data.expenses.forEach((exp) => {
    const expenseItem = document.createElement("li");
    expenseItem.classList.add("expense-period", "border", "lg");
    expenseItem.innerHTML = `
      <span class="expense-period-month" data-month="${
        exp.month
      }">${getMonthName(exp.month)}</span>
      <span class="expense-period-year">${exp.year}</span>
      <span class="expense-period-amount">$0</span>
      <span class="expense-period-memo">${exp.memo || "N/A"}</span>
      <button class="edit-btn">Edit</button>
    `;
    displayContainer.appendChild(expenseItem);
  });
  sortExpensePeriods();
}

// Function to add or update expense in local data
function addExpenseToData(month, year, memo) {
  const existingIndex = data.expenses.findIndex(
    (exp) => exp.month === month && exp.year === year
  );
  if (existingIndex === -1) {
    data.expenses.push({ month, year, memo });
  } else {
    data.expenses[existingIndex] = { month, year, memo };
  }
  saveExpenseData(); // Simulate saving updated data
}

// Function to simulate saving updated data to a JSON file
function saveExpenseData() {
  console.log("Saving data:", data); // Simulate saving data
}

// Function to fetch initial data from a local JSON file
function fetchExpenseData() {
  // Simulate fetching data
  const mockData = {
    expenses: [
      { month: 1, year: 2024, memo: "My first expense" },
      { month: 2, year: 2024, memo: "Second expense" },
    ],
  };
  data = mockData;
  console.log("Fetched data:", data); // Log to verify the data
  displayExpenses();
}

// Function to show edit popup and populate fields
function showEditPopup(item) {
  itemToEdit = item;
  const month = parseInt(
    item.querySelector(".expense-period-month").dataset.month,
    10
  );
  const year = parseInt(
    item.querySelector(".expense-period-year").textContent,
    10
  );
  const memo = item.querySelector(".expense-period-memo").textContent;

  editMonthInput.value = month;
  editYearInput.value = year;
  editMemoInput.value = memo !== "N/A" ? memo : "";

  editDeleteRadioNo.checked = true;
}

// Function to hide popups
const hidePopUps = () => {
  monthPopUp.style.display = "none";
  editMonthPopUp.style.display = "none";
};

// Add event listener for add expense button
addMonthBtn.addEventListener("click", () => {
  monthPopUp.style.display = "flex";
});

// Add event listener for submit button in add popup
submitBtn.addEventListener("click", (event) => {
  event.preventDefault(); // Prevent default form submission

  const month = parseInt(monthInput.value, 10);
  const year = parseInt(yearInput.value, 10);
  const memo = memoInput.value.trim();

  const MIN_MONTH = 1;
  const MAX_MONTH = 12;
  const MIN_YEAR = 1900;
  const MAX_YEAR = 2100;

  let valid = true;

  if (
    !month ||
    !year ||
    month < MIN_MONTH ||
    month > MAX_MONTH ||
    year < MIN_YEAR ||
    year > MAX_YEAR
  ) {
    alert(
      "Please fill out all required fields and ensure they are within valid ranges."
    );
    valid = false;
  }

  const existingItems = data.expenses;
  for (const exp of existingItems) {
    if (month === exp.month && year === exp.year) {
      alert("An entry for this month and year already exists.");
      valid = false;
      break;
    }
  }

  if (!valid) return;

  addExpenseToData(month, year, memo);
  displayExpenses();
  // Clear input fields
  monthInput.value = "";
  yearInput.value = "";
  memoInput.value = "";
  // Hide popup
  monthPopUp.style.display = "none";
});

// Add event listener for expense period clicks
displayContainer.addEventListener("click", (event) => {
  if (event.target && event.target.classList.contains("expense-period")) {
    const month = event.target.querySelector(".expense-period-month").dataset
      .month;
    const year = event.target.querySelector(".expense-period-year").textContent;

    // Redirect to expenses.html with month and year as query parameters
    window.location.href = `expenses.html?month=${month}&year=${year}`;
  }
});

// Event delegation for edit buttons
displayContainer.addEventListener("click", (event) => {
  if (event.target && event.target.classList.contains("edit-btn")) {
    showEditPopup(event.target.closest(".expense-period"));
    editMonthPopUp.style.display = "flex";
  }
});

// Add event listener for submit button in edit popup
editSubmitBtn.addEventListener("click", (event) => {
  event.preventDefault(); // Prevent default form submission

  const month = parseInt(editMonthInput.value, 10);
  const year = parseInt(editYearInput.value, 10);
  const memo = editMemoInput.value.trim();
  const deleteItem = editDeleteRadioYes.checked;

  const MIN_MONTH = 1;
  const MAX_MONTH = 12;
  const MIN_YEAR = 1900;
  const MAX_YEAR = 2100;

  let valid = true;

  if (
    !month ||
    !year ||
    month < MIN_MONTH ||
    month > MAX_MONTH ||
    year < MIN_YEAR ||
    year > MAX_YEAR
  ) {
    alert(
      "Please fill out all required fields and ensure they are within valid ranges."
    );
    valid = false;
  }

  if (deleteItem) {
    // If delete is selected, remove the item from data
    const indexToRemove = data.expenses.findIndex(
      (exp) =>
        exp.month ===
          parseInt(
            itemToEdit.querySelector(".expense-period-month").dataset.month,
            10
          ) &&
        exp.year ===
          parseInt(
            itemToEdit.querySelector(".expense-period-year").textContent,
            10
          )
    );
    if (indexToRemove !== -1) {
      data.expenses.splice(indexToRemove, 1);
    }
  } else {
    // Handle update scenario
    if (itemToEdit) {
      const monthInData = parseInt(
        itemToEdit.querySelector(".expense-period-month").dataset.month,
        10
      );
      const yearInData = parseInt(
        itemToEdit.querySelector(".expense-period-year").textContent,
        10
      );

      const existingItemIndex = data.expenses.findIndex(
        (exp) => exp.month === monthInData && exp.year === yearInData
      );

      if (existingItemIndex !== -1) {
        // Only update the memo if it has changed
        if (memo !== data.expenses[existingItemIndex].memo) {
          data.expenses[existingItemIndex].memo = memo;
        }
      }
    }
  }

  displayExpenses();
  editMonthPopUp.style.display = "none";
});

// Add event listener for cancel buttons
document.addEventListener("DOMContentLoaded", () => {
  cancelBtn.addEventListener("click", hidePopUps);
  editCancelBtn.addEventListener("click", hidePopUps);
  exitBtns.forEach((button) => button.addEventListener("click", hidePopUps));
});

// Fetch initial expense data on page load
fetchExpenseData();
