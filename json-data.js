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

//! Popup Card
// document.addEventListener('DOMContentLoaded', () => {
//   const eventsContainer = document.querySelector('.events-container');

//   if (!eventsContainer) return;

//   eventsContainer.addEventListener('click', (e) => {
//     const card = e.target.closest('.card');
//     if (!card) return;

//     /// Clone the card and add popup styles
//     const popupCard = card.cloneNode(true);
//     popupCard.classList.add('popup-card');
//     popupCard.style.position = 'fixed';
//     popupCard.style.top = '50%';
//     popupCard.style.left = '50%';
//     popupCard.style.transform = 'translate(-50%, -50%)';
//     popupCard.style.zIndex = '9999';
//     popupCard.style.width = '80vw';
//     popupCard.style.maxWidth = '600px';
//     popupCard.style.padding = '2rem';

//     /// Add a close button
//     const closeButton = document.createElement('button');
//     closeButton.textContent = 'Close';
//     closeButton.style.display = 'block';
//     closeButton.style.marginTop = '20px';
//     closeButton.style.background = '#fff';
//     closeButton.style.border = 'none';
//     closeButton.style.padding = '0.5rem 1rem';
//     closeButton.style.cursor = 'pointer';
//     closeButton.style.borderRadius = '5px';
//     closeButton.style.width = '100%';
//     closeButton.style.textAlign = 'center';

//     closeButton.addEventListener('click', () => {
//       /// Enable scrolling when closing the popup
//       document.removeEventListener('wheel', preventScroll);
//       document.removeEventListener('touchmove', preventScroll);
//       document.removeEventListener('keydown', preventScroll);
//       popupCard.remove();
//     });

//     /// Function to prevent scrolling
//     const preventScroll = (e) => {
//       e.preventDefault();
//     };

//     /// Disable scrolling by preventing wheel, touchmove, and keydown events
//     document.addEventListener('wheel', preventScroll, { passive: false });
//     document.addEventListener('touchmove', preventScroll, { passive: false });
//     document.addEventListener('keydown', preventScroll, { passive: false });

//     popupCard.appendChild(closeButton);
//     document.body.appendChild(popupCard);
//   });
// });

document.addEventListener('DOMContentLoaded', () => {
  const eventsContainer = document.querySelector('.events-container');

  if (!eventsContainer) return;

  eventsContainer.addEventListener('click', (e) => {
    const card = e.target.closest('.card');
    if (!card) return;

    // Clone the card and add popup styles
    const popupCard = card.cloneNode(true);
    popupCard.classList.add('popup-card');

    // Add a close button
    const closeButton = document.createElement('button');
    closeButton.textContent = 'Close';

    closeButton.addEventListener('click', () => {
      // Enable scrolling when closing the popup
      document.removeEventListener('wheel', preventScroll);
      document.removeEventListener('touchmove', preventScroll);
      document.removeEventListener('keydown', preventScroll);
      popupCard.remove();
    });

    // Function to prevent scrolling
    const preventScroll = (e) => {
      e.preventDefault();
    };

    // Disable scrolling by preventing wheel, touchmove, and keydown events
    document.addEventListener('wheel', preventScroll, { passive: false });
    document.addEventListener('touchmove', preventScroll, { passive: false });
    document.addEventListener('keydown', preventScroll, { passive: false });

    popupCard.appendChild(closeButton);
    document.body.appendChild(popupCard);
  });
});
