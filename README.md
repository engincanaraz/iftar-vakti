# İftara Ne Kadar Kaldı?  

## 🕌 Genel Bakış  
Bu uygulama, Ramazan ayı boyunca iftar (oruç açma) ve sahur (imsak) vakitlerine geri sayımı gösterir.  
Türkiye'deki tüm şehirler için namaz vakitlerini sağlar ve görsel bir geri sayım sayacı sunar.  

<img width="835" alt="Ekran Resmi 2025-03-10 07 08 58" src="https://github.com/user-attachments/assets/7a9bece5-b428-48b9-8d16-dbe4beba02da" />


## ✨ Özellikler  
- 🕒 **Gerçek zamanlı iftar ve sahur geri sayımı**  
- 📍 **Türkiye'deki 81 il için namaz vakitleri**  
- 📊 **Geçen sürenin yüzdesini gösteren görsel ilerleme çubuğu**  
- 📅 **Türkçe formatta güncel tarih gösterimi**  
- 💾 **Son seçilen şehri hatırlama özelliği**  
- 🔄 **Otomatik olarak iftar ve sahur geri sayımı arasında geçiş yapma**  

## 🛠 Kullanılan Teknolojiler  
- ⚛️ **React (TypeScript ile)**  
- ⚡ **Vite**  
- 🎨 **Tailwind CSS**  
- 🔗 **Lucide React (ikonlar için)**  

## Eğer mobilde kullanmak isterseniz, iftar-vakti.netlify.app sitesine gidin.

## 📱Android (Chrome veya Firefox ):

1- Sağ üst köşedeki üç nokta menüsüne tıklayın.

2- “Ana Ekrana Ekle” seçeneğini seçin.

## 🍏 iOS (Safari):

1- Alt kısımdaki paylaşma simgesine tıklayın.

2- “Ana Ekrana Ekle” seçeneğine tıklayın.

İşlem tamamlandı! Artık uygulama simgesine tıklayarak hızlıca erişebilirsiniz.

⭐️ Eğer projeyi beğendiyseniz, yıldız vermeyi unutmayın! ⭐️

## 🚀 Kurulum  

1. **Depoyu klonlayın:**  
   ```sh  
   git clone <repository-url>  
   cd <repository-folder>  
   ```  
2. **Bağımlılıkları yükleyin:**  
   ```sh  
   npm install  
   ```  
3. **Proje kök dizinine bir `.env` dosyası oluşturun ve API anahtarınızı ekleyin:**  
   ```sh  
   VITE_API_KEY=api_anahtarınız  
   ```  
4. **Geliştirme sunucusunu başlatın:**  
   ```sh  
   npm run dev  
   ```  

## 🔗 API Kullanımı  
Bu uygulama, Türkiye'deki şehirler için namaz vakitlerini almak amacıyla **CollectAPI**'yi kullanır.  
API erişimi için aşağıdaki adımları izleyin:  

1. [CollectAPI](https://collectapi.com/) adresinden kaydolun.  
2. **Namaz Vakitleri API'sine abone olun.**  
3. **API anahtarınızı alıp `.env` dosyanıza ekleyin.**  


## 🏗 Üretim İçin Derleme  

Uygulamayı **üretime hazır hale getirmek** için:  
```sh  
npm run build  
```  
Üretim ortamını **ön izlemek** için:  
```sh  
npm run preview  
```  

