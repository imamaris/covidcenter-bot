# Membuat Bot Messenger Informasi Covid dengan Wit.AI

## Pendahuluan
Facebook Messenger adalah platform yang menjangkau lebih dari satu miliar orang di seluruh dunia. Sekarang Facebook telah membuka akses untuk mengirim dan menerima pesan, banyak peluang baru terbuka.

Anda dapat meningkatkan kecerdasan bot obrolan Anda dengan dua kata kunci teknologi: Natural Languange Process (NLP) dan Natural Languange Understanding (NLU). Kedua hal itu bisa membuat bot obrolan Anda tidak canggung bertanya lagi dan lagi apa yang baru saja dikatakan seseorang. Anda dapat membaca [panduan singkat](https://wit.ai/docs/quickstart)  yang disiapkan oleh tim Wit.ai.

Dalam tutorial kali ini, kita akan membangun bot messenger berbasis API yang memberikan informasi tentang covid di Indonesia ke akun facebook Anda. Aplikasi tersebut akan dapat memproses teks pengguna dengan menggunakan proses NLP pada wit.ai dan menanggapi data pengguna tentang covid yang mereka inginkan. Hal utama yang akan kita jelajahi adalah bagaimana:

*   Rancang interaksi pengguna
*   Membuat dan melatih aplikasi Wit.AI untuk melakukan Natural Languange Process (NLP) dan Natural Languange Understanding (NLU)
*   Integrasi Wit.AI dengan facebook messenger

## Pertama, Apa perbedaan antara NLP dengan NLU?

NLP membantu Anda memecah kalimat menjadi hal-hal yang disebut entitas. Ini seperti pembelajaran pada sekolah dasar untuk bot Anda. Misalnya, NLP dapat membaca kalimat "Jumlah covid di Bogor" dan mengetahui ada entitas covid, bahwa ada entitas lain yang mendeskripsikan lokasi, ada entitas covid dan bogor.

Terkadang hanya memiliki kata-kata dalam kalimat sudah cukup. Anda dapat mengekstrak kategori atau kata kunci dan dari sana Anda dapat mengkostumisasi bot obrolan Anda untuk melakukan sesuatu. Tetapi untuk lebih pintar, Anda perlu membawa bot Anda ke jenjang yang lebih tinggi yaitu universitas. NLU membantu Anda mengetahui apa arti kalimat itu. User memintasesuatu pada sesuatu. Dan karena itu bot obrolan kemudian dapat bereaksi dan merespons berdasarkan apa yang dilakukan user dan dengan apa. Dengan kata lain, dengan NLU bot obrolan Anda dapat mengetahui konsep manusia seperti intent atau sentimen.

## Prasyarat

*   Membuat akun [Wit.ai](https://wit.ai/) 
*   Silahkan clone bot messenger kami di [Wit.ai Covid Center Demo base-setup](https://github.com/imamaris/covidcenter-bot/tree/base-setup) branch dari GitHub
*   Generate link API facebook Messenger [Link](https://to-be-announced-link)

## Rancang Interaksi Pengguna

Saat mendesain aplikasi dengan interaksi, penting untuk memahami berbagai cara pengguna dapat berinteraksi dengan aplikasi Anda. Beberapa teknik yang dapat membantu dalam memodelkan percakapan adalah dengan membuat diagram alurdan menulis naskah. Untuk aplikasi covid ini, pertama kita akan melihat alur aksi dari aplikasi ini:

### Alur Aksi

![alt text](./assets/flow.png 'Cara Kerja Aplikasi')

mari kita tulis skrip untuk melihat secara garis besarnya:
```
User: "Hallo"/"Hi"

bot:  "Hi, Selamat datang di Covid Center Indonesia. I'm Cocid. Apakah Anda menginginkan informasi covid terbaru di daerah Anda?"

User: "Yes"

bot:  "Dimana domisili Anda Tinggal ?"

User: "Jakarta Selatan" / (send a location)

bot: "Hari ini, kita memiliki 500 kasus baru. 100 sembuh, 0 meninggal. Cocid harap kamu #dirumahaja ya dan lakukan tes pada rumah sakit rujukan pemerintah jika Anda memiliki indikasi berikut::
1. Tidak bisa mencium dan merasakan
2. Susah bernafas
3. demam
4. batuk kering
5. kelelahan

User: "Rumah sakit rujukan"

bot : Ada 3 lokasi rumah sakit rujukan di Jakarta Selatan (get intent:location)
1. Rumah Sakit ABC
2. Rumah Sakit DEF
3. Rumah Sakit GHI

"
```

Sekarang mari kita pikirkan skenario jika pengguna memasukkan teks yang menyimpang:
```

User: "Hallo"/"Hi"

bot:  "Hi, Selamat datang di Covid Center Indonesia. I'm Cocid. Apakah Anda menginginkan informasi covid terbaru di daerah Anda?"

User: "Saya mau rapid tes"

Wit:  "Maaf, saya tidak mengerti. Apakah Anda ingin informasi covid terbaru di daerah Anda ?""

User: "Ya"

Wit:  "Where is your domicile ?"

User: "Jakarta Selatan" / (send a location)

bot: "Hari ini, kita memiliki 500 kasus baru. 100 sembuh, 0 meninggal. Cocid harap kamu #dirumahaja ya dan lakukan tes pada rumah sakit rujukan pemerintah jika Anda memiliki indikasi berikut::
1. Tidak bisa mencium dan merasakan
2. Susah bernafas
3. demam
4. batuk kering
5. kelelahan

User: "Rumah sakit rujukan"

bot : Ada 3 lokasi rumah sakit rujukan di Jakarta Selatan (get intent:location)
1. Rumah Sakit ABC
2. Rumah Sakit DEF
3. Rumah Sakit GHI
" 

```

Ada banyak skenario lain yang perlu dipertimbangkan juga, tetapi untuk tutorial mari kita fokus pada kasus ini.

## Let's Get Started

1. Buat akun Anda di : https://wit.ai

2. Membuat sebuah aplikasi Wit.ai:
    1. Masukkan nama aplikasi contoh: CovidDemo
    2. Pilih **Indonesia**
    3. Pilih **Open** or **Private** untuk visibilitas
    4. Klik **Create**.

![alt text](./assets/create_apps.gif 'Create App')

3. Lakukan Clone Covid Center Bot [Wit.ai Covid Center demo base-setup](https://github.com/imamaris/covidcenter-bot)

4. Selanjutnya, kita akan membuat intents untuk menentukan ucapan user seperti apa yang akan dipahami oleh aplikasi wit.AI kita. Pada dashboard klik intents, klik "**+ Intents**" untuk menambahkan intents baru.

![alt text](./assets/create_intent.gif 'Create App')

5. Selanjutnya, kita akan melakukan training intents, entitas dan utterance (ucapan) yang kemungkinan user akan lakukan pada menu understanding. Menambahkan sebuah utterance:
    1. Pastikan anda di halaman **Train Your App** dengan memilih **Understanding** pada menu sebelah kiri.
    2. ketik `jumlah covid di jakarta` ke dalam **Utterance** text box.
    3. Beri label entities dalam utterence dengan menyorot `covid` dengan mouse Anda dan ketik `covid_intents`, klik **Create Intents** sebagai jenis Entitas dan sorot kembali `jakarta` dan pilih `wit/location`.
    4.  Submit utterance pertama anda dengan mengklik **Train and Validate**. Training akan dimulai beberapa detik - anda bisa mengecek status training pada pojok kanan atas

![alt text](./assets/training.gif 'Create App')

Untuk mengetahui apakah training kita sudah berhasil bisa dicoba kembali memasukkan kata yang berkaitan dengan training yang kita lakukan yaitu covid dan jakarta dan pastikan confidence mencapai diatas 90% untuk menguji validitas intents kita.
![alt text](./assets/test_validitas.png 'Create App')

Untuk mengecek apakah utterance yang kita training sudah benar kita akan mengecek melalui request GET API ke Wit.AI yaitu dengan :
``` 
$ curl -XGET "https://api.wit.ai/utterances?v=$APPID&limit=10" -H "Authorization: Bearer $YOURTOKEN"
```
![alt text](./assets/get_api.png 'Create App')

Anda mungkin pernah mendengar bahwa bagian terpenting dari machine learning adalah pelatihan data. Pada step ini, kami hanya menyediakan aplikasi Wit kami dengan satu titik data, jadi mari pikirkan variasi alami yang mungkin direspon oleh pengguna dan ulangi langkah # 4 sampai # 5.


## Referensi

* [Wit Speech API](https://wit.ai/docs/http#post__speech_link)
* [Wit Documentation](https://wit.ai/docs)
* [Wit GitHub](https://github.com/wit-ai)
* [Wit Blog](https://wit.ai/blog)

## Contributing
See the [CONTRIBUTING](CONTRIBUTING.md) file for how to help out.

## License
Wit.ai Covid Center Bot is licensed, as found in the [LICENSE](LICENSE) file.