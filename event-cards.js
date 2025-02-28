// ! ..........................Data fetching and displaying....................
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

        /// Format Date as year/month/day
        const eventDate = eventData.time_start
          ? new Date(eventData.time_start).toLocaleDateString('en-CA') /// 'en-CA' format is year/month/day
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
        const eventUrl = eventData.url || '#';
        const eventPrice = eventData.tickets_price
          ? `${eventData.tickets_price} ${eventData.tickets_currency || ''}`
          : 'Not available';

        return `
          <article class="card">
            <h3>${eventName}</h3>

            <img src="${eventImg}" alt="${eventName}" class="event-img" onerror="this.onerror=null;this.src='media/img/ALT_IMG.webp';">

            <p><img src="media/img/time.svg" class="event-icon"> ${eventDate} ${eventTime}</p>

            <p><img src="media/img/location.svg" class="event-icon"> ${eventLocation}</p>

            <p><img src="media/img/ticket.svg" class="event-icon"> ${eventPrice}</p>

            <p><a href="${eventUrl}" target="_blank">More Info</a></p>
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

//! ..........................Popup Card....................
document.addEventListener('DOMContentLoaded', () => {
  const eventsContainer = document.querySelector('.events-container');

  if (!eventsContainer) return;

  eventsContainer.addEventListener('click', (e) => {
    const card = e.target.closest('.card');
    if (!card) return;

    /// Create a wrapper that will cover the whole document
    const overlay = document.createElement('div');
    overlay.classList.add('popup-card-overlay');
    document.body.appendChild(overlay);

    /// Clone the card and add popup styles
    const popupCard = card.cloneNode(true);
    popupCard.classList.add('popup-card');

    /// Ensure the popup card itself is clickable
    popupCard.style.pointerEvents = 'auto';

    /// Add a close button
    const closeButton = document.createElement('button');
    closeButton.textContent = 'Close';

    closeButton.addEventListener('click', () => {
      /// Enable scrolling when closing the popup
      document.removeEventListener('wheel', preventScroll);
      document.removeEventListener('touchmove', preventScroll);
      document.removeEventListener('keydown', preventScroll);

      /// Remove the overlay and popup card
      overlay.remove();
      popupCard.remove();

      /// Reset pointer events on body so the page can be interacted with again
      document.body.style.pointerEvents = 'auto';
    });

    /// Function to prevent scrolling
    const preventScroll = (e) => {
      e.preventDefault();
    };

    /// Disable scrolling by preventing wheel, touchmove, and keydown events
    document.addEventListener('wheel', preventScroll, { passive: false });
    document.addEventListener('touchmove', preventScroll, { passive: false });
    document.addEventListener('keydown', preventScroll, { passive: false });

    popupCard.appendChild(closeButton);
    document.body.appendChild(popupCard);

    /// Disable pointer events on the rest of the page (outside of the popup)
    overlay.style.pointerEvents = 'all';

    /// Add pointer-events: none to the rest of the page
    document.body.style.pointerEvents = 'none';

    /// Allow interaction within the popup
    popupCard.addEventListener('click', (e) => {
      e.stopPropagation(); /// Prevent the click event from bubbling up to the overlay
    });

    /// Allow interaction within the popup by setting pointer-events to 'auto'
    popupCard.style.pointerEvents = 'auto';
  });
});
