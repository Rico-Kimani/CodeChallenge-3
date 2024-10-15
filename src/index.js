// Your code here
const main = document.getElementById('main'); 
const buyTicketsButton = document.getElementById('buyTicketsButton');

fetch("http://localhost:3000/films")
  .then(response => response.json())
  .then(films => {
    films.forEach(film => {
      const title = document.createElement("h1");
      title.textContent = film.title;
      main.appendChild(title);

      const capacity = film.capacity;
      const ticketsSold = film.tickets_sold;
      const availableTickets = calculateAvailableTickets(capacity, ticketsSold);

      const ticketsInfo = document.createElement("p");
      ticketsInfo.textContent = `Available Tickets: ${availableTickets}`;
      main.appendChild(ticketsInfo);

      title.dataset.availableTickets = availableTickets;
    });
  })
  .catch(error => {
    console.error('Error fetching films:', error);
  });

function calculateAvailableTickets(capacity, ticketsSold) {
  return capacity - ticketsSold;
}

function buyTickets() {
  const filmTitles = document.querySelectorAll('#main h1');
  filmTitles.forEach(titleElement => {
    const availableTickets = parseInt(titleElement.dataset.availableTickets);

    if (availableTickets > 0) {
      console.log(`Buying 1 ticket for ${titleElement.textContent}`);
      titleElement.dataset.availableTickets = availableTickets - 1; 
    } else {
      console.log(`No tickets available for ${titleElement.textContent}`);
    }
  });
}

buyTicketsButton.addEventListener('click', buyTickets);