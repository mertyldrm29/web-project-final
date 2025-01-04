<template>
    <div class="search-container">
      <input
        type="text"
        class="search-input"
        placeholder="Ara"
      />
      <button class="search-button">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="icon"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <circle cx="11" cy="11" r="8"></circle>
          <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
        </svg>
      </button>
    </div>
  </template>
  
  <style scoped>
  .search-container {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 5px;
  }
  
  .search-input {
    padding: 10px 15px;
    border: 1px solid #ccc;
    border-radius: 50px; /* Oval şekil */
    outline: none;
    width: 300px;
    transition: border-color 0.3s ease;
  }
  
  .search-input:focus {
    border-color: #007bff; /* Odaklandığında mavi çerçeve */
  }
  
  .search-button {
    display: flex;
    align-items: center;
    justify-content: center;
    background: #000000;
    border: none;
    border-radius: 50%; /* Daire şeklinde buton */
    padding: 10px;
    margin-left: 5px;
    cursor: pointer;
  }
  
  .search-button .icon {
    width: 20px;
    height: 20px;
    color: white;
  }
  
  .search-button:hover {
    background: #2e2e2e; /* Daha koyu mavi */
  }
  </style>
  