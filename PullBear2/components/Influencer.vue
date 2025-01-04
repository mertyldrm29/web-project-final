<template>
    <div class="influencers-container">
      <div 
        v-for="influencer in influencers" 
        :key="influencer.id" 
        class="influencer-item"
      >
        <a :href="influencer.url" target="_blank" rel="noopener noreferrer">
          <img 
            :src="influencer.image" 
            :alt="influencer.name" 
            class="influencer-image" />
        </a>
        <h3 class="influencer-name">{{ influencer.name }}</h3>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    data() {
      return {
        influencers: [
          {
            id: 1,
            image: "https://static.pullandbear.net/assets/public/aba8/fdc4/74714520b1b2/89519d35fddc/carlottabaroloimage1729783244003/carlottabaroloimage1729783244003.jpg?ts=1729784328715&w=650&f=auto",
            name: "@carlottabarolo",
            url: "https://www.instagram.com/carlottabarolo/",
          },
          {
            id: 2,
            image: "https://static.pullandbear.net/assets/public/827b/6ea2/f9d34781a1a0/c8829558466a/pullandbearimage1729783237481/pullandbearimage1729783237481.jpg?ts=1729783571712&w=650&f=auto",
            name: "@giuliabeernardii",
            url: "https://www.instagram.com/giuliabeernardii",
          },
          {
            id: 3,
            image: "https://static.pullandbear.net/assets/public/ed99/1ad7/5d984b47abb6/6bd48d7eaf49/pullandbearimage1729783228676/pullandbearimage1729783228676.jpg?ts=1729784023252&w=650&f=auto",
            name: "@ciaosonojuliann",
            url: "https://www.instagram.com/ciaosonojuliann",
          },
          {
            id: 4,
            image: "https://static.pullandbear.net/assets/public/323b/04e1/a7394816aabb/a5d79558c1b5/pullandbearimage1729783233954/pullandbearimage1729783233954.jpg?ts=1729784111562&w=650&f=auto",
            name: "@_ppprincesss",
            url: "https://www.instagram.com/_ppprincesss",
          },
          {
            id: 5,
            image: "https://static.pullandbear.net/assets/public/7437/b982/9b244e0fb459/b6ff4736a28c/pullandbearimage1729783253260/pullandbearimage1729783253260.jpg?ts=1729784187915&w=650&f=auto",
            name: "@timzino._",
            url: "https://www.instagram.com/timzino._",
          },
        ],
      };
    },
  };
  </script>
  
  <style scoped>
  .influencers-container {
    display: flex;
    justify-content: center;
    gap: 50px; /* Fotoğraflar arası boşluk */
    flex-wrap: wrap; /* Daha küçük ekranlar için satır geçişi */
    background-color: black;
  }
  
  .influencer-item {
    padding-top: 10px;
    text-align: center;
  }
  
  .influencer-image {
    
    width: 330px;
    height: 410px;
    object-fit: cover;
    border-radius: 10px;
    border: 2px solid #ddd;
    transition: transform 0.3s ease;
  }
  
  .influencer-image:hover {
    transform: scale(1.05); /* Hover sırasında büyüme efekti */
  }
  
  .influencer-name {
    margin-top: 10px;
    font-size: 18px;
    font-weight: bold;
    color: white;
  }
  a {
  text-decoration: none;
}
  </style>
  