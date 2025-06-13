async function loadBooks() {
    const title = document.getElementById('filter_title').value;
    const author = document.getElementById('filter_author').value;
    const category = document.getElementById('filter_category').value;

    let url = '/api/books';
    const params = [];

    if (title) params.push(`title=${encodeURIComponent(title)}`);
    if (author) params.push(`author=${encodeURIComponent(author)}`);
    if (category) params.push(`category=${encodeURIComponent(category)}`);

    if (params.length > 0) {
        url += `?${params.join('&')}`;
    }

    try {
        const res = await fetch(url);
        const books = await res.json();

        books.sort((a, b) => a.title.localeCompare(b.title));

        const grouped = {};
        books.forEach(book => {
            const letter = book.title.charAt(0).toUpperCase();
            if (!grouped[letter]) grouped[letter] = [];
            grouped[letter].push(book);
        });

        const container = document.getElementById('book_list');
        container.innerHTML = '';

        Object.keys(grouped).sort().forEach(letter => {
            const section = document.createElement('section');
            section.classList.add('book-letter-section');

            const header = document.createElement('h2');
            header.textContent = letter;
            section.appendChild(header);

            const grid = document.createElement('div');
            grid.classList.add('book-grid');

            grouped[letter].forEach(book => {
                const card = document.createElement('div');
                card.classList.add('book-card');

                card.innerHTML = `
                    <h3>${book.title}</h3>
                    <p>${book.author}</p>
                    <p><em>${book.category}</em></p>
                    <p>${book.content}</p>
                    <button onclick="showDetails(${book.id})">Szczegóły</button>
                `;

                grid.appendChild(card);
            });

            section.appendChild(grid);
            container.appendChild(section);
        });

    } catch (err) {
        console.error(err);
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

function getItemWidth() {
    const carousel = document.getElementById('latest_carousel');
    const item = carousel?.querySelector('.carousel-item');
    if (!item) return 300;
    const style = window.getComputedStyle(item);
    const width = item.offsetWidth;
    const marginLeft = parseInt(style.marginLeft) || 0;
    const marginRight = parseInt(style.marginRight) || 0;
    return width + marginLeft + marginRight + 20; // +gap
}

function scrollRight() {
    const carousel = document.getElementById('latest_carousel');
    const scrollAmount = getItemWidth();
    const maxScroll = carousel.scrollWidth - carousel.clientWidth;

    if (carousel.scrollLeft + scrollAmount >= maxScroll - 5) {
        // wróć na początek
        carousel.scrollTo({ left: 0, behavior: 'smooth' });
    } else {
        carousel.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
}

function scrollLeft() {
    const carousel = document.getElementById('latest_carousel');
    const scrollAmount = getItemWidth();

    if (carousel.scrollLeft <= 0) {
        // skocz na koniec
        carousel.scrollTo({ left: carousel.scrollWidth, behavior: 'smooth' });
    } else {
        carousel.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
    }
}


function initCarousel() {
    const leftArrow = document.getElementById('carousel_left');
    const rightArrow = document.getElementById('carousel_right');

    // Zamiana miejscami funkcji:
    leftArrow.addEventListener('click', scrollRight);  // ← teraz przesuwa W PRAWO
    rightArrow.addEventListener('click', scrollLeft);  // → teraz przesuwa W LEWO
}



async function loadLatestBooks() {
    try {
        const res = await fetch('/api/books/latest');
        const latest = await res.json();

        const carousel = document.getElementById('latest_carousel');
        if (!carousel) return;

        carousel.innerHTML = ''; // czyść stare

        latest.forEach(book => {
            const item = document.createElement('div');
            item.className = 'carousel-item';
            item.innerHTML = `
                <strong>${book.title}</strong><br>
                <span>${book.author}</span>
            `;
            item.addEventListener('click', () => {
                window.location.href = `book.html?id=${book.id}`;
            });
            carousel.appendChild(item);
        });
        carousel.addEventListener('mouseenter', stopAutoScroll);
        carousel.addEventListener('mouseleave', startAutoScroll);
    } catch (err) {
        console.error('Błąd ładowania nowości:', err);
    }
}
let autoScrollInterval;

function startAutoScroll() {
    autoScrollInterval = setInterval(() => {
        scrollRight();
    }, 3000); // co 3 sekundy
}

function stopAutoScroll() {
    clearInterval(autoScrollInterval);
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
            <button class="cta" onclick="goToLogin()">Zaloguj się</button>
        `;
        return;
    }

    try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        const username = payload.username;
        const role = payload.role;

        statusDiv.textContent = `Zalogowany jako: ${username}`;
        logoutDiv.innerHTML = `<button class="cta" onclick="logout()">Wyloguj się</button>`;

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
            <button class="cta" onclick="goToLogin()">Zaloguj się</button>
        `;
    }
}

function goToLogin() {
    window.location.href = "auth.html";
}

function logout() {
    localStorage.removeItem('token');
    window.location.href = "index.html";
}

window.addEventListener('DOMContentLoaded', () => {
    checkLoginStatus();

    if (document.getElementById('book_list')) {
        loadBooks();
    }

    if (document.getElementById('latest_carousel')) {
        loadLatestBooks().then(() => {
            initCarousel();
            startAutoScroll();
        });
    }
});

