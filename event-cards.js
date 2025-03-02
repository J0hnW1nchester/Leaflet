let scrollPosition = 0;

function lockScroll() {
  scrollPosition = window.scrollY;
  document.body.style.overflow = 'hidden'; /// Removes the background when popup card appears
  document.body.style.position = 'fixed';
  document.body.style.width = '100%';
  document.body.style.top = `-${scrollPosition}px`;
}

function unlockScroll() {
  document.body.style.overflow = '';
  document.body.style.position = '';
  document.body.style.width = '';
  document.body.style.top = '';
  window.scrollTo({ top: scrollPosition, behavior: 'instant' });
}

fetch('data.json')
  .then((response) => {
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
  })
  .then((data) => {
    const events = data?.data?.events?.edges;

    if (!Array.isArray(events)) {
      throw new Error('Invalid data format: events is not an array');
    }

    const eventsContainer = document.querySelector('.events-container');
    if (!eventsContainer) {
      throw new Error('No .events-container element found in the DOM');
    }

    eventsContainer.innerHTML = events
      .map((event) => {
        const eventData = event?.node;
        if (!eventData) return '';

        const eventName = eventData.name || 'Unnamed Event';
        const eventDate = eventData.time_start
          ? new Date(eventData.time_start).toLocaleDateString('en-CA')
          : 'Date not available';
        const eventTime = eventData.time_start
          ? new Date(eventData.time_start).toLocaleTimeString([], {
              hour: '2-digit',
              minute: '2-digit',
              hour12: false,
            })
          : 'Time not available';
        const eventLocation = eventData.location
          ? `${eventData.location.name || 'Location unknown'}, ${
              eventData.location.address || 'Address unknown'
            }`
          : 'Location not available';
        const eventImg = eventData.img || 'media/img/ALT_IMG.webp';
        const eventPrice = eventData.tickets_price
          ? `${eventData.tickets_price} ${eventData.tickets_currency || ''}`
          : 'Not available';

        return `
          <article class="card" data-description="${encodeURIComponent(
            eventData.description || 'No description available'
          )}" data-url="${eventData.url || '#'}">
            <h3>${eventName}</h3>
            <img src="${eventImg}" alt="${eventName}" class="event-img" onerror="this.onerror=null;this.src='media/img/ALT_IMG.webp';">
            <p><img src="media/img/time.svg" class="event-icon"> ${eventDate} ${eventTime}</p>
            <p><img src="media/img/location.svg" class="event-icon"> ${eventLocation}</p>
            <p><img src="media/img/ticket.svg" class="event-icon"> ${eventPrice}</p>
          </article>
        `;
      })
      .join('');
  })
  .catch((error) => {
    console.error('Error fetching or processing data:', error.message);
    const eventsContainer = document.querySelector('.events-container');
    if (eventsContainer) {
      eventsContainer.innerHTML =
        '<p>Failed to load events. Please try again later.</p>';
    }
  });

document.addEventListener('DOMContentLoaded', () => {
  const eventsContainer = document.querySelector('.events-container');
  if (!eventsContainer) return;

  eventsContainer.addEventListener('click', (e) => {
    const card = e.target.closest('.card');
    if (!card) return;

    const description = decodeURIComponent(
      card.getAttribute('data-description')
    );
    const eventUrl = card.getAttribute('data-url');

    // Create overlay and popup card
    const overlay = document.createElement('div');
    overlay.classList.add('popup-card-overlay');
    document.body.appendChild(overlay);

    const popupCard = card.cloneNode(true);
    popupCard.classList.add('popup-card'); // Add the base popup class

    // Add the description container
    const descriptionContainer = document.createElement('div');
    descriptionContainer.classList.add('description-container');
    descriptionContainer.innerHTML = `<h4>Description:</h4><p>${description}</p>`;

    // Add the More Info link
    const moreInfoLink = document.createElement('p');
    moreInfoLink.innerHTML = `<a href="${eventUrl}" target="_blank">More Info</a>`;

    // Add the Close button
    const closeButton = document.createElement('button');
    closeButton.textContent = 'Close';

    closeButton.addEventListener('click', () => {
      popupCard.classList.add('fadeOut'); // Apply the fade-out class to trigger smooth disappearance

      // Wait for the transition to end before removing elements
      popupCard.addEventListener(
        'transitionend',
        () => {
          overlay.remove();
          popupCard.remove();
          unlockScroll();
          document.removeEventListener('wheel', preventBackgroundScroll);
          document.removeEventListener('touchmove', preventBackgroundScroll);
        },
        { once: true }
      ); // Ensure this only runs once per transition
    });

    // Append the description, link, and close button
    popupCard.appendChild(descriptionContainer);
    popupCard.appendChild(moreInfoLink);
    popupCard.appendChild(closeButton);
    document.body.appendChild(popupCard);

    // Add the 'show' class to trigger the popup entry animation
    setTimeout(() => {
      popupCard.classList.add('show'); // This triggers the transition (fade in + scale up)
    }, 10); // A small timeout to ensure the element is rendered before the class is added

    // Lock scroll
    lockScroll();

    // Prevent background scroll
    document.addEventListener('wheel', preventBackgroundScroll, {
      passive: false,
    });
    document.addEventListener('touchmove', preventBackgroundScroll, {
      passive: false,
    });
  });
});

