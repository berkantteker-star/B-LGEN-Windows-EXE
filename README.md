# BİLGEM — Kurum Bazlı Yerel Laboratuvar Yönetimi

BİLGEM, DAVIVA LAB'dan bağımsız bir Windows uygulaması olarak geliştirilmektedir. **DAVIVA LAB kaynak deposuna hiçbir değişiklik yapılmaz.**

## Güncel durum
- Windows Electron paketleme: mevcut.
- Yerel SQLite veritabanı ve ilk yönetici hesabı: temel uygulama mevcut.
- Tek bilgisayar / sunucu modu seçimi: ilk kurulumda mevcut; güvenli çok istemcili ağ sunucusu **henüz tamamlanmadı**.
- Firebase zorunlu olmayan yerel giriş: temel uygulama mevcut.
- Yerel modül ekranları: genel kayıt formları; **DAVIVA LAB modülleriyle işlevsel eşdeğerlik henüz yok**.
- Eski DAVIVA LAB kaynakları derleme sırasında `web/` klasörüne alınır, fakat yerel modda kullanılmaz. Kaynak kodları BİLGEM deposuna bağımsız olarak kopyalanmış değildir.

## DAVIVA LAB → BİLGEM tam özellik taşıma planı
1. **Modül envanteri:** DAVIVA LAB'daki tüm sayfalar, eylemler, yetkiler, Firebase koleksiyonları ve dosya işlemlerinin eşleştirilmesi.
2. **Veri katmanı:** Firebase Firestore/Storage/Auth çağrılarını yerel REST API, SQLite ve yerel dosya depolamasına taşıma.
3. **Stok:** Ürün, barkod, lot, miat, stok hareketi, kritik stok, sayım, raporlar.
4. **Personel ve yetki:** Kullanıcı yönetimi, roller, oturum, audit log, şifre yenileme.
5. **Envanter/cihaz:** Cihaz kartları, bakım, kalibrasyon, arıza, belge ilişkilendirme.
6. **Kalite:** İç/dış kalite kontrol, uygunsuzluk, DÖF, süreç göstergeleri.
7. **Belgeler ve Office:** Dosya yükleme/indirme, sürümleme, yetkiler, güvenli saklama.
8. **Isı-nem ve takvim:** Manuel/sensör kayıtları, uyarılar, görevler, özel günler.
9. **Sunucu modu:** TLS, istemci kimlik doğrulama, ağ erişimi, eşzamanlılık ve yedekleme.
10. **Testler:** DAVIVA LAB ekranlarıyla fonksiyon bazında kabul testleri, kurum izolasyonu, çevrimdışı test, veri aktarımı.

## Güvenlik notu
Bu sürüm **pilot geliştirme** aşamasındadır. Sağlık verileri veya gerçek kurum kayıtları için kullanılmadan önce güvenlik, yetki, yedekleme ve veri bütünlüğü testleri tamamlanmalıdır. Her kuruma ayrı veritabanı ve erişim politikası gerekir. Eski Firebase hesabına otomatik bağlanılmaz.

## Windows derleme
GitHub Actions → BİLGEM Windows EXE → Run workflow. Başarılı çalıştırmanın Artifacts bölümünden `BILGEM-Windows-EXE` ZIP dosyasını indirin.
