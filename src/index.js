document.addEventListener('DOMContentLoaded', () => {
    const cinemaList = document.getElementById('films');
    let cinemaData = [];

    function retrieveMoviesFromDB() {
        fetch('db.json')
            .then(response => {
                if (!response.ok) {
                    throw new Error('Error fetching movies from db.json');
                }
                return response.json();
            })
            .then(data => {
                cinemaData = data.films;
                viewMovies();
            })
            .catch(error => {
                console.error('Error fetching movies from db.json:', error);
                showError('Error loading movie data');
            });
    }

    function viewMovies() {
        cinemaList.innerHTML = ''; // Clear existing movies
        cinemaData.forEach(cinema => {
            const listItem = createMovieItem(cinema);
            cinemaList.appendChild(listItem);
        });
    }

    function createMovieItem(cinema) {
        const listItem = document.createElement('li');
        listItem.textContent = cinema.title;
        listItem.dataset.cinemaId = cinema.id;
        listItem.classList.add('movie', 'item');

        // Add click event listener for showing details
        listItem.addEventListener('click', () => updateCinemaDetails(cinema.id));

        // Create and add delete button
        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Delete';
        deleteButton.classList.add('delete-button');
        deleteButton.onclick = (event) => {
            event.stopPropagation(); // Prevent triggering the list item's click event
            deleteMovie(cinema.id);
        };

        // Append delete button to list item
        listItem.appendChild(deleteButton);

        return listItem;
    }

    function deleteMovie(cinemaId) {
        // Remove the movie from the cinemaData array
        cinemaData = cinemaData.filter(cinema => cinema.id !== cinemaId);
        // Update the view
        viewMovies();
    }

    function updateCinemaDetails(cinemaId) {
        const cinema = cinemaData.find(c => c.id === cinemaId);
        if (!cinema) return;

        const availableTickets = cinema.capacity - cinema.tickets_sold;
        const buyTicketButton = document.getElementById('buy-ticket');

        buyTicketButton.textContent = availableTickets > 0 ? 'Buy Ticket' : 'Sold Out';
        buyTicketButton.classList.toggle('disabled', availableTickets === 0);
        buyTicketButton.onclick = () => {
            if (availableTickets > 0) {
                buyTicket(cinema);
            }
        };

        displayCinemaDetails(cinema);
    }

    function buyTicket(cinema) {
        cinema.tickets_sold++;
        updateTicketCount(cinema.id);
        updateCinemaDetails(cinema.id);
    }

    function updateTicketCount(cinemaId) {
        const cinema = cinemaData.find(c => c.id === cinemaId);
        const availableTickets = cinema.capacity - cinema.tickets_sold;
        document.getElementById('ticket-num').textContent = availableTickets;
    }

    function displayCinemaDetails(cinema) {
        document.getElementById('title').textContent = cinema.title;
        document.getElementById('runtime').textContent = `${cinema.runtime} minutes`;
        document.getElementById('film-info').textContent = cinema.description;
        document.getElementById('showtime').textContent = cinema.showtime;
        document.getElementById('poster').src = cinema.poster;
        document.getElementById('poster').alt = `Poster for ${cinema.title}`;
        updateTicketCount(cinema.id);
    }

    function showError(message) {
        const errorMessage = document.createElement('div');
        errorMessage.textContent = message;
        errorMessage.classList.add('ui', 'negative', 'message');
        document.body.appendChild(errorMessage);
        setTimeout(() => errorMessage.remove(), 5000);
    }

    retrieveMoviesFromDB();
});