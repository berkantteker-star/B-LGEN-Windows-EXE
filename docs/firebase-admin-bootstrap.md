# BİLGEM – İlk merkezi yönetici kurulumu

Firebase project ID: `bilgem-dev`. Bu belge yalnızca BİLGEM içindir.

## Güvenli kurulum

1. Firebase Authentication'da oluşturulan ilk kullanıcının UID değerini **Firebase Console > Authentication > Users** bölümünden alın. Şifre veya servis hesabı özel anahtarını hiçbir yere paylaşmayın.
2. Yetkili geliştirici, yalnızca `bilgem-dev` projesine erişen güvenilir bir yönetim ortamında Firebase Admin SDK ile kullanıcıya `{ platformRole: 'super_admin' }` custom claim'i atasın. **Bu işlem istemci uygulamasından yapılmamalıdır.**
3. Kullanıcı oturumunu yenilesin ve ID token'ını yeniden alsın. Yönetim arayüzü yetkiyi yalnızca sunucu doğrulaması sonrasında göstersin.
4. Üretime açmadan önce çok faktörlü kimlik doğrulama, denetim kayıtları ve yetki geri alma prosedürü uygulansın.

## Veri modeli (taslak)

- `institutions/{institutionId}`: Kurum metaverisi
- `institutions/{institutionId}/members/{uid}`: Kurum üyeliği, rol ve modül yetkileri
- `institutions/{institutionId}/stock/{itemId}`: Stok kartları
- `institutions/{institutionId}/devices/{deviceId}`: Cihazlar
- `institutions/{institutionId}/qualityControls/{recordId}`: Kalite kontrol kayıtları
- `institutions/{institutionId}/documents/{documentId}`: Doküman metaverisi
- `licenses/{institutionId}`: Lisans durumu (yalnızca güvenilir sunucu tarafından yönetilir)

## Güvenlik sınırı

`firestore.rules` şu anda bütün istemci okuma/yazmalarını reddeder. Bu kuralı, güvenilir üyelik ve rol kontrolleri geliştirilip test edilmeden gevşetmeyin. Firebase Admin SDK, Firestore Security Rules'u atladığından sunucu IAM izinleri ayrıca kısıtlanmalıdır. Gerçek DAVIVA LAB verileri bu projeye kopyalanmamalıdır.