function preventBackgroundScroll(e) {
  const popupCard = document.querySelector('.popup-card');
  if (popupCard && !popupCard.contains(e.target)) {
    e.preventDefault();
  }
}

// !............................. Event filtering .......................
let allEvents = [];

fetch('data.json')
  .then((response) => {
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
  })
  .then((data) => {
    allEvents = data?.data?.events?.edges || [];
    renderEvents(allEvents);
  })
  .catch((error) => {
    console.error('Error fetching or processing data:', error.message);
    document.querySelector('.events-container').innerHTML =
      '<p>Failed to load events. Please try again later.</p>';
  });

// Function to render events with animation
function renderEvents(events) {
  const eventsContainer = document.querySelector('.events-container');
  const currentCards = eventsContainer.querySelectorAll('.card');

  // Apply fade-out animation to current event cards
  currentCards.forEach((card) => {
    card.classList.add('fade-out');
  });

  // Wait for fade-out to finish before changing the content
  setTimeout(() => {
    eventsContainer.innerHTML = ''; // Clear the old content

    // Add the new events with fade-in animation
    events.forEach((event) => {
      const eventData = event?.node;
      if (!eventData) return;

      const eventName = eventData.name || 'Unnamed Event';
      const eventDate = eventData.time_start
        ? new Date(eventData.time_start).toLocaleDateString('en-CA')
        : 'Date not available';
      const eventTime = eventData.time_start
        ? new Date(eventData.time_start).toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
            hour12: false,
          })
        : 'Time not available';
      const eventLocation = eventData.location
        ? `${eventData.location.name || 'Location unknown'}, ${
            eventData.location.address || 'Address unknown'
          }`
        : 'Location not available';
      const eventImg = eventData.img || 'media/img/ALT_IMG.webp';
      const eventPrice = eventData.tickets_price
        ? `${eventData.tickets_price} ${eventData.tickets_currency || ''}`
        : 'Not available';

      const card = document.createElement('article');
      card.classList.add('card');
      card.setAttribute('data-description', encodeURIComponent(eventData.description || 'No description available'));
      card.setAttribute('data-url', eventData.url || '#');
      card.innerHTML = `
        <h3>${eventName}</h3>
        <img src="${eventImg}" alt="${eventName}" class="event-img" onerror="this.onerror=null;this.src='media/img/ALT_IMG.webp';">
        <p><img src="media/img/time.svg" class="event-icon"> ${eventDate} ${eventTime}</p>
        <p><img src="media/img/location.svg" class="event-icon"> ${eventLocation}</p>
        <p><img src="media/img/ticket.svg" class="event-icon"> ${eventPrice}</p>
      `;
      eventsContainer.appendChild(card);

      // Add fade-in class to newly added cards
      setTimeout(() => {
        card.classList.add('fade-in');
      }, 10); // Small timeout to ensure the class is applied after the card is appended
    });
  }, 500); // Wait for fade-out animation to complete before adding new events
}

// Event listeners for city buttons
document
  .getElementById('vilnius')
  .addEventListener('click', () => filterEventsByCity('Vilnius'));
document
  .getElementById('kaunas')
  .addEventListener('click', () => filterEventsByCity('Kaunas'));
document
  .getElementById('klaipeda')
  .addEventListener('click', () => filterEventsByCity('Klaipėda'));
document
  .getElementById('reset')
  .addEventListener('click', () => renderEvents(allEvents));

// Function to filter events by city
function filterEventsByCity(city) {
  const filteredEvents = allEvents.filter(
    (event) => event?.node?.location?.city === city
  );
  renderEvents(filteredEvents);
}
