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

## Prasyarat

*   membuat sebuah akun  [Wit.ai](https://wit.ai/)
*   Clone repository kami di [Wit.ai Covid Center Demo](https://github.com/imamaris/covidcenter-bot) from GitHub
*   Buat Halaman facebook | [Link](https://www.facebook.com/pages/create)
*   Buat aplikasi facebook | [Tutorial](https://developers.facebook.com/docs/apps/)
*   Download & Install Ngrok [Link](https://ngrok.com/download)

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

## Memahami Istilah di aplikasi Wit untuk melakukan natural language processing (NLP)

Sebelum kita melatih aplikasi kecerdasan kita, kita harus mempelajarinya intent, entities, traits, dan utterances.
Jika Anda sudah mempelajari istilah-istilah itu, Anda dapat pergi ke [Bagian selanjutnya](https://github.com/imamaris/covidcenter-bot/blob/master/README.md#training-your-wit-app-to-do-natural-language-processing-nlp)

Studi Kasus:
Kami ingin memahami apa yang ingin dilakukan oleh pengguna akhir kita. Sebagai contoh:

- Pertanyaan tentang cuaca
- Pesan restoran
- Buka pintu garasi

The problem is that there a millions of different ways to express a given intent. For instance, all the following expressions should be mapped to the same intent:

"Bagaimana cuaca di Jakarta?"
"Informasi cuaca besok di Jakarta."
"Apakah sekarang cerah atau hujan di Jakarta?"

Ekspresi itu menanyakan tentang cuaca. Bagaimana dengan entitas?
Entitas adalah objek yang dirujuk dalam maksud kalimat.

"Bagaimana cuaca di **Jakarta** ?"
Jakarta adalah **kota** tempat kita menanyakan cuaca.

"Informasi cuaca **besok** di **Jakarta**."
Besok adalah **waktu** ketika kita bertanya tentang cuaca.

"Apakah **sekarang** **cerah** atau **hujan** di **Jakarta**?"
dan **cerah** dan **hujan** adalah pilihan yang kita tanyakan tentang cuaca.

Entitas membuat mesin memahami objek apa yang terkait dengannya intent.
example: "Informasi cuaca **besok** di **Jakarta**."

Intent: Bagaimana cuaca , Entities: Kota: Jakarta Waktu: Besok
Mesin dapat melakukan kueri ke database dalam tabel cuaca(intent) dengan jakarta sebagai kota dan kueri besok (entities)

Jadi apa itu trait ?
Sifat adalah kecenderungan suatu intent.
Kita bisa memberikan contoh sentimen seperti ini pada reaction_intent.

"Sedih" (negative)
"OMG :(" (negative)
"Saya tidak percaya ini. Saya menangis" (negative)
"Luar Biasa" (positive)

Utterances adalah contoh data yang mendefinisikan sebuah kalimat untuk dikategorikan menjadi sebuah intent dan memiliki entities dan traits.
Istilah ini akan digunakan untuk melatih data, sebagai contoh: 

![pic utterance](/examples/utterance.png)

Sekarang setelah kita mengerti, mari kita latih aplikasi Wit kita untuk memproses tanggapan pengguna terhadap aplikasi tersebut.

## Mari kita Mulai

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
```sh 
$ curl -XGET "https://api.wit.ai/utterances?v=$APPID&limit=10" -H "Authorization: Bearer $YOURTOKEN"
```
![alt text](./assets/get_api.png 'Create App')

Anda mungkin pernah mendengar bahwa bagian terpenting dari machine learning adalah pelatihan data. Pada step ini, kami hanya menyediakan aplikasi Wit kami dengan satu titik data, jadi mari pikirkan variasi alami yang mungkin direspon oleh pengguna dan ulangi langkah # 4 sampai # 5.

Selanjutnya, kita bisa juga melakukan pelatihan data aplikasi Wit kita dengan automatisasi menggunakan API. perhatikan step berikut :

1. Anda bisa melakukan clone github kami [Bagaimana menginput Utterance secara automatis dengan API](https://github.com/imamaris/covidcenter-bot/tree/covid-template/init-data)
2. Sekarang anda dapat melihat file di [Dataset covid intent.tsv](https://github.com/imamaris/covidcenter-bot/tree/covid-template/init-data/datasets), file tersebut adalah template untuk melatih aplikasi kita. 
3. Update file `covid_intent.tsv` sesuai keinginan anda dan ditambahkan

```tsv
covid meninggal   covid   0   5
covid di Jaksel    location   9   15
covid di Bogor    location   9   15
rumah sakit rujukan   location   0   11
gejala covid    covid   0   6
covid di Bandung    location   9   16
zona merah di Jakarta   covid   0   10
total covid di Bandung    covid   0   5
zona hijau di jakarta    covid   9   10
```
4. Selanjuta, kita butuh [init data script](https://github.com/imamaris/covidcenter-bot/tree/init-data) untuk melatih data anda. anda bisa cek script dibawah ini:

covid_intents.js
```js
const fs = require('fs');
const fetch = require('node-fetch');
const { validateUtterances } = require('../shared')

const DOUBLETAB = '   ';
const fileName = 'init-data/covid_intent.tsv'
const intentName = 'covid_intents'
const entityName = 'covid:covid'
const data = fs
  .readFileSync(fileName, 'utf-8')
  .split('\r\n')
  .map((row) => row.split(DOUBLETAB))

const samples = data.map(([text, value, start, end]) => {
  return {
    text: text,
    intent: intentName,
    entities: [
        {
            entity: entityName,
            start: start,
            end: end,
            body: value,
            entities: [],
        }
    ],
    traits: [],
  }
});

validateUtterances(samples).then((res) => console.log(res))
```
Lihatlah, kita mempunyai text, value, start, end dan anda bisa cek kembali data kita pada **covid_intent.tsv** . Berikut penjelasannya:

- **text** adalah sebuah utterance menggambarkandari bagaimana user akan melakukan chat di facebook messenger. Pada tsv file kita, pada kalimat kolom pertama adalah utterance dari user. ex: "covid di Jaksel"

- **value** adalah entities di aplikasi Anda, bagaimana aplikasi akan mempelajari kata yang kita soroti dan melatih itu semua utterance dari user. Pada **covid_intent.tsv**, kamu bisa melihat kata selanjutnya setelah utterance pada data kita. ex: "covid"

- **start** adalah awal dari index dalam text data utterance anda. Kamu bisa melihat pada **covid_intent.tsv** kolom kata ketiga.

- **end** adalah akir dari index text utterance anda yang ingin anda training.

Sekarang kamu dapat mencoba ke bot facebook messenger anda, pada step selanjutnya.

## Integrasi Wit dengan Messenger Bot Anda

Silahkan mengunduh Tutorial dari [base setup branch](https://github.com/imamaris/covidcenter-bot/tree/base-setup), aplikasi akan mampu melakukan penulisan teks dan jawaban dari intent dan sentiment. Pada bagian ini, kami akan menambahkan cara mengambil covid

Sebelum memulai, Anda perlu membuat beberapa hal. Harap pastikan Anda memiliki semua yang berikut ini:
- Facebook Page:Halaman Facebook akan digunakan sebagai identitas experience Messenger Anda. Saat orang mengobrol dengan aplikasi Anda, mereka akan melihat nama Halaman dan gambar profil Halaman. Untuk membuat halaman baru, silahkan kunjungi https://www.facebook.com/pages/create
- Facebook Developer Account: Akun developer Anda diperlukan untuk membuat aplikasi baru, yang merupakan paling penting dari integrasi Facebook. Anda dapat membuat akun developer baru dengan membuka situs web Developer Facebook dan mengklik tombol 'Memulai'.
- Facebook App: Aplikasi Facebook berisi pengaturan untuk pengalaman Messenger Anda, termasuk token akses. Untuk membuat sebuah aplikasi baru, Anda dapat mengunjungi [app dashboard](https://developers.facebook.com/apps).

### Konfigurasi APlikasi

Tambahkan Platform Messenger ke aplikasi Facebook Anda
1. Di sidebar pengaturan aplikasi Anda di bawah 'PRODUCTS', klik '+ Add Product'.
2. Arahkan kursor ke atas 'Messenger' untuk menampilkan opsi.
3. Klik Tombol 'Set Up'.
Platform Messenger akan ditambahkan ke aplikasi Anda, dan konsol pengaturan Messenger akan ditampilkan.

### Menambahkan webhook ke bot Messenger Anda

Buka [Wit.ai Covid Center bot demo](https://github.com/imamaris/covidcenter-bot/tree/bot/index.js) int dan jalankan

Dapatkan `ACCESS_TOKEN` dan `VERIFY_TOKEN` dari aplikasi Anda. Lihatlah [Webhook Setup](https://developers.facebook.com/docs/messenger-platform/getting-started/webhook-setup/) untuk referensi lebih lanjut.

Selanjutkan lakukan perbaharui variabel `ACCESS_TOKEN` dan `VERIFY_TOKEN` untuk mendapatkan webhook sebagai berikut:
```js
const ACCESS_TOKEN = '' // line 11
let VERIFY_TOKEN = '' // line 74
```

Jika Anda ingin membuat kode dari awal, Anda bisa membaca [webhook tutorial](https://developers.facebook.com/docs/messenger-platform/getting-started/webhook-setup/)

### Uji Webhook Anda

Sekarang setelah Anda memiliki semua kode untuk webhook dasar, sekarang saatnya untuk mengujinya dengan mengirimkan beberapa permintaan sampel ke webhook Anda yang berjalan di localhost.
1. Jalankan perintah berikut pada baris perintah untuk memulai webhook Anda di localhost:
```sh
node bot/index.js
```

2. Dari command prompt terpisah, uji verifikasi webhook Anda dengan mengganti token verifikasi Anda ke dalam permintaan cURL ini:
```sh
curl -X GET "localhost:1337/webhook?hub.verify_token=<YOUR_VERIFY_TOKEN>&hub.challenge=CHALLENGE_ACCEPTED&hub.mode=subscribe"
```

Jika verifikasi webhook Anda berfungsi seperti yang diharapkan, Anda akan melihat yang berikut ini:
- `WEBHOOK_VERIFIED` masuk ke command line tempat proses node Anda berjalan.
- `CHALLENGE_ACCEPTED` masuk ke command line tempat Anda mengirim permintaan cURL.

3. Uji webhook anda dengan mengirimkan permintaan cURL ini:
```sh
curl -H "Content-Type: application/json" -X POST "localhost:1337/webhook" -d '{"object": "page", "entry": [{"messaging": [{"message": "TEST_MESSAGE"}]}]}'
```

Jika webhook Anda berfungsi seperti yang diharapkan, Anda akan melihat yang berikut ini:
- `TEST_MESSAGE` masuk ke command line tempat proses node Anda berjalan.
- `EVENT RECEIVED` masuk ke command line tempat Anda mengirim permintaan cURL.

### Deploy webhook Anda

Jalankan ngrok:

```sh
ngrok http 1337
```

![ngrok](/examples/ngrok.png)

Kita dapat mengakses API Anda dari contoh ini : https://3c37b05d146e.ngrok.io (ini adalah url acak dari ngrok, anda dapat membuat link lain)

### Set webhook dan NLP

Setelah kita mendapatkan https webhook url, dan berhasil Wit.API, kita mengubah webhook aplikasi facebook kita dan menghubungkan wit api kita.

Konfigurasi webhook untuk aplikasi anda

![wit messenger](../examples/edit_callback_url.png)

1. Pada 'Webhooks' section of the Messenger settings console, Klik tombol 'Setup Webhooks'.
2. Pada bagian 'Callback URL', masukkan ngrok URL untuk webhook Anda. (example: https://3c37b05d146e.ngrok.io)
3. Pada bagian 'Verify Token', masukkan verify token untuk webhook Anda. Lihat [Step 4 of Webhook Setup](https://developers.facebook.com/docs/messenger-platform/getting-started/webhook-setup/) sebagai referensi lebih lanjut.
4. Klik 'Verify and Save' untuk konfirmasi callback URL Anda.

Integrasi NLP dengan inboc Halaman memungkinkan Anda membuat aplikasi Wit.ai secara otomatis dan mem-bootstrapnya dengan percakapan sebelumnya dari Halaman Anda langsung dari pengaturan konsol aplikasi Facebook. Sampel yang dikompilasi ke dalam aplikasi Wit.ai ini didasarkan pada percakapan nyata yang dilakukan Halaman Anda dengan pengguna.

Untuk mencoba fitur Inbox Halaman NLP Built-in dengan experience Messenger Anda, lakukan hal berikut:

![wit messenger](/examples/link_wit_messenger.png)

1. Pada setting aplikasi anda, pergi ke Messenger > Settings.
2. Enable built-in NLP untuk aplikasi anda.
3. Pada menu 'Select a Model' dropdown, pilih 'Custom'.
4. Klik 'Link to existing Wit App'
5. Pilih aplikasi Anda
6. Masukkan Wit Server Access Token Anda [Lihat bagaimana mendapatkan Wit Access Token](https://github.com/imamaris/covidcenter-bot/blob/master/README.md#wit-ai-api)

### Uji chatbot Anda

Sekarang, setelah Anda mengatur webhook dan NLP, Anda dapat menguji chatbot Anda.

<img src="../examples/neutral_positive.png" width="30%"><img src="../examples/negative.png" width="30%"><img src="../examples/p_negative.png" width="30%">

Enjoy, and hack your bot !!! 🤖 📱 

🏆🏆🏆

<img src="../examples/test_covid.png" width="40%"><img src="../examples/test_messenger_covid.gif" width="40%">

## Referensi

* [Wit Speech API](https://wit.ai/docs/http#post__speech_link)
* [Wit Documentation](https://wit.ai/docs)
* [Wit GitHub](https://github.com/wit-ai)
* [Wit Blog](https://wit.ai/blog)

## Contributing
See the [CONTRIBUTING](CONTRIBUTING.md) file for how to help out.

## License
Wit.ai Covid Center Bot is licensed, as found in the [LICENSE](LICENSE) file.