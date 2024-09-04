// Function to get query parameter value by name
function getQueryParam(param) {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get(param);
}

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

// Function to set the header text based on query parameters
function updateHeaderFromQueryParams() {
  const month = getQueryParam("month");
  const year = getQueryParam("year");

  if (month && year) {
    const monthText = getMonthName(parseInt(month, 10));
    const headerMonth = document.querySelector(".header .month");
    const headerYear = document.querySelector(".header .year");

    if (headerMonth && headerYear) {
      headerMonth.textContent = monthText;
      headerYear.textContent = year;
    }
  }
}

// Function to format numbers with dollar sign and two decimal places
function formatCurrency(value) {
  return `$${parseFloat(value).toFixed(2)}`;
}

// Function to calculate and update the total expense
function updateExpenseTotal() {
  const transactionItems = document.querySelectorAll(
    ".transactions .transaction"
  );
  let total = 0;

  transactionItems.forEach((item) => {
    const amountElement = item.querySelector(".transaction-amount");
    if (amountElement) {
      const amountText = amountElement.textContent.replace("$", ""); // Remove dollar sign for parsing
      const amount = parseFloat(amountText);
      if (!isNaN(amount)) {
        total += amount;
      }
    }
  });

  const expenseTotalElement = document.querySelector(".expense-total");
  if (expenseTotalElement) {
    expenseTotalElement.textContent = formatCurrency(total);
  }
}

// Function to reset the form inputs
function resetForm() {
  const dateInput = document.querySelector("#add-date");
  const amountInput = document.querySelector("#add-amount");
  const vendorInput = document.querySelector("#add-vendor");
  const categorySelect = document.querySelector("#add-category");
  const memoInput = document.querySelector("#add-memo");

  if (dateInput) dateInput.value = "";
  if (amountInput) amountInput.value = "";
  if (vendorInput) vendorInput.value = "";
  if (categorySelect) categorySelect.value = "";
  if (memoInput) memoInput.value = "";
}

// Function to validate form inputs
function validateForm() {
  const dateInput = document.querySelector("#add-date");
  const amountInput = document.querySelector("#add-amount");
  const categorySelect = document.querySelector("#add-category");

  // Get the values
  const dateValue = parseInt(dateInput.value, 10);
  const amountValue = parseFloat(amountInput.value);

  // Check if required fields are filled
  if (!dateInput.value || !amountInput.value || !categorySelect.value) {
    alert("Please fill in all required fields.");
    return false;
  }

  // Validate date (should be between 1 and 31)
  if (isNaN(dateValue) || dateValue < 1 || dateValue > 31) {
    alert("Date must be between 1 and 31.");
    return false;
  }

  // Validate amount (should be 0.01 or higher)
  if (isNaN(amountValue) || amountValue < 0.01) {
    alert("Amount must be 0.01 or higher.");
    return false;
  }

  return true;
}

// Function to add a transaction to the list
function addTransaction() {
  if (!validateForm()) {
    return;
  }

  const date = document.querySelector("#add-date").value;
  const amountInput = document.querySelector("#add-amount");
  const vendor = document.querySelector("#add-vendor").value || "N/A";
  const categorySelect = document.querySelector("#add-category");
  const categoryText =
    categorySelect.options[categorySelect.selectedIndex].text;
  const memo = document.querySelector("#add-memo").value || "N/A";

  // Format the amount to two decimal places with a dollar sign
  const amount = formatCurrency(amountInput.value);

  // Create new transaction item
  const transactionList = document.querySelector(".transactions");
  if (transactionList) {
    const li = document.createElement("li");
    li.classList.add("transaction", "border", "lg");

    li.innerHTML = `
      <span class="transaction-date">${date}</span>
      <span class="transaction-amount">${amount}</span>
      <span class="transaction-vendor">${vendor}</span>
      <span class="transaction-category">${categoryText}</span>
      <span class="transaction-memo">${memo}</span>
      <button class="transaction-edit">Edit</button>
    `;

    transactionList.appendChild(li);
    hideAddTransactionPopup();
    resetForm(); // Clear form inputs after adding the transaction

    sortTransactionsByDate(); // Sort transactions after adding a new one
    updateExpenseTotal(); // Update total expense after adding a transaction
    updateCategoryTotals(); // Update category totals after adding a transaction
  }
}

// Function to sort transactions by date
function sortTransactionsByDate() {
  const transactionList = document.querySelector(".transactions");
  const transactions = Array.from(
    transactionList.querySelectorAll(".transaction")
  );

  transactions.sort((a, b) => {
    // Extract date strings and format them as Date objects
    const dateA = new Date(
      `2024-${a
        .querySelector(".transaction-date")
        .textContent.padStart(2, "0")}`
    );
    const dateB = new Date(
      `2024-${b
        .querySelector(".transaction-date")
        .textContent.padStart(2, "0")}`
    );

    return dateA - dateB;
  });

  transactions.forEach((transaction) =>
    transactionList.appendChild(transaction)
  );
}

// Function to update category totals
function updateCategoryTotals() {
  const categories = document.querySelectorAll(".category-information");
  const categoryTotals = {};

  // Initialize totals for each category
  categories.forEach((category) => {
    const categoryName = category.querySelector(".category-type").textContent;
    categoryTotals[categoryName] = 0;
  });

  // Calculate total amounts for each category
  const transactions = document.querySelectorAll(".transactions .transaction");
  transactions.forEach((transaction) => {
    const category = transaction.querySelector(
      ".transaction-category"
    ).textContent;
    const amountText = transaction
      .querySelector(".transaction-amount")
      .textContent.replace("$", ""); // Remove dollar sign for parsing
    const amount = parseFloat(amountText);

    if (categoryTotals.hasOwnProperty(category)) {
      categoryTotals[category] += amount;
    }
  });

  // Update category amounts in the table
  categories.forEach((category) => {
    const categoryName = category.querySelector(".category-type").textContent;
    const categoryAmount = categoryTotals[categoryName] || 0;
    category.querySelector(".category-amount").textContent =
      formatCurrency(categoryAmount);
  });
}

// Functions to handle the add transaction popup
function showAddTransactionPopup() {
  const popup = document.querySelector(".add-transaction-popup");
  if (popup) {
    popup.style.display = "flex";
  }
}

function hideAddTransactionPopup() {
  const popup = document.querySelector(".add-transaction-popup");
  if (popup) {
    popup.style.display = "none";
    resetForm(); // Clear form inputs when hiding the popup
  }
}

// Event listeners setup
document.addEventListener("DOMContentLoaded", () => {
  // Update the header based on query parameters
  updateHeaderFromQueryParams();

  // Add event listeners for popup visibility
  const addButton = document.querySelector(".add-transaction-btn");
  const exitButton = document.querySelector(".exit-button");
  const cancelButton = document.querySelector(".cancel-btn");
  const submitButton = document.querySelector(".submit-btn");

  if (addButton) {
    addButton.addEventListener("click", showAddTransactionPopup);
  }

  if (exitButton) {
    exitButton.addEventListener("click", hideAddTransactionPopup);
  }

  if (cancelButton) {
    cancelButton.addEventListener("click", hideAddTransactionPopup);
  }

  if (submitButton) {
    submitButton.addEventListener("click", addTransaction);
  }
});
