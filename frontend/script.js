const form = document.getElementById('expenseForm');
const expenseIdInput = document.getElementById('expenseId');
const amountInput = document.getElementById('amount');
const categoryInput = document.getElementById('category');
const expenseDateInput = document.getElementById('expense_date');
const noteInput = document.getElementById('note');
const tableBody = document.getElementById('expenseTableBody');
const messageEl = document.getElementById('message');
const formTitle = document.getElementById('formTitle');
const cancelEditButton = document.getElementById('cancelEdit');

let expenseCache = [];

function formatMoney(value) {
  return Number(value).toLocaleString('vi-VN') + ' đ';
}

function showMessage(message, isError = false) {
  messageEl.textContent = message;
  messageEl.className = isError ? 'error' : 'success';
}

function resetForm() {
  form.reset();
  expenseIdInput.value = '';
  formTitle.textContent = 'Thêm khoản chi';
  expenseDateInput.value = new Date().toISOString().split('T')[0];
}

function renderExpenses(expenses) {
  tableBody.innerHTML = '';

  if (!expenses.length) {
    tableBody.innerHTML = '<tr><td colspan="5">Chưa có dữ liệu chi tiêu.</td></tr>';
    return;
  }

  expenses.forEach((expense) => {
    const row = document.createElement('tr');

    row.innerHTML = `
      <td>${formatMoney(expense.amount)}</td>
      <td>${expense.category}</td>
      <td>${expense.expense_date}</td>
      <td>${expense.note || ''}</td>
      <td></td>
    `;

    const actionCell = row.querySelector('td:last-child');

    const editButton = document.createElement('button');
    editButton.textContent = 'Sửa';
    editButton.addEventListener('click', () => editExpense(expense.id));

    const deleteButton = document.createElement('button');
    deleteButton.textContent = 'Xóa';
    deleteButton.className = 'danger';
    deleteButton.addEventListener('click', () => deleteExpense(expense.id));

    actionCell.appendChild(editButton);
    actionCell.appendChild(document.createTextNode(' '));
    actionCell.appendChild(deleteButton);

    tableBody.appendChild(row);
  });
}

async function fetchExpenses() {
  try {
    const response = await fetch('/api/expenses');
    const expenses = await response.json();
    expenseCache = expenses;
    renderExpenses(expenses);
  } catch (error) {
    showMessage('Không tải được dữ liệu.', true);
  }
}

function editExpense(id) {
  const expense = expenseCache.find((item) => item.id === id);
  if (!expense) return;

  expenseIdInput.value = expense.id;
  amountInput.value = expense.amount;
  categoryInput.value = expense.category;
  expenseDateInput.value = expense.expense_date;
  noteInput.value = expense.note || '';
  formTitle.textContent = 'Chỉnh sửa khoản chi';
}

async function deleteExpense(id) {
  const isConfirmed = window.confirm('Anh có chắc muốn xóa khoản chi này không?');
  if (!isConfirmed) return;

  try {
    const response = await fetch(`/api/expenses/${id}`, { method: 'DELETE' });
    const data = await response.json();

    if (!response.ok) {
      showMessage(data.message || 'Xóa thất bại.', true);
      return;
    }

    showMessage('Xóa thành công.');
    await fetchExpenses();
  } catch (error) {
    showMessage('Có lỗi xảy ra khi xóa.', true);
  }
}

form.addEventListener('submit', async (event) => {
  event.preventDefault();

  const payload = {
    amount: Number(amountInput.value),
    category: categoryInput.value.trim(),
    expense_date: expenseDateInput.value,
    note: noteInput.value.trim(),
  };

  const id = expenseIdInput.value;
  const method = id ? 'PUT' : 'POST';
  const url = id ? `/api/expenses/${id}` : '/api/expenses';

  try {
    const response = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    const data = await response.json();

    if (!response.ok) {
      showMessage(data.message || 'Lưu thất bại.', true);
      return;
    }

    showMessage(id ? 'Cập nhật thành công.' : 'Thêm mới thành công.');
    resetForm();
    await fetchExpenses();
  } catch (error) {
    showMessage('Có lỗi xảy ra khi lưu dữ liệu.', true);
  }
});

cancelEditButton.addEventListener('click', resetForm);

resetForm();
fetchExpenses();
