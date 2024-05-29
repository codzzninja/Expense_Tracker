function loadTransactions() {
    const storedTransactions = JSON.parse(localStorage.getItem('transactions'));
    return storedTransactions || [];
}

function saveTransactions(transactions) {
    localStorage.setItem('transactions', JSON.stringify(transactions));
}

function addTransaction(e) {
    e.preventDefault();
    const text = document.getElementById('text').value;
    const amount = +document.getElementById('amount').value;
    const datetime = document.getElementById('datetime').value;

    if (text.trim() === '' || isNaN(amount) || datetime.trim() === '') {
        alert('Please fill in all fields with valid data');
        return;
    }

    const transaction = {
        id: generateID(),
        text,
        amount,
        datetime: new Date(datetime)
    };

    transactions.push(transaction);
    addTransactionDOM(transaction);
    updateValues();

    saveTransactions(transactions);

    document.getElementById('text').value = '';
    document.getElementById('amount').value = '';
    document.getElementById('datetime').value = '';
}

function generateID() {
    return Math.floor(Math.random() * 1000000);
}

function addTransactionDOM(transaction) {
    const sign = transaction.amount < 0 ? '-' : '+';
    const item = document.createElement('li');

    item.classList.add(transaction.amount < 0 ? 'minus' : 'plus');
    item.innerHTML = `
        ${transaction.text} <span>${sign}${Math.abs(transaction.amount)}</span>
        <small>${transaction.datetime.toLocaleString()}</small>
        <button class="delete-btn" onclick="removeTransaction(${transaction.id})">x</button>
    `;

    document.getElementById('transaction-list').appendChild(item);
}

function updateValues() {
    const amounts = transactions.map(transaction => transaction.amount);

    const total = amounts.reduce((acc, item) => acc + item, 0).toFixed(2);
    const income = amounts.filter(item => item > 0).reduce((acc, item) => acc + item, 0).toFixed(2);
    const expense = (amounts.filter(item => item < 0).reduce((acc, item) => acc + item, 0) * -1).toFixed(2);

    document.getElementById('balance').innerText = total;
    document.getElementById('money-plus').innerText = income;
    document.getElementById('money-minus').innerText = expense;
}

function removeTransaction(id) {
    transactions = transactions.filter(transaction => transaction.id !== id);
    init(); 
}

function init() {
    document.getElementById('transaction-list').innerHTML = ''; 
    transactions.forEach(addTransactionDOM); 
    updateValues();
}

document.getElementById('transaction-form').addEventListener('submit', addTransaction);

let transactions = loadTransactions();

init();
