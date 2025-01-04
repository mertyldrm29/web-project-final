<template>
     <div class="logo-container">
        <NuxtLink to="/">
      <img src="https://static.pullandbear.net/2/static2/img/headLogo/logo_pull_black_new.svg" alt="Logo" class="logo" />
    </NuxtLink>
    </div>
    <Menu />
    <div class="category-page">
        <h1>Erkek T-Shirt Koleksiyonu</h1>
    </div>
    <div class="products-section">
        <Filter3 @filter-changed="handleFilterChange" />
        <Products :defaultGender="'men'" :defaultCategory="'tshirts'" :defaultSubTshirt="subTshirt" />
    </div>
    <Button />
    <Sepet />
    <Footer />
</template>

<script>
import Menu from '../../components/Menu.vue';
import Products from '../../components/Products.vue';
import Button from '../../components/Button.vue';
import Sepet from '../../components/Sepet.vue';
import Footer from '../../components/Footer.vue';
import Filter3 from '../../components/Filter3.vue';
export default {
    name: 'MenTshirtsPage',
    components: {
        Menu,
        Products,
        Button,
        Filter3,
        Sepet,
        Footer
    },data() {
    return {
      subTshirt: 'all'
    }
  },
  methods: {
    handleFilterChange(filter3) {
      this.subTshirt = filter3;
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