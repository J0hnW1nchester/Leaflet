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
//             }" onerror="this.style.display = 'none'" width="200">
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

// ! .......................................................

fetch('data.json')
  .then((response) => response.json())
  .then((data) => {
    /// Path to the events array
    const events = data.data.events.edges;

    if (Array.isArray(events)) {
      const eventsContainer = document.querySelector('.events-container'); /// Get the container

      events.forEach((event) => {
        const eventData = event.node; /// Access the event node
        const eventHTML = `
          <article class="card">
          
            <h3>${eventData.name}</h3>
            
            <p><strong>Date:</strong> ${new Date(
              eventData.time_start
            ).toLocaleString()}</p>   
            
            <img src="${
              eventData.img
            }" onerror="this.style.display = 'none'" width="200">
            
            <p><a href="${eventData.url}" target="_blank">More Info</a></p>
          </article>
        `;
        eventsContainer.innerHTML += eventHTML;
      });
    } else {
      console.error(
        'Expected events to be an array, but it was:',
        typeof events
      );
    }
  })
  .catch((error) => console.error('Error fetching data:', error));
