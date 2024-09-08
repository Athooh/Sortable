
---

## **Superhero Dashboard**

The **Superhero Dashboard** is a web application that displays a table of superheroes with key information such as name, power stats, race, gender, height, weight, and more. Users can search, filter, and sort the data interactively. The dashboard includes advanced functionality, such as sortable columns, real-time filtering, pagination, and a detailed view of individual superheroes.

---

### **Table of Contents**
1. [Features](#features)
2. [Technologies Used](#technologies-used)
3. [Setup and Installation](#setup-and-installation)
4. [Usage](#usage)
5. [File Structure](#file-structure)
6. [Code Breakdown](#code-breakdown)
7. [Improvements](#improvements)
8. [Contributing](#contributing)
9. [License](#license)

---

### **Features**

- **Dynamic Table Display**: Displays data of superheroes fetched from an external JSON API.
- **Sortable Columns**: Users can sort by the following fields:
  - Name
  - Full Name
  - Powerstats (consolidated)
  - Height
  - Weight
  - Race
  - Gender
  - Place of Birth
  - Alignment
- **Real-time Search**: Users can search and filter superheroes by different fields such as Name, Full Name, Race, Gender, and Alignment.
- **Custom Search Operators**: Supports various operators such as "Include", "Exclude", "Equals", "Not Equals", "Greater Than", and "Less Than".
- **Pagination**: Allows users to select the number of results per page (10, 20, 50, 100, or All).
- **Detail View**: Clicking on a superhero row opens a modal with detailed information about the superhero, including a larger image.
- **Responsive Design**: The dashboard adapts to different screen sizes.
- **URL Syncing**: The search term, filters, and sort state are reflected in the URL, making it possible to share or bookmark specific filtered results.

---

### **Technologies Used**

- **HTML5**: For creating the structure of the web page.
- **CSS3**: For styling and making the design responsive.
- **JavaScript (ES6)**: For dynamic functionality, including fetching data, handling user interaction, and sorting/filtering data.
- **Fetch API**: To load superhero data from an external JSON source.
- **GitHub Pages** (for deployment, if applicable).

---

### **Setup and Installation**

#### **Prerequisites**
Before running this project, you should have the following installed:
- A modern web browser (e.g., Chrome, Firefox, Edge, etc.)
- A text editor (e.g., VSCode, Sublime, etc.) to view and edit the code

#### **Steps to Run the Project Locally**:

1. **Clone the Repository**:
   Open your terminal and run the following command:
   ```bash
   git clone https://github.com/Athooh/Sortable.git
   ```

2. **Navigate to the Project Directory**:
   ```bash
   cd Sortable
   ```

3. **Open the Project**:
   Open the `index.html` file in your browser:
   ```bash
   open index.html
   ```
   OR simply double-click on `index.html` to view it in the browser.

---

### **Usage**

#### **Search and Filter**
- Use the **Search Field** dropdown to select which superhero attribute you want to search by (Name, Full Name, Race, Gender, Alignment).
- Enter your search term in the input box, and the results will be filtered in real-time.
- Use the **Search Operator** dropdown to refine your search (e.g., Include, Exclude, Equals, etc.).

#### **Sorting**
- Click on any of the sortable column headers (e.g., Name, Powerstats, Height, etc.) to sort the data.
  - The first click will sort in **ascending** order.
  - A second click will sort in **descending** order.
- Only the headers with the **up/down arrow** symbols are sortable.

#### **Pagination**
- Select the number of superheroes to display per page using the **Page Size** dropdown.
- You can choose between 10, 20, 50, 100, or All results.

#### **Detail View**
- Click on any superhero row to open a detailed modal view that shows a larger image and more stats about the superhero.

---

### **File Structure**

```bash
superhero-dashboard/
│
├── index.html              # Main HTML file
├── styles.css              # Stylesheet for layout and design
├── script.js               # Main JavaScript file for dynamic functionality
└── README.md               # Documentation (this file)
```

---

### **Code Breakdown**

#### **1. Fetching Superhero Data**
In the `script.js` file, superhero data is fetched from an external API using the `fetch()` method:
```javascript
fetch('https://rawcdn.githack.com/akabab/superhero-api/0.2.0/api/all.json')
  .then(response => response.json())
  .then(loadData);
```

#### **2. Displaying Data**
The superhero data is dynamically populated into an HTML table:
```javascript
const displayHeroes = (heroes) => {
  const tableBody = document.getElementById('hero-table-body');
  tableBody.innerHTML = '';
  heroes.forEach(hero => {
    // Populate table with hero data
  });
};
```

#### **3. Sorting**
The columns specified are sortable, and clicking on the table headers will toggle between ascending and descending order:
```javascript
const sortHeroes = (column) => {
  filteredHeroes.sort((a, b) => {
    let aValue = getColumnValue(a, column);
    let bValue = getColumnValue(b, column);
    return sortOrder === 'asc' ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue);
  });
  sortOrder = sortOrder === 'asc' ? 'desc' : 'asc';
  displayHeroes(paginateHeroes(filteredHeroes));
};
```

#### **4. Detail View**
Clicking a superhero row will open a modal showing more detailed stats:
```javascript
const showDetailView = (hero) => {
  document.getElementById('hero-detail-img').src = hero.images.lg;
  document.getElementById('hero-detail-name').innerText = hero.name;
  // Additional hero details...
};
```

---

### **Improvements**

Potential future improvements for this project:
1. **Add Filters for Specific Powerstats**: Allow users to search or filter based on specific powerstats like Strength or Intelligence.
2. **Advanced Sorting for Multiple Columns**: Implement multi-column sorting.
3. **Dark/Light Theme Toggle**: Add a button to toggle between dark and light themes.
4. **Performance Optimization**: Implement lazy loading for large datasets.

---

### **Contributing**

Contributions are welcome! If you would like to contribute, please follow these steps:
1. Fork the repository.
2. Create a new branch (`git checkout -b feature/my-feature`).
3. Make your changes and commit them (`git commit -am 'Add new feature'`).
4. Push to the branch (`git push origin feature/my-feature`).
5. Create a new Pull Request.

---

### **License**

This project is licensed under the MIT License. See the `LICENSE` file for more information.

---
