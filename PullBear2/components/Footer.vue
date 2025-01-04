<template>
  <footer class="footer">
    <!-- Uygulama Bilgisi -->
    <div class="footer-section">
      <h3>Uygulamamız</h3>      
      <div class="app-links">
        <a href="https://www.apple.com/app-store/" target="_blank">
          <img src="https://static.pullandbear.net/2/static2/itxwebstandard/images/footer/downloadApp/ios.png" alt="Google Play" />
        </a>
        <a href="https://play.google.com" target="_blank">
          <img src="https://static.pullandbear.net/2/static2/itxwebstandard/images/footer/downloadApp/android.png" alt="App Store" />
        </a>
      </div>
    </div>

    <!-- Ödeme Yöntemleri -->
    <div class="footer-section">
      <h3>Ödeme Yöntemleri</h3>
      <div class="payment-methods">
        <img src="https://static.pullandbear.net/2/static2/itxwebstandard/images/payment/VISAInstallments.svg?20241128110207224196863" alt="Visa" />
        <img src="https://static.pullandbear.net/2/static2/itxwebstandard/images/payment/MasterCardInstallments.svg?20241128110207224196863" alt="Mastercard" />
        <img src="https://static.pullandbear.net/2/static2/itxwebstandard/images/payment/AMEXInstallments.svg?20241128110207224196863" alt="PayPal" />
        <img src="https://static.pullandbear.net/2/static2/itxwebstandard/images/payment/GiftCard.svg?20241128110207224196863" alt="American Express" />
        <img src="https://static.pullandbear.net/2/static2/itxwebstandard/images/payment/Discount.svg?20241128110207224196863" alt="Discover" />
        <img src="https://static.pullandbear.net/2/static2/itxwebstandard/images/payment/Troy.svg?20241128110207224196863" alt="Bitcoin" />
      </div>
    </div>

    <!-- Sosyal Medya -->
    <div class="footer-section">
      <h3>Bizi Takip Et</h3>
      <div class="social-links">
        <a href="https://www.instagram.com" target="_blank">
          <img src="https://static.pullandbear.net/2/static2/itxwebstandard/images/footer/social/21/instagram.png" alt="Instagram" />
        </a>
        <a href="https://www.facebook.com" target="_blank">
          <img src="https://static.pullandbear.net/2/static2/itxwebstandard/images/footer/social/21/facebook.png" alt="Facebook" />
        </a>
        <a href="https://www.twitter.com" target="_blank">
          <img src="https://static.pullandbear.net/2/static2/itxwebstandard/images/footer/social/21/twitterv2.png" alt="Twitter" />
        </a>
        <a href="https://www.tiktok.com" target="_blank">
          <img src="https://static.pullandbear.net/2/static2/itxwebstandard/images/footer/social/21/tiktok.png" alt="TikTok" />
        </a>
      </div>
    </div>
  </footer>
</template>

<script>
export default {
  name: "Footer",
};
</script>

<style scoped>
.footer {
  background-color: #f8f8f8;
  padding: 20px;
  display: flex;
  justify-content: space-between;
  gap: 20px;
  flex-wrap: wrap;
  border-top: 2px solid #ddd;
}

.footer-section {
  flex: 1 1 30%; /* Her bölüm eşit alan kaplasın */
  text-align: center;
}

.footer-section h3 {
  margin-bottom: 15px;
  font-size: 18px;
  color: #333;
}

.app-links a img,
.payment-methods img,
.social-links a img {
  width: 50px; /* Görsellerin boyutu */
  height: auto;
  margin: 5px;
  transition: transform 0.3s ease;
}

.app-links a img:hover,
.payment-methods img:hover,
.social-links a img:hover {
  transform: scale(1.1); /* Hover efekti */
}

.payment-methods {
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: 10px;
}

.social-links {
  display: flex;
  justify-content: center;
  gap: 15px;
}

.social-links a img {
  width: 40px;
  height: 40px;
}
</style>
