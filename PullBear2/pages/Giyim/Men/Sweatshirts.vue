<template>
     <div class="logo-container">
        <NuxtLink to="/">
      <img src="https://static.pullandbear.net/2/static2/img/headLogo/logo_pull_black_new.svg" alt="Logo" class="logo" />
    </NuxtLink>
    </div>
    <Menu />
    <div class="category-page">
        <h1>Erkek Sweatshirt Koleksiyonu</h1>
    </div>
    <div class="products-section">
        <Filter6 @filter-changed="handleFilterChange" />
        <Products :defaultGender="'men'" :defaultCategory="'sweatshirts'" :defaultSubSweatshirts="subSweatshirts" />
    </div>
    <Button />
    <Sepet />
    <Footer />
</template>

<script>
import Menu from '../../components/Menu.vue';
import Products from '../../components/Products.vue';
import Filter6 from '../../components/Filter6.vue';
import Button from '../../components/Button.vue';
import Sepet from '../../components/Sepet.vue';
import Footer from '../../components/Footer.vue';

export default {
    name: 'MenSweatshirtsPage',
    components: {
        Menu,
        Products,
        Filter6,
        Button,
        Sepet,
        Footer
    },
    data() {
    return {
      subSweatshirts: 'all'
    }
  },
  methods: {
    handleFilterChange(filter6) {
      this.subSweatshirts = filter6;
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