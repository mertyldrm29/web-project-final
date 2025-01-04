<template>
    <div class="logo-container">
         <NuxtLink to="/">
       <img src="https://static.pullandbear.net/2/static2/img/headLogo/logo_pull_black_new.svg" alt="Logo" class="logo" />
     </NuxtLink>
     </div>
     <Menu />
     <div class="men-page">
       <h1>Yeni Ürünler</h1>
     </div>
     <div class="content">
       <div class="products-section">
         <Filter2 @filter-changed="handleFilterChange2" />
         <Filter @filter-changed="handleFilterChange" />
         <Products :defaultGender="chosenFilter" :defaultCategory="selectedFilter" :defaultSubTshirt="'all'" :defaultSubJeans="'all'" :defaultSubJackets="'all'" :defaultSubSweatshirts="'all'" />
       </div>
     </div>
     <Button />
     <Sepet />
     <Footer />
 </template>
 
 <script>
 import Menu from '../components/Menu.vue';
 import Filter from '../components/Filter.vue';
 import Products from '../components/Products.vue';
 import Button from '../components/Button.vue';
 import Sepet from '../components/Sepet.vue';
 import Footer from '../components/Footer.vue';
import Filter2 from '~/components/Filter2.vue';
 
 export default {
   name: 'MenPage',
   components: {
     Menu,
     Filter,
     Filter2,
     Products,
     Button,
     Sepet,
     Footer
   },
   data() {
     return {
       selectedFilter: 'all',
       chosenFilter: 'all'
     }
   },
   methods: {
     handleFilterChange(filter) {
       this.selectedFilter = filter;
     },
     handleFilterChange2(filter2) {
       this.chosenFilter = filter2;
     }
   }
 }
 </script>
 
 <style scoped>
 .men-page {
   align-items: center;
   justify-content: center;
   display: flex;
   margin-top: 0px;
 }
 
 h1 {
   font-size: 1.5em;
   margin-bottom: 10px;
   color: rgb(100, 99, 99);
 }
 
 .content {
   width: 100%;
 }
 
 .filter-section {
   margin-bottom: 20px;
 }
 
 .products-section {
   width: 100%;
 }
 .logo-container {
   margin-top: 0px;
   display: flex;
   justify-content: center;
   width: 100%;
 }
 .menu-container {
   margin-top: -20px;
   position: relative;
 }
 .logo {
   max-width: 200px;
 }
 </style> 