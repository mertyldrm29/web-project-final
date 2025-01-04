<template>
    <div>
      <!-- Filter Component -->
      <Filter @filter-changed="handleFilterChange" />
  
      <!-- Ürünler -->
      <div class="products-container">
        <div v-for="product in filteredProducts" :key="product.id" class="product-card">
          <img 
        :src="hoveredProduct === product.id ? product.hoverImage : product.image" 
        :alt="product.name" 
        @mouseover="hoveredProduct = product.id" 
        @mouseleave="hoveredProduct = null" 
        class="product-image" />
          <div class="product-info">
            <h4 class="product-name">{{ product.name }}</h4>
            <p class="product-price">{{ product.price }} TL</p>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import Filter from './Filter.vue';
  
  export default {
    components: {
      Filter,
    },
    data() {
      return {
        hoveredProduct: null,
        products: [
          { id: 1, name: 'Standart Jean', price: 1190, image: 'https://static.pullandbear.net/assets/public/e351/34bc/c06b4bf2b2df/495799ffcb9e/07686909811-A1M/07686909811-A1M.jpg?ts=1720176348836&w=882&f=auto',hoverImage:'https://static.pullandbear.net/assets/public/2251/fec2/a02c4bccb99f/d825aaf53952/07686909811-A2M/07686909811-A2M.jpg?ts=1720176372156&w=882&f=auto' ,category: 'jeans' },
          { id: 2, name: 'The Godfather Baskılı T-shirt', price: 760, image: 'https://static.pullandbear.net/assets/public/f547/12f1/010e4302bd12/5ac6897a95d8/03245524250-A7M/03245524250-A7M.jpg?ts=1732011582466&w=882&f=auto',hoverImage:'https://static.pullandbear.net/assets/public/8b18/73e6/4d4448b8b2ff/755ecb2e2556/03245524250-A1M/03245524250-A1M.jpg?ts=1731929326118&w=882&f=auto', category: 'tshirts' },
          { id: 3, name: 'STWD Kapüşonlu Şişme Mont', price: 1290, hoverImage: 'https://static.pullandbear.net/assets/public/0777/2fff/7b4045c79850/900b2b74af7d/07710576711-A2M/07710576711-A2M.jpg?ts=1728291137542&w=882&f=auto',image:'https://static.pullandbear.net/assets/public/4794/49fe/96454677aaf7/94f8a211330d/07710576711-A1M/07710576711-A1M.jpg?ts=1728291147749&w=882&f=auto' ,category: 'jackets' },
          { id: 4, name: 'Soluk Efektli Sweatshirt', price: 1190, image: 'https://static.pullandbear.net/assets/public/d652/8472/8ddd4d569446/278df42939cd/07590550700-A1M/07590550700-A1M.jpg?ts=1728290845274&w=882&f=auto',hoverImage:'https://static.pullandbear.net/assets/public/fa72/fd5a/43c24c4d802a/3b8ef8a112b2/07590550700-A7M/07590550700-A7M.jpg?ts=1728375724271&w=882&f=auto', category: 'sweatshirts' },
          { id: 5, name: 'Kapüşonlu Basic Sweatshirt', price: 1090, image: 'https://static.pullandbear.net/assets/public/da86/e2a8/88a74ede908b/0be802499d7a/07591513807-A1M/07591513807-A1M.jpg?ts=1723208088928&w=882&f=auto',hoverImage:'https://static.pullandbear.net/assets/public/3012/1330/565445749588/67d2ca7ff782/07591513807-A2M/07591513807-A2M.jpg?ts=1723208081181&w=882&f=auto', category: 'sweatshirts' },
          { id: 6, name: 'Yakası Suni Kürklü Denim Ceket', price: 1190, image: 'https://static.pullandbear.net/assets/public/c46e/6b81/5db94149bace/493fc1318ce3/07712552434-A1M/07712552434-A1M.jpg?ts=1728384649307&w=882&f=auto',hoverImage:'https://static.pullandbear.net/assets/public/6f6b/247c/4d3149a4bbe0/b7c2558754ee/07712552434-A2M/07712552434-A2M.jpg?ts=1728384614610&w=882&f=auto' ,category: 'jackets' },
          { id: 7, name: 'Straight Fit Jean', price: 1190, image: 'https://static.pullandbear.net/assets/public/1bb4/85c7/ecae4d658ae0/0d2d194dee7c/07685522833-A1M/07685522833-A1M.jpg?ts=1723449073176&w=882&f=auto',hoverImage:'https://static.pullandbear.net/assets/public/d8b9/aeb0/10e740d8baac/e250c083a269/07685522833-A2M/07685522833-A2M.jpg?ts=1723449060087&w=882&f=auto', category: 'jeans' },
          { id: 8, name: 'Kısa Kollu NY T-shirt', price: 620, image: 'https://static.pullandbear.net/assets/public/4fbb/5b9a/a1444230bc3e/73b37b92bdd3/07248924250-A1M/07248924250-A1M.jpg?ts=1719832564326&w=882&f=auto',hoverImage:'https://static.pullandbear.net/assets/public/054d/eb22/18fc42db8af6/0973c22b847d/07248924250-A3M/07248924250-A3M.jpg?ts=1719832564916&w=882&f=auto', category: 'tshirts' },
          { id: 9, name: 'Basic Kısa Kollu Dokulu T-shirt', price: 620, image: 'https://static.pullandbear.net/2/photos//2024/V/0/2/p/3241/510/712/3241510712_2_1_0.jpg?ts=1699613187866&w=882&f=auto',hoverImage:'https://static.pullandbear.net/2/photos//2024/V/0/2/p/3241/510/712/3241510712_2_3_0.jpg?ts=1699613187866&w=882&f=auto', category: 'tshirts' },
          { id: 10, name: 'Loose Jean', price: 1390, image: 'https://static.pullandbear.net/assets/public/a7fa/474f/97e54e18bf6a/1fbfb83c15a0/07685525427-A1M/07685525427-A1M.jpg?ts=1723449289376&w=882&f=auto',hoverImage:'https://static.pullandbear.net/assets/public/c3b0/07a8/2baf4a1b9500/b35ba2e63aa8/07685525427-A2M/07685525427-A2M.jpg?ts=1723449284919&w=882&f=auto' ,category: 'jeans' },
          { id: 11, name: 'Soluk Efektli STWD Sweatshirt', price: 1290, image: 'https://static.pullandbear.net/assets/public/4208/cbfd/2b784014b9c9/2bea6b365783/07590556920-A3M/07590556920-A3M.jpg?ts=1732265831688&w=882&f=auto',hoverImage:'https://static.pullandbear.net/assets/public/17e4/3201/cb7b462fa1d4/0aa8cf6a8bc2/07590556920-A2M/07590556920-A2M.jpg?ts=1732265851729&w=882&f=auto', category: 'sweatshirts' },
          { id: 12, name: 'Cepli Suni Süet Ceket', price: 1190, image: 'https://static.pullandbear.net/assets/public/2970/035d/d41544e9b76c/484fb6ad0feb/07710531711-A1M/07710531711-A1M.jpg?ts=1724661706416&w=882&f=auto',hoverImage:'https://static.pullandbear.net/assets/public/e61e/452a/eaac4b748b03/90aeeba0de73/07710531711-A2M/07710531711-A2M.jpg?ts=1724661712766&w=882&f=auto' ,category: 'jackets' },
          { id: 13, name: 'Logolu ve Kanguru Cepli Ceket', price: 940, image: 'https://static.pullandbear.net/assets/public/f672/2ee8/7d604b5eb9e4/8588dfa37e38/07710534505-A1M/07710534505-A1M.jpg?ts=1723208671135&w=882&f=auto',hoverImage:'https://static.pullandbear.net/assets/public/0252/3fe8/7d674d4b95bc/8736901ef09e/07710534505-A2M/07710534505-A2M.jpg?ts=1723208657359&w=882&f=auto' ,category: 'jackets' },
          { id: 14, name: 'Basic Kare Kesim Sweatshirt', price: 940, image: 'https://static.pullandbear.net/assets/public/fbf8/053c/44c1496b91da/b597ca48bf63/07590511251-A1M/07590511251-A1M.jpg?ts=1724661010260&w=882&f=auto',hoverImage:'https://static.pullandbear.net/assets/public/61ef/4a47/8fa948bbb6ca/2a4294fe936a/07590511251-A2M/07590511251-A2M.jpg?ts=1724661014329&w=882&f=auto', category: 'sweatshirts' },
          { id: 15, name: 'Kareli İnce Gömlek', price: 1190, image: 'https://static.pullandbear.net/assets/public/da3a/ea72/aefc4f959e47/5cc7bdd69665/07470504681-A7m/07470504681-A7m.jpg?ts=1729590192302&w=882&f=auto',hoverImage:'https://static.pullandbear.net/assets/public/a63f/4ec7/d02245d2a4c9/108a1b8e263c/07470504681-A2M/07470504681-A2M.jpg?ts=1729237873372&w=882&f=auto', category: 'tshirts' },
          { id: 16, name: 'Kargo Jogger Pantolon', price: 1190, image: 'https://static.pullandbear.net/assets/public/8851/f1bd/b12444daa5e9/501087ccb01e/07678502805-A1M/07678502805-A1M.jpg?ts=1718357021329&w=882&f=auto',hoverImage:'https://static.pullandbear.net/assets/public/1ddc/4a5f/bbf14d089b4d/8d220fb47037/07678502805-A2M/07678502805-A2M.jpg?ts=1718357019273&w=882&f=auto', category: 'jeans' },
          { id: 17, name: 'Basic Kısa Kollu Keten Görünümlü Gömlek', price: 1090, image: 'https://static.pullandbear.net/assets/public/9867/f523/1ed646e5bef4/c79e2c5f4403/03473575818-A1M/03473575818-A1M.jpg?ts=1718092319822&w=882&f=auto',hoverImage:'https://static.pullandbear.net/assets/public/7c72/bb8e/0e664ae88ed5/68babecfbca7/03473575818-A2M/03473575818-A2M.jpg?ts=1718092323754&w=882&f=auto', category: 'tshirts' },
          { id: 18, name: 'Keten Karışımlı Jogger Pantolon', price: 1150, image: 'https://static.pullandbear.net/2/photos//2024/V/0/2/p/3678/503/505/3678503505_2_1_0.jpg?ts=1709545300429&w=882&f=auto',hoverImage:'https://static.pullandbear.net/2/photos//2024/V/0/2/p/3678/503/505/3678503505_2_2_0.jpg?ts=1709545300429&w=882&f=auto', category: 'jeans' },
          { id: 19, name: 'Kapüşonlu Şişme Mont', price: 2390, image: 'https://static.pullandbear.net/assets/public/9fa9/d75b/1827451e8d3c/f8cccadae4f0/03716506800-A1M/03716506800-A1M.jpg?ts=1732117086142&w=882&f=auto',hoverImage:'https://static.pullandbear.net/assets/public/958d/5adc/64924fdb9229/160a390f74ba/03716506800-A2M/03716506800-A2M.jpg?ts=1732117089914&w=882&f=auto', category: 'jackets' },
          { id: 20, name: 'Basic Yumuşak Kazak', price: 1390, image: 'https://static.pullandbear.net/assets/public/9698/6f6e/ebcc47a3bf85/c87b6f1a217a/07554510802-A1M/07554510802-A1M.jpg?ts=1729585800746&w=882&f=auto',hoverImage:'https://static.pullandbear.net/assets/public/f6fb/9a04/3bdb44d9a719/4c0101336a70/07554510802-A2M/07554510802-A2M.jpg?ts=1729237956374&w=882&f=auto' ,category: 'sweatshirts' },
        ],
        selectedFilter: 'all', // Varsayılan filtre
      };
    },
    computed: {
      filteredProducts() {
        if (this.selectedFilter === 'all') {
          return this.products; // Tüm ürünleri göster
        }
        return this.products.filter(product => product.category === this.selectedFilter); // Seçilen kategoriye göre filtrele
      },
    },
    methods: {
      handleFilterChange(filter) {
        this.selectedFilter = filter; // Filtre değiştiğinde, filtreyi güncelle
      },
    },
  };
  </script>
  
  <style scoped>
  .products-container {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 15px;
  justify-content: center;
  align-items: center;
}
.product-item {
  text-align: center;
}
  
  .product-card {
    border: 1px solid #ccc;
    border-radius: 10px;
    overflow: hidden;
    text-align: center;
  }
  
  .product-image {
  width: 320px;
  height: 485px;
  object-fit: cover;
  border: 1px solid #ddd;
  border-radius: 5px;
  transition: transform 0.3s ease;
}
.product-image:hover {
  transform: scale(1.05); /* Hover sırasında hafif büyütme efekti */
}
  

  
  .product-name {
  margin-top: 10px;
  font-size: 16px;
  font-weight: bolder;
}

.product-price {
  margin-top: 5px;
  font-size: 15px;
  font-weight: bold;
  color: #555;
}
  </style>
  