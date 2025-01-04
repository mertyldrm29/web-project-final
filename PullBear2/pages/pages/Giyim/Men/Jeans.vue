<template>
     <div class="logo-container">
        <NuxtLink to="/">
      <img src="https://static.pullandbear.net/2/static2/img/headLogo/logo_pull_black_new.svg" alt="Logo" class="logo" />
    </NuxtLink>
    </div>
    <Menu />
    <div class="category-page">
        <h1>Erkek Jean Koleksiyonu</h1>
    </div>
    <div class="products-section">
        <Products :defaultGender="'men'" :defaultCategory="'jeans'" />
    </div>
    <Button />
    <Sepet />
    <Footer />
</template>

<script>
import Filter from '../../../components/Filter.vue';
import Menu from '../../../components/Menu.vue';
import Products from '../../../components/Products.vue';
import Button from '../../../components/Button.vue';
import Sepet from '../../../components/Sepet.vue';
import Footer from '../../../components/Footer.vue';

export default {
    name: 'MenJeansPage',
    components: {
        Menu,
        Filter,
        Products,
        Button,
        Sepet,
        Footer
    },
    data() {
        return {
            selectedFilter: 'jeans'
        }
    },
    methods: {
        handleFilterChange(filter) {
            this.selectedFilter = filter;
        }
    }
}
</script>

<style scoped>
.category-page {
    align-items: center;
    justify-content: center;
    display: flex;
    margin-top: -15px;
}

h1 {
    font-size: em;
    margin-bottom: 10px;
}

.products-section {
    width: 100%;
    margin-top: 20px;
}
.logo-container {
  margin-top: 10px;
  display: flex;
  justify-content: center;
  width: 100%;
}
.logo {
  max-width: 200px;
}
.menu-container {
  margin-top: -20px;
  position: relative;
}
</style>