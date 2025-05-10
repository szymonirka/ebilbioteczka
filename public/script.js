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
        document.getElementById('output').textContent = 'Błąd ładowania książek';
    }
}

async function showDetails(bookId) {
    try {
        const res = await fetch(`/api/books/${bookId}`);
        const book = await res.json();

        window.location.href = `book.html?id=${bookId}`;
    } catch (err) {
        alert('Nie udało się pobrać szczegółów książki');
    }
}

function checkLoginStatus() {
    const token = localStorage.getItem('token');
    const statusDiv = document.getElementById('user_status');
    const logoutDiv = document.getElementById('logout_button');
    const adminLinkDiv = document.getElementById('admin_panel_link');
    const userActionsDiv = document.getElementById('user_actions'); // nowy div

    if (!token) {
        statusDiv.textContent = 'Nie jesteś zalogowany';
        logoutDiv.innerHTML = '';
        adminLinkDiv.innerHTML = '';
        userActionsDiv.innerHTML = `
            <button onclick="goToLogin()">Zaloguj się</button>
        `;
        return;
    }

    try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        const username = payload.username;
        const role = payload.role;

        statusDiv.textContent = `Zalogowany jako: ${username}`;
        logoutDiv.innerHTML = `<button onclick="logout()">Wyloguj się</button>`;

        if (role === 'admin') {
            adminLinkDiv.innerHTML = `<a href="admin.html">Panel Administratora</a>`;
        } else {
            adminLinkDiv.innerHTML = '';
        }

        userActionsDiv.innerHTML = '';

    } catch (err) {
        console.error('Błąd dekodowania tokena:', err);
        statusDiv.textContent = 'Błąd odczytu loginu';
        logoutDiv.innerHTML = '';
        adminLinkDiv.innerHTML = '';
        userActionsDiv.innerHTML = `
            <button onclick="goToLogin()">Zaloguj się</button>
        `;
    }
}

function goToLogin() {
    window.location.href = "auth.html";
}

function logout() {
    localStorage.removeItem('token');
    window.location.reload();
}

window.addEventListener('DOMContentLoaded', () => {
    checkLoginStatus();
    loadBooks();
});
