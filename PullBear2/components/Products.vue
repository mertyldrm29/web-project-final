<template>
    <div>
      <!-- Ürünler -->
      <div class="products-container">
        <div v-for="product in filteredProducts" :key="product.id" class="product-card">
          <img 
            :src="hoveredProduct === product.id ? product.hoverImage : product.image" 
            :alt="product.name" 
            @mouseover="hoveredProduct = product.id" 
            @mouseleave="hoveredProduct = null" 
            class="product-image" 
          />
          <div class="product-info">
            <h4 class="product-name">{{ product.name }}</h4>
            <button class="add-to-cart-btn">Sepete Ekle</button>
            <p class="product-price">{{ product.price }} TL</p>
          </div>
        </div>
      </div>
    </div>
</template>

<script>
export default {
    props: {
        gender: {
            type: String,
            required: true
        },
        defaultCategory: {
            type: String,
            required: true
        }
    },
    data() {
        return {
            hoveredProduct: null,
            products: [
          { id: 1, name: 'Standart Jean', price: 1190, image: 'https://static.pullandbear.net/assets/public/e351/34bc/c06b4bf2b2df/495799ffcb9e/07686909811-A1M/07686909811-A1M.jpg?ts=1720176348836&w=882&f=auto',hoverImage:'https://static.pullandbear.net/assets/public/2251/fec2/a02c4bccb99f/d825aaf53952/07686909811-A2M/07686909811-A2M.jpg?ts=1720176372156&w=882&f=auto' ,category: 'jeans', gender: 'men' },
          { id: 2, name: 'The Godfather Baskılı T-shirt', price: 760, image: 'https://static.pullandbear.net/assets/public/f547/12f1/010e4302bd12/5ac6897a95d8/03245524250-A7M/03245524250-A7M.jpg?ts=1732011582466&w=882&f=auto',hoverImage:'https://static.pullandbear.net/assets/public/8b18/73e6/4d4448b8b2ff/755ecb2e2556/03245524250-A1M/03245524250-A1M.jpg?ts=1731929326118&w=882&f=auto', category: 'tshirts', gender: 'men' },
          { id: 3, name: 'STWD Kapüşonlu Şişme Mont', price: 1290, hoverImage: 'https://static.pullandbear.net/assets/public/0777/2fff/7b4045c79850/900b2b74af7d/07710576711-A2M/07710576711-A2M.jpg?ts=1728291137542&w=882&f=auto',image:'https://static.pullandbear.net/assets/public/4794/49fe/96454677aaf7/94f8a211330d/07710576711-A1M/07710576711-A1M.jpg?ts=1728291147749&w=882&f=auto' ,category: 'jackets', gender: 'men' },
          { id: 4, name: 'Soluk Efektli Sweatshirt', price: 1190, image: 'https://static.pullandbear.net/assets/public/d652/8472/8ddd4d569446/278df42939cd/07590550700-A1M/07590550700-A1M.jpg?ts=1728290845274&w=882&f=auto',hoverImage:'https://static.pullandbear.net/assets/public/fa72/fd5a/43c24c4d802a/3b8ef8a112b2/07590550700-A7M/07590550700-A7M.jpg?ts=1728375724271&w=882&f=auto', category: 'sweatshirts', gender: 'men' },
          { id: 5, name: 'Kapüşonlu Basic Sweatshirt', price: 1090, image: 'https://static.pullandbear.net/assets/public/da86/e2a8/88a74ede908b/0be802499d7a/07591513807-A1M/07591513807-A1M.jpg?ts=1723208088928&w=882&f=auto',hoverImage:'https://static.pullandbear.net/assets/public/3012/1330/565445749588/67d2ca7ff782/07591513807-A2M/07591513807-A2M.jpg?ts=1723208081181&w=882&f=auto', category: 'sweatshirts', gender: 'men' },
          { id: 6, name: 'Yakası Suni Kürklü Denim Ceket', price: 1190, image: 'https://static.pullandbear.net/assets/public/c46e/6b81/5db94149bace/493fc1318ce3/07712552434-A1M/07712552434-A1M.jpg?ts=1728384649307&w=882&f=auto',hoverImage:'https://static.pullandbear.net/assets/public/6f6b/247c/4d3149a4bbe0/b7c2558754ee/07712552434-A2M/07712552434-A2M.jpg?ts=1728384614610&w=882&f=auto' ,category: 'jackets', gender: 'men' },
          { id: 7, name: 'Straight Fit Jean', price: 1190, image: 'https://static.pullandbear.net/assets/public/1bb4/85c7/ecae4d658ae0/0d2d194dee7c/07685522833-A1M/07685522833-A1M.jpg?ts=1723449073176&w=882&f=auto',hoverImage:'https://static.pullandbear.net/assets/public/d8b9/aeb0/10e740d8baac/e250c083a269/07685522833-A2M/07685522833-A2M.jpg?ts=1723449060087&w=882&f=auto', category: 'jeans', gender: 'men' },
          { id: 8, name: 'Kısa Kollu NY T-shirt', price: 620, image: 'https://static.pullandbear.net/assets/public/4fbb/5b9a/a1444230bc3e/73b37b92bdd3/07248924250-A1M/07248924250-A1M.jpg?ts=1719832564326&w=882&f=auto',hoverImage:'https://static.pullandbear.net/assets/public/054d/eb22/18fc42db8af6/0973c22b847d/07248924250-A3M/07248924250-A3M.jpg?ts=1719832564916&w=882&f=auto', category: 'tshirts', gender: 'men' },
          { id: 9, name: 'Basic Kısa Kollu Dokulu T-shirt', price: 620, image: 'https://static.pullandbear.net/2/photos//2024/V/0/2/p/3241/510/712/3241510712_2_1_0.jpg?ts=1699613187866&w=882&f=auto',hoverImage:'https://static.pullandbear.net/2/photos//2024/V/0/2/p/3241/510/712/3241510712_2_3_0.jpg?ts=1699613187866&w=882&f=auto', category: 'tshirts', gender: 'men' },
          { id: 10, name: 'Loose Jean', price: 1390, image: 'https://static.pullandbear.net/assets/public/a7fa/474f/97e54e18bf6a/1fbfb83c15a0/07685525427-A1M/07685525427-A1M.jpg?ts=1723449289376&w=882&f=auto',hoverImage:'https://static.pullandbear.net/assets/public/c3b0/07a8/2baf4a1b9500/b35ba2e63aa8/07685525427-A2M/07685525427-A2M.jpg?ts=1723449284919&w=882&f=auto' ,category: 'jeans', gender: 'men' },
          { id: 11, name: 'Soluk Efektli STWD Sweatshirt', price: 1290, image: 'https://static.pullandbear.net/assets/public/4208/cbfd/2b784014b9c9/2bea6b365783/07590556920-A3M/07590556920-A3M.jpg?ts=1732265831688&w=882&f=auto',hoverImage:'https://static.pullandbear.net/assets/public/17e4/3201/cb7b462fa1d4/0aa8cf6a8bc2/07590556920-A2M/07590556920-A2M.jpg?ts=1732265851729&w=882&f=auto', category: 'sweatshirts', gender: 'men' },
          { id: 12, name: 'Cepli Suni Süet Ceket', price: 1190, image: 'https://static.pullandbear.net/assets/public/2970/035d/d41544e9b76c/484fb6ad0feb/07710531711-A1M/07710531711-A1M.jpg?ts=1724661706416&w=882&f=auto',hoverImage:'https://static.pullandbear.net/assets/public/e61e/452a/eaac4b748b03/90aeeba0de73/07710531711-A2M/07710531711-A2M.jpg?ts=1724661712766&w=882&f=auto' ,category: 'jackets', gender: 'men' },
          { id: 13, name: 'Logolu ve Kanguru Cepli Ceket', price: 940, image: 'https://static.pullandbear.net/assets/public/f672/2ee8/7d604b5eb9e4/8588dfa37e38/07710534505-A1M/07710534505-A1M.jpg?ts=1723208671135&w=882&f=auto',hoverImage:'https://static.pullandbear.net/assets/public/0252/3fe8/7d674d4b95bc/8736901ef09e/07710534505-A2M/07710534505-A2M.jpg?ts=1723208657359&w=882&f=auto' ,category: 'jackets', gender: 'men' },
          { id: 14, name: 'Basic Kare Kesim Sweatshirt', price: 940, image: 'https://static.pullandbear.net/assets/public/fbf8/053c/44c1496b91da/b597ca48bf63/07590511251-A1M/07590511251-A1M.jpg?ts=1724661010260&w=882&f=auto',hoverImage:'https://static.pullandbear.net/assets/public/61ef/4a47/8fa948bbb6ca/2a4294fe936a/07590511251-A2M/07590511251-A2M.jpg?ts=1724661014329&w=882&f=auto', category: 'sweatshirts', gender: 'men' },
          { id: 15, name: 'Kareli İnce Gömlek', price: 1190, image: 'https://static.pullandbear.net/assets/public/da3a/ea72/aefc4f959e47/5cc7bdd69665/07470504681-A7m/07470504681-A7m.jpg?ts=1729590192302&w=882&f=auto',hoverImage:'https://static.pullandbear.net/assets/public/a63f/4ec7/d02245d2a4c9/108a1b8e263c/07470504681-A2M/07470504681-A2M.jpg?ts=1729237873372&w=882&f=auto', category: 'tshirts', gender: 'men' },
          { id: 16, name: 'Kargo Jogger Pantolon', price: 1190, image: 'https://static.pullandbear.net/assets/public/8851/f1bd/b12444daa5e9/501087ccb01e/07678502805-A1M/07678502805-A1M.jpg?ts=1718357021329&w=882&f=auto',hoverImage:'https://static.pullandbear.net/assets/public/1ddc/4a5f/bbf14d089b4d/8d220fb47037/07678502805-A2M/07678502805-A2M.jpg?ts=1718357019273&w=882&f=auto', category: 'jeans', gender: 'men' },
          { id: 17, name: 'Basic Kısa Kollu Keten Görünümlü Gömlek', price: 1090, image: 'https://static.pullandbear.net/assets/public/9867/f523/1ed646e5bef4/c79e2c5f4403/03473575818-A1M/03473575818-A1M.jpg?ts=1718092319822&w=882&f=auto',hoverImage:'https://static.pullandbear.net/assets/public/7c72/bb8e/0e664ae88ed5/68babecfbca7/03473575818-A2M/03473575818-A2M.jpg?ts=1718092323754&w=882&f=auto', category: 'tshirts', gender: 'men' },
          { id: 18, name: 'Keten Karışımlı Jogger Pantolon', price: 1150, image: 'https://static.pullandbear.net/2/photos//2024/V/0/2/p/3678/503/505/3678503505_2_1_0.jpg?ts=1709545300429&w=882&f=auto',hoverImage:'https://static.pullandbear.net/2/photos//2024/V/0/2/p/3678/503/505/3678503505_2_2_0.jpg?ts=1709545300429&w=882&f=auto', category: 'jeans', gender: 'men' },
          { id: 19, name: 'Kapüşonlu Şişme Mont', price: 2390, image: 'https://static.pullandbear.net/assets/public/9fa9/d75b/1827451e8d3c/f8cccadae4f0/03716506800-A1M/03716506800-A1M.jpg?ts=1732117086142&w=882&f=auto',hoverImage:'https://static.pullandbear.net/assets/public/958d/5adc/64924fdb9229/160a390f74ba/03716506800-A2M/03716506800-A2M.jpg?ts=1732117089914&w=882&f=auto', category: 'jackets', gender: 'men' },
          { id: 20, name: 'Basic Yumuşak Kazak', price: 1390, image: 'https://static.pullandbear.net/assets/public/9698/6f6e/ebcc47a3bf85/c87b6f1a217a/07554510802-A1M/07554510802-A1M.jpg?ts=1729585800746&w=882&f=auto',hoverImage:'https://static.pullandbear.net/assets/public/f6fb/9a04/3bdb44d9a719/4c0101336a70/07554510802-A2M/07554510802-A2M.jpg?ts=1729237956374&w=882&f=auto' ,category: 'sweatshirts', gender: 'men' },
          { id: 21, name: 'Comfort mom jean', price: 760, image: 'https://static.pullandbear.net/assets/public/5096/9e09/b8a74b88b901/ae64c0e72a51/07685323803-A1M/07685323803-A1M.jpg?ts=1721657404017&w=882&f=auto',hoverImage:'https://static.pullandbear.net/assets/public/1995/380e/f337430cb2cd/5d3404e2c504/07685323803-A6M/07685323803-A6M.jpg?ts=1720104375206&w=882&f=auto' ,category: 'jeans', gender: 'women' },
          { id: 22, name: 'Squid Game file t-shirt', price: 1190, image: 'https://static.pullandbear.net/assets/public/e289/ad27/b5ca4b4f9be7/5a95057c81ef/0324591750019-A7M/0324591750019-A7M.jpg?ts=1734351434813&w=882&f=auto',hoverImage:'https://static.pullandbear.net/assets/public/da8e/1b51/5f4840a49655/a3229ce29298/0324591750019-A1M/0324591750019-A1M.jpg?ts=1734347337430&w=882&f=auto' ,category: 'tshirts', gender: 'women' },
          { id: 23, name: 'Astar Detaylı Kaban', price: 1390, image: 'https://static.pullandbear.net/assets/public/0812/e20b/08c74a9db695/7e227d710c59/03252350305-A1M/03252350305-A1M.jpg?ts=1731334254091&w=882&f=auto',hoverImage:'https://static.pullandbear.net/assets/public/e79f/050a/ba174b7f99bd/f6ed594884b4/03252350305-A7M/03252350305-A7M.jpg?ts=1731501220528&w=882&f=auto' ,category: 'jackets', gender: 'women' },
          { id: 24, name: 'Basic sweatshirt', price: 620, image: 'https://static.pullandbear.net/assets/public/e322/ad0b/10cb430badb0/dfed6eaeb900/07590330800-A1M/07590330800-A1M.jpg?ts=1724930428664&w=882&f=auto',hoverImage:'https://static.pullandbear.net/assets/public/e8ad/720c/d92a4f4c9424/d0aa3239c3ea/07590330800-A4M/07590330800-A4M.jpg?ts=1724930903082&w=882&f=auto' ,category: 'sweatshirts', gender: 'women' },
          { id: 25, name: 'Mavi Chevrolet kapüşonlu sweatshirt', price: 940, image: 'https://static.pullandbear.net/assets/public/969f/3871/223540f7928b/cd894b7f42b8/03594324420-A7M/03594324420-A7M.jpg?ts=1732189183309&w=882&f=auto',hoverImage:'https://static.pullandbear.net/assets/public/952d/8c22/9cb74d3297c2/2188b2ebb5ab/03594324420-A3M/03594324420-A3M.jpg?ts=1732092766568&w=882&f=auto' ,category: 'sweatshirts', gender: 'women' },
          { id: 26, name: 'Soluk efektli şişme mont', price: 1390, image: 'https://static.pullandbear.net/assets/public/771f/1a72/4886442299d7/0f238d9d0c23/07710352807-A1M/07710352807-A1M.jpg?ts=1726751302886&w=882&f=auto',hoverImage:'https://static.pullandbear.net/assets/public/4946/d2bf/b58241f49f9a/e37eb369af3d/07710352807-A7M/07710352807-A7M.jpg?ts=1726735514735&w=882&f=auto' ,category: 'jackets', gender: 'women' },
          { id: 27, name: 'Orta bel İspanyol paça jean', price: 940, image: 'https://static.pullandbear.net/assets/public/fa91/1c67/ed18472db396/156f540781e2/07679301505-A7M/07679301505-A7M.jpg?ts=1722522219456&w=882&f=auto',hoverImage:'https://static.pullandbear.net/assets/public/a3e7/a7de/25164f94a35c/9eec2ce06a67/07679401505-A1M/07679401505-A1M.jpg?ts=1722526752843&w=882&f=auto' ,category: 'jeans', gender: 'women' },
          { id: 28, name: 'Kısa kollu kovboy baskılı t-shirt', price: 290, image: 'https://static.pullandbear.net/assets/public/fed4/9585/cfea4f829485/e8fd1872f3d5/07252356806-A1M/07252356806-A1M.jpg?ts=1723800386765&w=882&f=auto',hoverImage:'https://static.pullandbear.net/assets/public/148b/08f8/893149f591a0/5324430909ee/07252356806-A7M/07252356806-A7M.jpg?ts=1723802457060&w=882&f=auto' ,category: 'tshirts', gender: 'women' },
          { id: 29, name: 'Çince karakterli t-shirt', price: 380, image: 'https://static.pullandbear.net/assets/public/3c93/c567/041a4487929a/6eb890d298b8/07252387805-A1M/07252387805-A1M.jpg?ts=1727954358240&w=882&f=auto',hoverImage:'https://static.pullandbear.net/assets/public/d070/338b/08f74485878b/7c04bc0e34ce/07252387805-A4M/07252387805-A4M.jpg?ts=1727954408194&w=882&f=auto' ,category: 'tshirts', gender: 'women' },
          { id: 30, name: 'Yüksek bel straight fit kumaş pantolon', price: 760, image: 'https://static.pullandbear.net/assets/public/3816/b0f3/92974e779636/491dc3de8323/07676365533-A1M/07676365533-A1M.jpg?ts=1724324839166&w=882&f=auto',hoverImage:'https://static.pullandbear.net/assets/public/1965/01a8/ece74a16891f/8a28bf5238f6/07676365533-A4M/07676365533-A4M.jpg?ts=1724678936370&w=882&f=auto' ,category: 'jeans', gender: 'women' },
          { id: 31, name: 'Basic oversize sweatshirt', price: 620, image: 'https://static.pullandbear.net/assets/public/455b/259f/38ab4152b2bf/1f7a11d44198/03590337802-A1M/03590337802-A1M.jpg?ts=1724773718140&w=882&f=auto',hoverImage:'https://static.pullandbear.net/assets/public/20d6/6874/f82845c180f9/ad4e9a210957/03590337802-A2M/03590337802-A2M.jpg?ts=1724773711832&w=882&f=auto' ,category: 'sweatshirts', gender: 'women' },
          { id: 32, name: 'Astar detaylı suni deri ceket', price: 1690, image: 'https://static.pullandbear.net/assets/public/224c/e8d5/f4994779a6d3/3331b603fc83/07710472717-A1M/07710472717-A1M.jpg?ts=1732092272534&w=882&f=auto',hoverImage:'https://static.pullandbear.net/assets/public/1974/b3c0/d0ed47a69146/52508d9227bb/07710472717-A3M/07710472717-A3M.jpg?ts=1732092432321&w=882&f=auto' ,category: 'jackets', gender: 'women' },
          { id: 33, name: 'Kapüşonlu ve suni yünlü mont', price: 2390, image: 'https://static.pullandbear.net/assets/public/0f15/8f9c/7e8f45deb7de/bbfbe04c9f8a/07751406707-A1M/07751406707-A1M.jpg?ts=1732700968679&w=882&f=auto',hoverImage:'https://static.pullandbear.net/assets/public/4557/568b/44db407bbf3e/9273adbb1c66/07751306707-A7M/07751306707-A7M.jpg?ts=1732707426520&w=882&f=auto' ,category: 'jackets', gender: 'women' },
          { id: 34, name: 'NY Club baskılı ve kapüşonlu sweatshirt', price: 760, image: 'https://static.pullandbear.net/assets/public/8c48/5530/5d8747488380/9dfb3c7c40ca/07590333827-A1M/07590333827-A1M.jpg?ts=1730991080371&w=882&f=auto',hoverImage:'https://static.pullandbear.net/assets/public/449e/1b09/15b742c58bd3/25d884c94475/07590333827-A3M/07590333827-A3M.jpg?ts=1730991053516&w=882&f=auto' ,category: 'sweatshirts', gender: 'women' },
          { id: 35, name: 'Cowgirl yazılı ve grafik baskılı t-shirt', price: 1690, image: 'https://static.pullandbear.net/assets/public/2528/2621/9d024204898f/4b1c8be99686/07249244800-A1M/07249244800-A1M.jpg?ts=1728396504616&w=882&f=auto',hoverImage:'https://static.pullandbear.net/assets/public/67b7/d9b8/28254183b9e5/e8c034e9aef4/07249244800-A4M/07249244800-A4M.jpg?ts=1728396479868&w=882&f=auto' ,category: 'tshirts', gender: 'women' },
          { id: 36, name: 'Baklava desenli baggy pantolon', price: 940, image: 'https://static.pullandbear.net/assets/public/cbb7/05f3/975749aaa2e4/fa04b79909a6/07679313087-A1M/07679313087-A1M.jpg?ts=1727858304415&w=882&f=auto',hoverImage:'https://static.pullandbear.net/assets/public/dc29/9ebd/7bee4bae87e8/97991d6698a1/07679313087-A4M/07679313087-A4M.jpg?ts=1727858244126&w=882&f=auto' ,category: 'jeans', gender: 'women' },
          { id: 37, name: 'Çizgili ve kısa kollu t-shirt', price: 190, image: 'https://static.pullandbear.net/2/photos//2024/V/0/1/p/3243/383/069/3243383069_2_1_0.jpg?ts=1711553221665&w=882&f=auto',hoverImage:'https://static.pullandbear.net/2/photos//2024/V/0/1/p/3243/383/069/3243383069_2_7_0.jpg?ts=1711469281607&w=882&f=auto' ,category: 'tshirts', gender: 'women' },
          { id: 38, name: 'Balloon fit baggy jean', price: 940, image: 'https://static.pullandbear.net/assets/public/2a0a/16ea/de574e4594e5/957839519425/07685414400-A1M/07685414400-A1M.jpg?ts=1725439204997&w=882&f=auto',hoverImage:'https://static.pullandbear.net/assets/public/31b1/740d/20dc44318172/2e6256583f04/0768534040000-A7M/0768534040000-A7M.jpg?ts=1725544771090&w=882&f=auto' ,category: 'jeans', gender: 'women' },
          { id: 39, name: 'Kemerli kaşe kaban', price: 1390, image: 'https://static.pullandbear.net/assets/public/3a71/4827/5b0a4a4ba7f1/6fd0295a1b94/07751409401-A1M/07751409401-A1M.jpg?ts=1727878445284&w=882&f=auto',hoverImage:'https://static.pullandbear.net/assets/public/86df/d024/721b41e68e1e/92bacd3cffce/07751309401-A7M/07751309401-A7M.jpg?ts=1727942738097&w=882&f=auto' ,category: 'jackets', gender: 'women' },
          { id: 40, name: 'San Francisco grafik baskılı ve kapüşonlu sweatshirt', price: 1190, image: 'https://static.pullandbear.net/assets/public/9102/c9bf/d1a84895aa0d/57ea7751a16f/03594317506-A1M/03594317506-A1M.jpg?ts=1732803383348&w=882&f=auto',hoverImage:'https://static.pullandbear.net/assets/public/4679/d846/bcb54c2daf0c/2b8544e25794/03594317506-A7M/03594317506-A7M.jpg?ts=1733314930652&w=882&f=auto' ,category: 'sweatshirts', gender: 'women' },
        ],
        };
    },
    computed: {
        filteredProducts() {
            // Önce cinsiyete göre filtrele
            let filtered = this.products;
        
        // Eğer gender 'all' değilse, cinsiyete göre filtrele
        if (this.gender !== 'all') {
            filtered = filtered.filter(product => product.gender === this.gender);
        }
            
            // Kategori filtreleme
            if (this.defaultCategory !== 'all') {
                filtered = filtered.filter(product => product.category === this.defaultCategory);
            }
            
            return filtered;
        }
    }
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

.add-to-cart-btn {
  background-color: #000;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 4px;
  cursor: pointer;
  margin: 8px 0;
  font-size: 14px;
  transition: background-color 0.3s ease;
}

.add-to-cart-btn:hover {
  background-color: #333;
}
  </style>
  