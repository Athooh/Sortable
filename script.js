let heroes = [];  // Store the full dataset
let filteredHeroes = []; // Store filtered dataset for pagination and display

// Fetch data and initialize the table
const loadData = (fetchedHeroes) => {
  heroes = fetchedHeroes;
  applyURLState(); // Apply filters and detail view from the URL
};

fetch('https://rawcdn.githack.com/akabab/superhero-api/0.2.0/api/all.json')
  .then(response => response.json())
  .then(loadData);

// Displaying Data in a Table
const displayHeroes = (heroes) => {
  const tableBody = document.getElementById('hero-table-body');
  tableBody.innerHTML = ''; // Clear previous data

  heroes.forEach(hero => {
    // Generate Powerstats string to display in a single column
    const powerstats = `
      Intelligence: ${hero.powerstats.intelligence || 'N/A'}, 
      Strength: ${hero.powerstats.strength || 'N/A'}, 
      Speed: ${hero.powerstats.speed || 'N/A'}, 
      Durability: ${hero.powerstats.durability || 'N/A'}, 
      Power: ${hero.powerstats.power || 'N/A'}, 
      Combat: ${hero.powerstats.combat || 'N/A'}
    `;

    // Define each row of the table with the correct fields under corresponding table heads
    const row = `<tr>
      <td><img src="${hero.images.xs}" alt="${hero.name}"></td>
      <td>${hero.name}</td>
      <td>${hero.biography.fullName || 'N/A'}</td>
      <td>${powerstats}</td>
      <td>${hero.appearance.race || 'Unknown'}</td>
      <td>${hero.appearance.gender || 'Unknown'}</td>
      <td>${hero.appearance.height[1] || 'Unknown'}</td>
      <td>${hero.appearance.weight[1] || 'Unknown'}</td>
      <td>${hero.biography.placeOfBirth || 'Unknown'}</td>
      <td>${hero.biography.alignment || 'Neutral'}</td>
    </tr>`;
    tableBody.innerHTML += row;
  });

  addRowClickListeners();  // Enable row click for detailed view
};

// Pagination Logic
let currentPage = 1;
let pageSize = 20;

const paginateHeroes = (heroes) => {
  const start = (currentPage - 1) * pageSize;
  const end = start + pageSize;
  return heroes.slice(start, end);
};

// Function to handle pagination change (via <select>)
document.getElementById('page-size').addEventListener('change', (e) => {
  pageSize = parseInt(e.target.value);
  displayHeroes(paginateHeroes(filteredHeroes)); // Refresh page
  updateURL();  // Update URL to reflect the current state
});

