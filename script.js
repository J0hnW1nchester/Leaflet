const menuToggle = document.querySelector('.toggle');
const menuShowcase = document.querySelector('.home-section-container');
const menu = document.querySelector('.menu');
const topButton = document.getElementById('scroll-button');
const social = document.querySelector('.social');

menuToggle.addEventListener('click', () => {
  menuToggle.classList.toggle('active');
  document.body.classList.toggle(
    'menu-open'
  ); /// Disables scrolling when menu is open
  menuShowcase.classList.toggle('active');
  menu.style.opacity = menuToggle.classList.contains('active') ? '1' : '0';
});

/// Add event listener to window scroll
window.addEventListener('scroll', function () {
  /// Get the current scroll position
  var scrollPosition = window.scrollY;

  /// Set the threshold for the button to appear
  var buttonThreshold = 150;

  /// Set the threshold for the .social to disappear
  var socialThreshold = 300;

  /// Check if the user has scrolled past the threshold
  if (scrollPosition >= buttonThreshold) {
    /// Show the button
    topButton.style.opacity = '1';
  } else {
    /// Hide the button
    topButton.style.opacity = '0';
  }

  if (scrollPosition >= socialThreshold) {
    /// Hide the .social
    social.style.opacity = '0';
  } else {
    /// Show the .social
    social.style.opacity = '1';
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
