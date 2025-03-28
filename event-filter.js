document.addEventListener('DOMContentLoaded', function () {
  let scrollPosition = 0;
  let currentFilters = {}; // Object to store active filters (e.g., { country: 'Finland', city: 'Joensuu' })

  function lockScroll() {
    scrollPosition = window.scrollY;
    document.body.style.overflow = 'hidden';
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

  function preventDropdownScroll(event) {
    const dropdown = document.querySelector('.dropdown-menu');

    if (!dropdown) {
      event.preventDefault();
      return;
    }

    const isInsideDropdown = dropdown.contains(event.target);

    if (event.type === 'keydown') {
      const keys = ['ArrowUp', 'ArrowDown', 'Space', 'PageUp', 'PageDown'];
      if (!isInsideDropdown && keys.includes(event.key)) {
        event.preventDefault();
      }
      return;
    }

    if (!isInsideDropdown) {
      event.preventDefault();
      return;
    }

    // Trap scroll within the dropdown
    const scrollTop = dropdown.scrollTop;
    const scrollHeight = dropdown.scrollHeight;
    const clientHeight = dropdown.clientHeight;

    let deltaY = 0;
    if (event.type === 'wheel') {
      deltaY = event.deltaY;
    } else if (event.type === 'touchmove') {
      const currentY = event.touches[0].clientY;
      deltaY = dropdown._lastTouchY - currentY;
      dropdown._lastTouchY = currentY;
    }

    const isScrollingDown = deltaY > 0;
    const isAtBottom = scrollTop + clientHeight >= scrollHeight;
    const isAtTop = scrollTop <= 0;

    if ((isScrollingDown && isAtBottom) || (!isScrollingDown && isAtTop)) {
      event.preventDefault();
    }

    // 💡 NEW: Stop propagation to prevent bubbling to body
    event.stopPropagation();
  }

  function lockDropdownScroll() {
    document.addEventListener('wheel', preventDropdownScroll, {
      passive: false,
    });
    document.addEventListener('touchmove', preventDropdownScroll, {
      passive: false,
    });
    document.addEventListener('keydown', preventDropdownScroll, {
      passive: false,
    });
  }

  function unlockDropdownScroll() {
    document.removeEventListener('wheel', preventDropdownScroll);
    document.removeEventListener('touchmove', preventDropdownScroll);
    document.removeEventListener('keydown', preventDropdownScroll);
  }

  document.addEventListener(
    'touchstart',
    (e) => {
      const dropdown = document.querySelector('.dropdown-menu');
      if (dropdown && dropdown.contains(e.target)) {
        dropdown._lastTouchY = e.touches[0].clientY;
      }
    },
    { passive: false }
  );

  let allEvents = [];

  // Fetch events data
  fetch('visokiausi.json')
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json();
    })
    .then((data) => {
      allEvents = data?.data?.events?.edges || [];
      renderEvents(allEvents); // Render all events initially
    })
    .catch((error) => {
      console.error('Error fetching or processing data:', error.message);
      const eventsContainer = document.querySelector('.events-container');
      if (eventsContainer) {
        eventsContainer.innerHTML =
          '<p>Failed to load events. Please try again later.</p>';
      }
    });

  // Function to render events with animation
  function renderEvents(events) {
    const eventsContainer = document.querySelector('.events-container');
    if (!eventsContainer) return;

    // Apply fade-out animation to current event cards
    const currentCards = eventsContainer.querySelectorAll('.card');
    currentCards.forEach((card) => {
      card.classList.add('fade-out');
    });

    // Wait for fade-out to finish before changing the content
    setTimeout(() => {
      eventsContainer.innerHTML = ''; // Clear the old content

      // Sort the events by their start time (latest events first)
      events.sort((a, b) => {
        const timeA = new Date(a.node.time_start).getTime();
        const timeB = new Date(b.node.time_start).getTime();
        return timeB - timeA; // Latest first
      });

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
        card.setAttribute(
          'data-description',
          encodeURIComponent(
            eventData.description || 'No description available'
          )
        );
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

  // Function to filter events based on active filters
  function filterEvents() {
    let filteredEvents = allEvents;

    // Apply country filter if active
    if (currentFilters.country) {
      filteredEvents = filteredEvents.filter(
        (event) => event?.node?.location?.country === currentFilters.country
      );
    }

    // Apply city filter if active
    if (currentFilters.city) {
      filteredEvents = filteredEvents.filter(
        (event) => event?.node?.location?.city === currentFilters.city
      );
    }

    // Apply category filter if active
    if (currentFilters.category) {
      filteredEvents = filteredEvents.filter((event) => {
        const eventCategories = event?.node?.categories || [];
        return eventCategories.includes(currentFilters.category);
      });
    }

    renderEvents(filteredEvents);
  }

  // Function to create a dropdown menu
  function createDropdownMenu(items, onItemClick) {
    const dropdown = document.createElement('div');
    dropdown.classList.add('dropdown-menu');

    items.forEach((item) => {
      const dropdownItem = document.createElement('div');
      dropdownItem.classList.add('dropdown-item');
      dropdownItem.textContent = item;
      dropdownItem.addEventListener('click', () => onItemClick(item));
      dropdown.appendChild(dropdownItem);
    });

    return dropdown;
  }

  // Function to close the dropdown menu
  function closeDropdown() {
    const dropdown = document.querySelector('.dropdown-menu');
    if (dropdown) dropdown.remove();

    const overlay = document.querySelector('.dropdown-overlay');
    if (overlay) overlay.remove();

    unlockDropdownScroll(); // 🔓 Always unlock here too
  }

  // Function to create an overlay
  function createOverlay() {
    const overlay = document.createElement('div');
    overlay.classList.add('dropdown-overlay');
    document.body.appendChild(overlay);
  }

  // Track which dropdown is currently open
  let currentOpenDropdownButton = null;

  // Function to toggle dropdown for a button
  function toggleDropdown(button, items, onItemClick) {
    if (currentOpenDropdownButton === button) {
      closeDropdown();
      unlockDropdownScroll(); // 🔓 Unlock when closing
      currentOpenDropdownButton = null;
      return;
    }

    closeDropdown(); // Close any existing dropdown first
    unlockDropdownScroll(); // 🔓 Just in case

    const dropdown = createDropdownMenu(items, onItemClick);
    button.parentElement.appendChild(dropdown);

    createOverlay();
    lockDropdownScroll(); // 🔒 Lock scroll except for dropdown
    currentOpenDropdownButton = button;
  }

  // Event listeners for city, country, and category buttons
  const cityButton = document.getElementById('city');
  const countryButton = document.getElementById('country');
  const categoryButton = document.getElementById('category');
  const resetButton = document.getElementById('reset');

  if (cityButton) {
    cityButton.addEventListener('click', () => {
      console.log('City button clicked'); // Debugging

      // Get the currently filtered events (based on active filters)
      let filteredEvents = allEvents;

      // Apply country filter if active
      if (currentFilters.country) {
        filteredEvents = filteredEvents.filter(
          (event) => event?.node?.location?.country === currentFilters.country
        );
      }

      // Extract unique cities from the filtered events
      const cities = [
        ...new Set(filteredEvents.map((event) => event.node.location.city)),
      ];

      // Toggle the dropdown for the city button
      toggleDropdown(cityButton, cities, (city) => {
        currentFilters.city = city; // Update active city filter
        filterEvents(); // Apply all active filters
        closeDropdown();
        currentOpenDropdownButton = null;
      });
    });
  }

  if (countryButton) {
    countryButton.addEventListener('click', () => {
      console.log('Country button clicked'); // Debugging

      // Extract unique countries from the events data
      const countries = [
        ...new Set(allEvents.map((event) => event.node.location.country)),
      ];

      // Toggle the dropdown for the country button
      toggleDropdown(countryButton, countries, (country) => {
        currentFilters.country = country; // Update active country filter
        currentFilters.city = null; // Reset city filter when country changes
        filterEvents(); // Apply all active filters
        closeDropdown();
        currentOpenDropdownButton = null;
      });
    });
  }

  if (categoryButton) {
    categoryButton.addEventListener('click', () => {
      console.log('Category button clicked'); // Debugging

      // Extract unique categories from the events data
      const categories = [
        ...new Set(allEvents.flatMap((event) => event?.node?.categories || [])),
      ];

      // Toggle the dropdown for the category button
      toggleDropdown(categoryButton, categories, (category) => {
        currentFilters.category = category; // Update active category filter
        filterEvents(); // Apply all active filters
        closeDropdown();
        currentOpenDropdownButton = null;
      });
    });
  }

  if (resetButton) {
    resetButton.addEventListener('click', () => {
      console.log('Reset button clicked'); // Debugging
      currentFilters = {}; // Clear all filters
      renderEvents(allEvents); // Reset to show all events
      closeDropdown(); // Close any open dropdown
      currentOpenDropdownButton = null;
    });
  }

  // Close dropdown when clicking outside
  document.addEventListener('click', (e) => {
    if (
      !e.target.closest('.dropdown-menu') &&
      !e.target.closest('#city') &&
      !e.target.closest('#country') &&
      !e.target.closest('#category')
    ) {
      closeDropdown();
      currentOpenDropdownButton = null;
    }
  });

  // Popup card functionality
  const eventsContainer = document.querySelector('.events-container');
  if (eventsContainer) {
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

      // Close the popup when clicking outside the popup card
      overlay.addEventListener('click', () => {
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
    });
  }

  function preventBackgroundScroll(e) {
    const popupCard = document.querySelector('.popup-card');
    if (popupCard && !popupCard.contains(e.target)) {
      e.preventDefault();
    }
  }

  // Close dropdown when scrolling up and sticky header disappears
  window.addEventListener('scroll', function () {
    const stickyHeader = document.querySelector('.sticky-header');
    const dropdown = document.querySelector('.dropdown-menu');
    const overlay = document.querySelector('.dropdown-overlay');

    // Check if the sticky header is not visible
    if (stickyHeader && stickyHeader.style.opacity === '0') {
      // Close the dropdown and overlay if they exist
      if (dropdown) {
        dropdown.remove();
      }
      if (overlay) {
        overlay.remove();
      }
      currentOpenDropdownButton = null;
    }
  });
});

// !!!!!!!!!!!!!!!!!!!!!!!!!!!