// Search Functionality with handling of search field and custom operators
document.getElementById('search-box').addEventListener('input', (e) => {
  let searchTerm = e.target.value.trim().toLowerCase();
  const searchField = document.getElementById('search-field').value;
  const searchOperator = document.getElementById('search-operator').value;

  const quotedStringMatch = searchTerm.match(/^["'](.*?)["']$/);
  if (quotedStringMatch) {
    searchTerm = quotedStringMatch[1];
  }

  filteredHeroes = heroes.filter(hero => {
    const fieldValue = getColumnValue(hero, searchField).toLowerCase();

    switch (searchOperator) {
      case 'include':
        return fieldValue.includes(searchTerm);
      case 'exclude':
        return !fieldValue.includes(searchTerm);
      case 'fuzzy':
        return levenshteinDistance(searchTerm, fieldValue) <= 2;
      case 'equals':
        return fieldValue === searchTerm;
      case 'not-equals':
        return fieldValue !== searchTerm;
      case 'greater-than':
        return parseFloat(fieldValue) > parseFloat(searchTerm);
      case 'less-than':
        return parseFloat(fieldValue) < parseFloat(searchTerm);
      default:
        return fieldValue.includes(searchTerm);
    }
  });

  displayHeroes(paginateHeroes(filteredHeroes));
  updateURL();  // Update URL to reflect the current state
});

// Helper function to extract the correct column value, including nested fields
const getColumnValue = (hero, column) => {
  const keys = column.split('.'); // Handle nested fields like 'biography.fullName'
  let value = hero;

  // Traverse the nested fields using the keys
  keys.forEach(key => {
    value = value ? value[key] : '';
  });

  return value || ''; // Return the final value or empty string if not found
};

// Sorting Logic
let sortOrder = 'asc';
let sortedColumn = 'name';

const sortHeroes = (column) => {
  sortedColumn = column;

  // Update the sorting order (toggle between ascending and descending)
  sortOrder = sortOrder === 'asc' ? 'desc' : 'asc';

  // Sort heroes based on the selected column and order
  filteredHeroes.sort((a, b) => {
    let aValue = getColumnValue(a, column);
    let bValue = getColumnValue(b, column);

    if (aValue === null || aValue === undefined) return 1;
    if (bValue === null || bValue === undefined) return -1;

    // Handle numeric sorting
    if (!isNaN(aValue) && !isNaN(bValue)) {
      return sortOrder === 'asc' ? aValue - bValue : bValue - aValue;
    }

    // Handle alphabetical sorting
    return sortOrder === 'asc' ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue);
  });

  // Display sorted heroes
  displayHeroes(paginateHeroes(filteredHeroes));

  // Update table headers with sorting arrow
  updateSortIcons(column);
  updateURL();  // Update URL to reflect the current state
};

// Function to update sort icons on table headers
const updateSortIcons = (column) => {
  document.querySelectorAll('th').forEach(th => {
    th.classList.remove('asc', 'desc'); // Remove existing sort classes
    th.classList.add('sortable'); // Add sortable class to all headers
  });

  // Add the ascending/descending class to the currently sorted column
  const sortedHeader = document.querySelector(`th[data-column="${column}"]`);
  if (sortOrder === 'asc') {
    sortedHeader.classList.add('asc');
  } else {
    sortedHeader.classList.add('desc');
  }
};

// Add event listeners to table headers to enable sorting by any column
document.querySelectorAll('th').forEach(th => {
  th.addEventListener('click', () => sortHeroes(th.dataset.column));
});

// Detail View Logic: Open the modal and show the hero details
const showDetailView = (hero) => {
  document.getElementById('hero-detail-img').src = hero.images.lg; // Large image
  document.getElementById('hero-detail-name').innerText = hero.name;
  document.getElementById('hero-detail-fullname').innerText = `Full Name: ${hero.biography.fullName || 'N/A'}`;
  document.getElementById('hero-detail-stats').innerText = `Stats: Intelligence ${hero.powerstats.intelligence || 0}, Strength ${hero.powerstats.strength || 0}, Speed ${hero.powerstats.speed || 0}, Durability ${hero.powerstats.durability || 0}, Power ${hero.powerstats.power || 0}, Combat ${hero.powerstats.combat || 0}`;

  // Display the modal
  document.getElementById('hero-detail-modal').style.display = 'block';
  updateURL(hero.id); // Update URL to include the hero ID
};

// Close the modal
const closeDetailView = () => {
  document.getElementById('hero-detail-modal').style.display = 'none';
  updateURL(); // Remove hero ID from URL when modal is closed
};

// Add click event listeners for each row
const addRowClickListeners = () => {
  const rows = document.querySelectorAll('#hero-table-body tr');
  rows.forEach((row, index) => {
    row.addEventListener('click', () => showDetailView(filteredHeroes[index]));
  });
};

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
  const modal = document.getElementById('hero-detail-modal');
  if (event.target == modal) {
    modal.style.display = 'none';
    updateURL(); // Update URL when modal is closed
  }
};

// Update the URL to reflect the current search, sorting, or pagination state
const updateURL = (heroId = null) => {
  const searchTerm = document.getElementById('search-box').value;
  const searchField = document.getElementById('search-field').value;
  const sort = sortedColumn;
  const order = sortOrder;
  const page = currentPage;

  const url = new URL(window.location);
  url.searchParams.set('search', searchTerm);
  url.searchParams.set('field', searchField);
  url.searchParams.set('sort', sort);
  url.searchParams.set('order', order);
  url.searchParams.set('page', page);

  if (heroId) {
    url.searchParams.set('hero', heroId); // Set the hero ID in the URL
  } else {
    url.searchParams.delete('hero'); // Remove hero ID if modal is closed
  }

  history.pushState({}, '', url);
};

// Apply URL state on page load
const applyURLState = () => {
  const urlParams = new URLSearchParams(window.location.search);

  // Apply search filters
  const searchTerm = urlParams.get('search') || '';
  const searchField = urlParams.get('field') || 'name';
  const sort = urlParams.get('sort') || 'name';
  const order = urlParams.get('order') || 'asc';
  const heroId = urlParams.get('hero');

  document.getElementById('search-box').value = searchTerm;
  document.getElementById('search-field').value = searchField;
  sortOrder = order;
  sortedColumn = sort;

  if (heroId) {
    const hero = heroes.find(h => h.id == heroId);
    if (hero) {
      showDetailView(hero); // Open the modal with the hero details if in URL
    }
  }

  // Reapply filters after page load
  document.getElementById('search-box').dispatchEvent(new Event('input'));
};

// Levenshtein Distance for fuzzy matching
const levenshteinDistance = (a, b) => {
  const matrix = [];

  for (let i = 0; i <= b.length; i++) {
    matrix[i] = [i];
  }

  for (let j = 0; j <= a.length; j++) {
    matrix[0][j] = j;
  }

  for (let i = 1; i <= b.length; i++) {
    for (let j = 1; j <= a.length; j++) {
      if (b.charAt(i - 1) === a.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(matrix[i - 1][j - 1] + 1, // substitution
                               Math.min(matrix[i][j - 1] + 1, // insertion
                                        matrix[i - 1][j] + 1)); // deletion
      }
    }
  }

  return matrix[b.length][a.length];
};
