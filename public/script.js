let token = '';

async function register() {
    const username = document.getElementById('reg_username').value;
    const password = document.getElementById('reg_password').value;

    try {
        const res = await fetch('/api/auth/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })
        });
        const data = await res.json();
        if (res.ok) {
            document.getElementById('output').textContent = `✅ Rejestracja udana! Witaj, ${username}.`;
        } else {
            document.getElementById('output').textContent = `❌ Rejestracja nieudana: ${data.message || "Nieznany błąd"}`;
        }
    } catch (err) {
        document.getElementById('output').textContent = '❌ Błąd połączenia z serwerem';
    }
}

async function login() {
    const username = document.getElementById('log_username').value;
    const password = document.getElementById('log_password').value;

    try {
        const res = await fetch('/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })
        });

        const data = await res.json();

        if (res.ok && data.token) {
            token = data.token;
            document.getElementById('output').textContent = '✅ Zalogowano pomyślnie';
        } else {
            document.getElementById('output').textContent = '❌ Błędne dane logowania';
        }
    } catch (err) {
        document.getElementById('output').textContent = '❌ Wystąpił błąd logowania';
    }
}

async function loadBooks() {
    const title = document.getElementById('filter_title').value;
    const author = document.getElementById('filter_author').value;

    let url = '/api/books';
    const params = [];

    if (title) params.push(`title=${encodeURIComponent(title)}`);
    if (author) params.push(`author=${encodeURIComponent(author)}`);

    if (params.length > 0) {
        url += `?${params.join('&')}`;
    }

    try {
        const res = await fetch(url);
        const books = await res.json();

        const list = document.getElementById('book_list');
        list.innerHTML = '';

        books.forEach(book => {
            const li = document.createElement('li');
            li.innerHTML = `<strong>${book.title}</strong> – ${book.author}
                <button onclick="showDetails(${book.id})">Szczegóły</button>`;
            list.appendChild(li);
        });
    } catch (err) {
        document.getElementById('output').textContent = '❌ Błąd ładowania książek';
    }
}

async function showDetails(bookId) {
    try {
        const res = await fetch(`/api/books/${bookId}`);
        const book = await res.json();

        alert(`📘 ${book.title}\nAutor: ${book.author}`);
    } catch (err) {
        alert('❌ Nie udało się pobrać szczegółów książki');
    }
}

window.addEventListener('DOMContentLoaded', () => {
    loadBooks();
});
