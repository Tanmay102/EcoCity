// Function to increase points
function increasePoints(points) {
    if (localStorage.getItem('points')) {
      let currentPoints = parseInt(localStorage.getItem('points'));
      currentPoints += points;
      localStorage.setItem('points', currentPoints);
    } else {
      localStorage.setItem('points', points);
    }
  }
  
  // Function to get total points
  function getTotalPoints() {
    if (localStorage.getItem('points')) {
      return parseInt(localStorage.getItem('points'));
    } else {
      return 0;
    }
  }
  
  // Your main code here
  let isButtonClicked = false;
  let isDropdownClicked = false;
  let pointValue = 0;
  
  // Get a reference to the submit button
  const submitButton = document.getElementById('submitButton');
  const dropdown = document.getElementsByClassName('dropdown-content');
  const pointValueElement = document.getElementById('pointValue');
  
  // Add a click event listener to the submit button
  submitButton.addEventListener('click', function () {
    // Set the flag to true when the button is clicked
    isButtonClicked = true;
  
    // Check all dropdowns for non-"Pick one" options and update pointValue
    for (let i = 0; i < dropdown.length; i++) {
      if (dropdown[i].value !== 'Pick one') {
        pointValue++;
      }
    }
  
    pointValueElement.textContent = pointValue;
    alert(`Task successfully completed!`);
  });  