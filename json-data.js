// fetch('data.json')
//   .then((response) => response.json())
//   .then((data) => {
//     /// Path to the events array
//     const events = data.data.events.edges;

//     if (Array.isArray(events)) {
//       const eventsContainer = document.querySelector('.events-container'); /// Get the container

//       events.forEach((event) => {
//         const eventData = event.node; /// Access the event node
//         const eventHTML = `
//           <article class="card">
//             <h3>${eventData.name}</h3>
//             <p><strong>Date:</strong> ${new Date(
//               eventData.time_start
//             ).toLocaleString()}</p>
//             <p><strong>Location:</strong> ${eventData.location.name}, ${
//           eventData.location.address
//         }</p>
//             <img src="${
//               eventData.img
//             }" width="200" onerror="this.onerror=null;this.src='media/img/ALT_IMG.webp';">
//             <p><a href="${eventData.url}" target="_blank">More Info</a></p>
//           </article>
//         `;
//         eventsContainer.innerHTML += eventHTML;
//       });
//     } else {
//       console.error(
//         'Expected events to be an array, but it was:',
//         typeof events
//       );
//     }
//   })
//   .catch((error) => console.error('Error fetching data:', error));

// * onerror="this.style.display = 'none'"

// fetch('data.json')
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

        // Format Date as year/month/day
        const eventDate = eventData.time_start
          ? new Date(eventData.time_start).toLocaleDateString('en-CA') // 'en-CA' format is year/month/day
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
