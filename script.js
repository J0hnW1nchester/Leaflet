const menuToggle = document.querySelector('.toggle');
const menuShowcase = document.querySelector('.home-section-container');
const menu = document.querySelector('.menu');
const topButton = document.getElementById('scroll-button');
const social = document.querySelector('.social');
const homeFooter = document.querySelector('.home-footer');
const stickyHeader = document.querySelector('.sticky-header');

menuToggle.addEventListener('click', () => {
  menuToggle.classList.toggle('active');
  document.body.classList.toggle('menu-open'); /// Disables scrolling when menu is open
  menuShowcase.classList.toggle('active');
  menu.style.opacity = menuToggle.classList.contains('active') ? '1' : '0';
});

// /// Add event listener to window scroll
// window.addEventListener('scroll', function () {
//   /// Get the current scroll position
//   var scrollPosition = window.scrollY;

//   /// Set the threshold for the button to appear
//   var buttonThreshold = 150;

//   /// Set the threshold for the .social to disappear
//   var socialThreshold = 300;

//   /// Check if the user has scrolled past the threshold
//   if (scrollPosition >= buttonThreshold) {
//     /// Show the button
//     topButton.style.opacity = '1';
//   } else {
//     /// Hide the button
//     topButton.style.opacity = '0';
//   }

//   if (scrollPosition >= socialThreshold) {
//     /// Hide the .social and .footer
//     homeFooter.style.opacity = '0';
//     homeFooter.style.pointerEvents = 'none';

//     stickyHeader.style.opacity = '1';
//     stickyHeader.style.pointerEvents = 'auto';
//   } else {
//     /// Show the .social and .footer
//     homeFooter.style.opacity = '1';
//     homeFooter.style.pointerEvents = 'auto';

//     stickyHeader.style.opacity = '0';
//     stickyHeader.style.pointerEvents = 'none';
//   }
// });

window.addEventListener('scroll', function () {
  var scrollPosition = window.scrollY;
  var buttonThreshold = 150;
  var socialThreshold = 300;

  /// Show or hide the top button
  topButton.style.opacity = scrollPosition >= buttonThreshold ? '1' : '0';

  if (scrollPosition >= socialThreshold) {
    /// Get homeFooter's position to place stickyHeader in the same spot
    const homeFooterRect = homeFooter.getBoundingClientRect();
    const footerTop = homeFooterRect.top + window.scrollY;

    homeFooter.style.opacity = '0';
    homeFooter.style.pointerEvents = 'none';

    /// Position stickyHeader exactly where homeFooter is initially
    stickyHeader.style.opacity = '1';
    stickyHeader.style.pointerEvents = 'auto';
    stickyHeader.style.position = 'absolute';
    stickyHeader.style.top = `${footerTop}px`;
    stickyHeader.style.zIndex = '9999';

    /// Once scrolling past the homeFooter, fix the stickyHeader to the top of the screen
    if (scrollPosition >= footerTop) {
      stickyHeader.style.position = 'fixed';
      stickyHeader.style.top = '0';
      stickyHeader.style.zIndex = '9999';
    }
  } else {
    /// Reset to show homeFooter and hide stickyHeader
    homeFooter.style.opacity = '1';
    homeFooter.style.pointerEvents = 'auto';

    stickyHeader.style.opacity = '0';
    stickyHeader.style.pointerEvents = 'none';
  }
});

/// Add event listener to to top button click
document.getElementById('scroll-button').addEventListener('click', function () {
  /// Scroll to #home-section
  window.scrollTo({
    top: 0,
    behavior: 'smooth',
  });
});

/// Returns the hover effect to the download button after returning to the website
document.querySelector('.text a').addEventListener('click', function () {
  this.classList.add('hover-effect');
});

/// Get the background element and the scroll threshold
const background = document.querySelector('#bg-video');
const threshold = 300; /// Configure the amount of scroll for the blur to appear

/// Add an event listener to the window's scroll event
window.addEventListener('scroll', () => {
  const scrollPosition = window.scrollY;
  if (scrollPosition >= threshold) {
    background.classList.add('blur');
  } else {
    background.classList.remove('blur');
  }
});

// ! Leaflet logo disappearance/appearance
const toggleButton = document.querySelector('.toggle');
const homeSection = document.querySelector('#home-section');
const leafletLogo = document.querySelector('#leaflet-logo');

toggleButton.addEventListener('click', () => {
  homeSection.classList.toggle('toggled');
  
  if (homeSection.classList.contains('toggled')) {
    leafletLogo.style.opacity = '0'; /// Hide logo
    leafletLogo.style.pointerEvents = 'none'; /// Disable interactions (optional)
  } else {
    leafletLogo.style.opacity = '1'; /// Show logo
    leafletLogo.style.pointerEvents = 'auto';
  }
});