export const CATEGORIES = [
  { id: 'Fisika', nama: 'Fisika', color: 'var(--doodle-blue)', desc: 'Gaya, gerak, gravitasi, gelombang, dan listrik.' },
  { id: 'Kimia', nama: 'Kimia', color: 'var(--warm-yellow)', desc: 'Atom, molekul, reaksi zat, dan kimia organik.' },
  { id: 'Biologi', nama: 'Biologi', color: 'var(--science-green)', desc: 'Sel, fotosintesis, ekosistem, dan genetika.' },
  { id: 'Astronomi', nama: 'Astronomi', color: 'var(--playful-purple)', desc: 'Tata surya, fase bulan, bintang, & lubang hitam.' }
];

export const MATERI_DATA = [
  // --- FISIKA (3 Free + 1 PRO) ---
  {
    id: 'fis-1',
    judul: 'Hukum Gravitasi & Gerak Jatuh',
    kategori: 'Fisika',
    deskripsi: 'Mengapa apel jatuh ke tanah sementara Bulan tetap setia mengorbit Bumi?',
    tingkatKesulitan: 'Mudah',
    isPro: false,
    svgType: 'gravity',
    simulasiId: 'gravity',
    konten: [
      'Gravitasi adalah gaya tarik-menarik alami yang terjadi antara semua benda yang memiliki massa. Semakin besar massa suatu benda, semakin kuat tarikan gravitasinya. Bumi memiliki massa yang sangat besar sehingga menarik semua benda di dekatnya menuju pusat Bumi.',
      'Dalam kondisi tanpa hambatan udara (ruang hampa), semua benda yang dijatuhkan dari ketinggian yang sama akan mengalami percepatan gravitasi yang sama besar dan menyentuh tanah pada waktu bersamaan, terlepas dari beratnya!',
      'Intisari Ilmiah: Percepatan gravitasi di permukaan Bumi rata-rata adalah <span class="math-expr">g</span> = 9,8 m/s², sedangkan di Bulan hanya sekitar 1,62 m/s² (seperenam gravitasi Bumi).'
    ]
  },
  {
    id: 'fis-2',
    judul: 'Rangkaian Listrik & Hukum Ohm',
    kategori: 'Fisika',
    deskripsi: 'Memahami aliran elektron, tegangan baterai, hambatan, dan nyala lampu.',
    tingkatKesulitan: 'Menengah',
    isPro: false,
    svgType: 'circuit',
    simulasiId: 'circuit',
    konten: [
      'Arus listrik adalah aliran muatan listrik (elektron) melalui penghantar seperti kabel tembaga. Agar arus listrik dapat mengalir dan menyalakan lampu, rangkaian harus berada dalam kondisi tertutup (sakelar terhubung).',
      'Baterai memberikan beda potensial atau tegangan (<span class="math-expr">V</span>) yang mendorong elektron bergerak. Sementara itu, komponen seperti resistor atau filamen lampu memberikan hambatan (<span class="math-expr">R</span>) yang mengatur besarnya arus listrik (<span class="math-expr">I</span>) yang lewat.',
      'Intisari Ilmiah (Hukum Ohm): Kuat arus listrik berbanding lurus dengan tegangan dan berbanding terbalik dengan hambatan (<span class="math-expr">I = V / R</span>).'
    ]
  },
  {
    id: 'fis-3',
    judul: 'Tiga Hukum Newton tentang Gerak',
    kategori: 'Fisika',
    deskripsi: 'Rahasia di balik kelembaman benda, percepatan roket, dan gaya aksi-reaksi.',
    tingkatKesulitan: 'Menengah',
    isPro: false,
    svgType: 'newton',
    simulasiId: null,
    konten: [
      'Hukum I Newton (Inersia): Benda yang diam akan tetap diam, dan benda yang bergerak lurus beraturan akan terus bergerak kecuali ada gaya luar yang memengaruhinya. Itulah sebabnya tubuh kita terdorong ke depan saat bus direm mendadak.',
      'Hukum II Newton: Percepatan suatu benda sebanding dengan gaya total yang bekerja padanya dan berbanding terbalik dengan massanya (<span class="math-expr">F = m × a</span>). Mendorong troli kosong jauh lebih mudah daripada troli penuh belanjaan.',
      'Hukum III Newton (Aksi-Reaksi): Setiap aksi selalu menimbulkan reaksi yang sama besar tetapi berlawanan arah. Roket meluncur ke atas karena menyemburkan gas panas ke bawah.'
    ]
  },
  {
    id: 'fis-pro-1',
    judul: 'Fisika Kuantum & Dualitas Gelombang',
    kategori: 'Fisika',
    deskripsi: 'Eksplorasi eksklusif PRO tentang foton cahaya, interferensi gelombang, dan efek fotolistrik.',
    tingkatKesulitan: 'Sulit (PRO)',
    isPro: true,
    svgType: 'quantum',
    simulasiId: 'optics',
    konten: [
      'Pada skala atomik, cahaya dan elektron memiliki sifat ganda yang menakjubkan: mereka dapat berperilaku sebagai gelombang (mengalami interferensi dan difraksi) sekaligus sebagai partikel diskrit pembawa paket energi yang disebut kuanta atau foton.',
      'Albert Einstein menjelaskan Efek Fotolistrik dengan menunjukkan bahwa elektron hanya dapat terlepas dari permukaan logam jika frekuensi foton cahaya melampaui frekuensi ambang tertentu, terlepas dari seberapa terang cahayanya.',
      'Intisari Ilmiah: Energi satu foton dirumuskan oleh Planck dan Einstein sebagai <span class="math-expr">E = h × f</span>, di mana <span class="math-expr">h</span> adalah konstanta Planck.'
    ]
  },

  // --- KIMIA (3 Free + 1 PRO) ---
  {
    id: 'kim-1',
    judul: 'Struktur Atom: Blok Penyusun Materi',
    kategori: 'Kimia',
    deskripsi: 'Mengintip dunia super kecil yang terdiri dari proton, neutron, dan elektron.',
    tingkatKesulitan: 'Mudah',
    isPro: false,
    svgType: 'atom',
    simulasiId: null,
    konten: [
      'Segala sesuatu yang dapat kamu sentuh—air, udara, buku, hingga tubuhmu—tersusun atas partikel super kecil bernama atom. Di bagian tengah atom terdapat inti atom (nukleus) yang sangat padat.',
      'Inti atom berisi Proton yang bermuatan positif (+) dan Neutron yang tidak bermuatan (netral). Di sekeliling inti atom, Elektron yang bermuatan negatif (−) bergerak cepat pada lintasan kulit atom.',
      'Intisari Ilmiah: Pada atom netral, jumlah proton di dalam inti selalu sama dengan jumlah elektron yang mengelilinginya.'
    ]
  },
  {
    id: 'kim-2',
    judul: 'Perubahan Fisika vs Reaksi Kimia',
    kategori: 'Kimia',
    deskripsi: 'Membedakan es batu yang mencair dengan kertas yang terbakar menjadi abu.',
    tingkatKesulitan: 'Mudah',
    isPro: false,
    svgType: 'reaction',
    simulasiId: null,
    konten: [
      'Perubahan Fisika hanya mengubah wujud, bentuk, atau ukuran suatu zat tanpa menghasilkan zat baru. Contohnya air yang membeku menjadi es batu atau gula yang dilarutkan dalam air. Sifat molekulnya tetap sama.',
      'Reaksi Kimia (Perubahan Kimia) menghasilkan zat baru yang memiliki sifat berbeda dari zat asalnya. Ciri-ciri terjadinya reaksi kimia antara lain perubahan warna, terbentuknya gas/gelembung, endapan, atau perubahan suhu.',
      'Intisari Ilmiah: Besi yang berkarat, kayu yang terbakar, dan proses fermentasi tapai adalah contoh nyata perubahan kimia.'
    ]
  },
  {
    id: 'kim-3',
    judul: 'Asam, Basa, dan Skala pH',
    kategori: 'Kimia',
    deskripsi: 'Mengapa jeruk terasa masam dan sabun terasa licin di tangan?',
    tingkatKesulitan: 'Menengah',
    isPro: false,
    svgType: 'ph',
    simulasiId: null,
    konten: [
      'Larutan di sekitar kita dikelompokkan menjadi asam, netral, atau basa berdasarkan konsentrasi ion hidrogen di dalamnya. Skala pH digunakan untuk mengukur tingkat keasaman dari rentang 0 hingga 14.',
      'Zat Asam memiliki pH kurang dari 7 (contoh: air lemon, cuka, asam lambung) dan memerahkan kertas lakmus biru. Zat Basa memiliki pH lebih dari 7 (contoh: air sabun, soda kue) dan membirukan kertas lakmus merah.',
      'Intisari Ilmiah: Air murni memiliki pH tepat 7 (netral). Jika asam dan basa dicampurkan dalam takaran tepat, keduanya saling menetralkan membentuk garam dan air.'
    ]
  },
  {
    id: 'kim-pro-1',
    judul: 'Kimia Organik & Rantai Polimer',
    kategori: 'Kimia',
    deskripsi: 'Bagaimana atom karbon membentuk jutaan senyawa kehidupan hingga plastik modern.',
    tingkatKesulitan: 'Sulit (PRO)',
    isPro: true,
    svgType: 'polymer',
    simulasiId: null,
    konten: [
      'Karbon memiliki kemampuan istimewa membentuk empat ikatan kovalen stabil dengan atom karbon lainnya, menciptakan rantai lurus, bercabang, maupun cincin aromatik yang menjadi tulang punggung seluruh molekul makhluk hidup.',
      'Polimer adalah makromolekul raksasa yang terbentuk dari penggabungan ribuan unit kecil berulang (monomer) melalui reaksi polimerisasi. Contoh polimer alami adalah DNA dan selulosa, sedangkan contoh sintetis adalah polietilena.',
      'Intisari Ilmiah: Gugus fungsi seperti hidroksil (−OH) dan karboksil (−COOH) menentukan sifat kimia khas dari setiap keluarga senyawa organik.'
    ]
  },

  // --- BIOLOGI (3 Free + 1 PRO) ---
  {
    id: 'bio-1',
    judul: 'Sel: Pabrik Kehidupan Mikroskopis',
    kategori: 'Biologi',
    deskripsi: 'Mengenal organel penting di dalam sel tumbuhan dan sel hewan.',
    tingkatKesulitan: 'Mudah',
    isPro: false,
    svgType: 'cell',
    simulasiId: null,
    konten: [
      'Sel adalah unit struktural dan fungsional terkecil penyusun makhluk hidup. Di dalam setiap sel terdapat bagian-bagian kecil bernama organel yang bekerja sama layaknya mesin di sebuah pabrik.',
      'Nukleus (inti sel) berperan sebagai pusat kendali yang menyimpan materi genetik (DNA). Mitokondria berfungsi sebagai pembangkit energi sel melalui respirasi seluler.',
      'Intisari Ilmiah: Sel tumbuhan memiliki dinding sel kaku dan kloroplas untuk berfotosintesis, sedangkan sel hewan tidak memiliki kedua bagian tersebut.'
    ]
  },
  {
    id: 'bio-2',
    judul: 'Fotosintesis: Dapur Energi Tumbuhan',
    kategori: 'Biologi',
    deskripsi: 'Bagaimana daun hijau mengubah sinar matahari menjadi gula dan oksigen.',
    tingkatKesulitan: 'Mudah',
    isPro: false,
    svgType: 'photosynthesis',
    simulasiId: null,
    konten: [
      'Tumbuhan bersifat autotrof karena mampu membuat makanannya sendiri melalui proses fotosintesis yang berlangsung terutama di bagian daun yang mengandung zat hijau daun (klorofil).',
      'Akar menyerap air (H₂O) dari tanah, sementara stomata pada daun mengambil karbon dioksida (CO₂) dari udara. Dengan bantuan energi cahaya matahari, kedua bahan ini diolah menjadi glukosa (gula) dan gas oksigen (O₂).',
      'Intisari Ilmiah: Reaksi ringkas fotosintesis adalah 6CO₂ + 6H₂O + Cahaya → C₆H₁₂O₆ (Glukosa) + 6O₂ (Oksigen).'
    ]
  },
  {
    id: 'bio-3',
    judul: 'Ekosistem & Aliran Rantai Makanan',
    kategori: 'Biologi',
    deskripsi: 'Hubungan saling ketergantungan antara produsen, konsumen, dan pengurai.',
    tingkatKesulitan: 'Menengah',
    isPro: false,
    svgType: 'ecosystem',
    simulasiId: null,
    konten: [
      'Ekosistem adalah interaksi timbal balik antara komponen biotik (makhluk hidup) dan komponen abiotik (cahaya, air, tanah, suhu) di suatu lingkungan.',
      'Dalam rantai makanan, energi mengalir dari Produsen (tumbuhan hijau), menuju Konsumen Tingkat I (herbivora), Konsumen Tingkat II (karnivora/omnivora), hingga akhirnya diuraikan kembali ke tanah oleh Dekomposer (jamur dan bakteri).',
      'Intisari Ilmiah: Setiap perpindahan tingkat trofik hanya meneruskan sekitar 10% energi, sehingga populasi produsen selalu jauh lebih besar daripada predator puncak.'
    ]
  },
  {
    id: 'bio-pro-1',
    judul: 'Rekayasa Genetika & Teknologi CRISPR',
    kategori: 'Biologi',
    deskripsi: 'Memahami cara ilmuwan menyunting kode DNA secara presisi untuk terapi medis.',
    tingkatKesulitan: 'Sulit (PRO)',
    isPro: true,
    svgType: 'dna',
    simulasiId: null,
    konten: [
      'DNA membawa cetak biru genetik seluruh makhluk hidup dalam urutan empat basa nitrogen: Adenin (A), Timin (T), Sitosin (C), dan Guanin (G). Perubahan kecil pada urutan ini dapat memengaruhi sifat atau kesehatan organisme.',
      'Teknologi CRISPR-Cas9 bekerja seperti "gunting molekuler" yang dipandu oleh RNA pemandu (gRNA) untuk menemukan lokasi spesifik pada untai DNA, memotongnya, dan memperbaiki mutasi penyebab penyakit genetik.',
      'Intisari Ilmiah: Pasangan basa DNA bersifat komplementer: Adenin selalu berpasangan dengan Timin (A–T), dan Sitosin selalu berpasangan dengan Guanin (C–G).'
    ]
  },

  // --- ASTRONOMI (3 Free + 1 PRO) ---
  {
    id: 'ast-1',
    judul: 'Sistem Tata Surya Kita',
    kategori: 'Astronomi',
    deskripsi: 'Menjelajahi delapan planet yang mengelilingi Matahari dalam harmoni orbit.',
    tingkatKesulitan: 'Mudah',
    isPro: false,
    svgType: 'solar',
    simulasiId: 'solar',
    konten: [
      'Tata Surya terdiri dari Matahari sebagai bintang pusat dan delapan planet yang mengitarinya akibat gaya gravitasi Matahari yang sangat masif. Empat planet dalam (Merkurius, Venus, Bumi, Mars) tersusun atas batuan padat.',
      'Empat planet luar (Jupiter, Saturnus, Uranus, Neptunus) merupakan planet raksasa yang tersusun terutama dari gas dan es. Di antara Mars dan Jupiter terdapat Sabuk Asteroid.',
      'Intisari Ilmiah: Semakin dekat jarak suatu planet ke Matahari, semakin cepat pula kecepatan orbitnya mengelilingi Matahari (Hukum Kepler).'
    ]
  },
  {
    id: 'ast-2',
    judul: 'Fase Bulan & Fenomena Gerhana',
    kategori: 'Astronomi',
    deskripsi: 'Mengapa bentuk Bulan tampak berubah-ubah setiap malam dari sabit ke purnama?',
    tingkatKesulitan: 'Menengah',
    isPro: false,
    svgType: 'moon',
    simulasiId: null,
    konten: [
      'Bulan tidak memancarkan cahayanya sendiri, melainkan memantulkan cahaya Matahari. Saat Bulan berevolusi mengelilingi Bumi selama sekitar 29,5 hari, bagian Bulan yang terkena sinar Matahari terlihat berbeda dari sudut pandang Bumi.',
      'Perubahan kenampakan ini menghasilkan fase Bulan Baru, Sabit Awal, Kuartir Pertama, Purnama, hingga kembali ke Bulan Baru.',
      'Intisari Ilmiah: Gerhana Matahari terjadi saat Bulan berada di antara Matahari dan Bumi, sedangkan Gerhana Bulan terjadi saat Bumi berada di antara Matahari dan Bulan.'
    ]
  },
  {
    id: 'ast-3',
    judul: 'Siklus Hidup Bintang & Galaksi',
    kategori: 'Astronomi',
    deskripsi: 'Dari awan debu nebula yang lahir hingga menjadi raksasa merah atau supernova.',
    tingkatKesulitan: 'Sulit',
    isPro: false,
    svgType: 'star',
    simulasiId: null,
    konten: [
      'Bintang lahir di dalam awan gas dan debu raksasa yang disebut Nebula. Ketika gaya gravitasi memadatkan gas hidrogen hingga suhu jutaan derajat, dimulailah reaksi fusi nuklir yang membuat bintang bersinar terang.',
      'Bintang bermassa sedang seperti Matahari akan mengembang menjadi Raksasa Merah di akhir usianya lalu menyusut menjadi Katai Putih. Bintang bermassa sangat besar mengakhiri hidupnya dengan ledakan dahsyat Supernova.',
      'Intisari Ilmiah: Miliaran bintang berkumpul bersama gas dan debu membentuk sistem raksasa bernama Galaksi; Bumi kita berada di Galaksi Bima Sakti.'
    ]
  },
  {
    id: 'ast-pro-1',
    judul: 'Lubang Hitam & Relativitas Umum',
    kategori: 'Astronomi',
    deskripsi: 'Bagaimana massa super padat melengkungkan ruang-waktu hingga cahaya tak bisa lolos.',
    tingkatKesulitan: 'Sulit (PRO)',
    isPro: true,
    svgType: 'blackhole',
    simulasiId: null,
    konten: [
      'Menurut Teori Relativitas Umum Albert Einstein, gravitasi bukanlah sekadar gaya tarik biasa, melainkan kelengkungan struktur ruang dan waktu yang disebabkan oleh kehadiran massa dan energi.',
      'Lubang Hitam (Black Hole) terbentuk ketika inti bintang masif runtuh oleh gravitasinya sendiri menjadi titik berkerapatan ekstrem. Batas di sekitar lubang hitam di mana kecepatan lepas melebihi kecepatan cahaya disebut Horizon Peristiwa (Event Horizon).',
      'Intisari Ilmiah: Di dekat medan gravitasi yang sangat kuat seperti lubang hitam, waktu berjalan lebih lambat dibandingkan di tempat bergravitasi lemah (Dilatasi Waktu Gravitasi).'
    ]
  }
];

export const QUIZ_DATA = [
  { id: 'q-1', materiId: 'fis-1', pertanyaan: 'Jika sebuah bulu ayam dan bola besi dijatuhkan bersamaan dari ketinggian yang sama di dalam tabung hampa udara, apa yang terjadi?', pilihanJawaban: ['Bola besi menyentuh dasar lebih dulu', 'Keduanya menyentuh dasar pada waktu bersamaan', 'Bulu ayam melayang selamanya', 'Bola besi berhenti di tengah'], jawabanBenar: 1, penjelasan: 'Tanpa hambatan udara, percepatan gravitasi bekerja sama besar pada semua benda tanpa dipengaruhi massa.', poin: 20 },
  { id: 'q-2', materiId: 'fis-1', pertanyaan: 'Mengapa berat astronot di Bulan terasa jauh lebih ringan dibandingkan saat di Bumi?', pilihanJawaban: ['Massa tubuh astronot menyusut di luar angkasa', 'Bulan tidak memiliki atmosfer sama sekali', 'Percepatan gravitasi Bulan hanya sekitar 1/6 gravitasi Bumi', 'Bulan berputar lebih cepat dari Bumi'], jawabanBenar: 2, penjelasan: 'Massa astronot tetap sama, tetapi gaya tarik gravitasi Bulan jauh lebih kecil karena massa Bulan lebih kecil dari Bumi.', poin: 20 },
  { id: 'q-3', materiId: 'fis-2', pertanyaan: 'Menurut Hukum Ohm, jika tegangan baterai diperbesar dua kali lipat pada hambatan yang tetap, maka kuat arus listrik akan...', pilihanJawaban: ['Berkurang setengahnya', 'Tetap sama', 'Menjadi dua kali lipat lebih besar', 'Berhenti mengalir'], jawabanBenar: 2, penjelasan: 'Berdasarkan I = V / R, kuat arus (I) berbanding lurus dengan tegangan (V).', poin: 20 },
  { id: 'q-4', materiId: 'fis-2', pertanyaan: 'Syarat utama agar lampu pada rangkaian listrik sederhana dapat menyala adalah...', pilihanJawaban: ['Sakelar dalam posisi terbuka', 'Rangkaian tertutup sehingga elektron dapat mengalir penuh', 'Hambatan kabel bernilai tak hingga', 'Menggunakan kabel plastik tanpa logam'], jawabanBenar: 1, penjelasan: 'Arus listrik hanya dapat mengalir kontinu dalam lintasan rangkaian yang tertutup.', poin: 20 },
  { id: 'q-5', materiId: 'fis-3', pertanyaan: 'Saat mobil yang melaju kencang direm mendadak, penumpang terdorong ke depan. Peristiwa ini merupakan contoh dari...', pilihanJawaban: ['Hukum I Newton (Kelembaman/Inersia)', 'Hukum Gravitasi Universal', 'Hukum Kekekalan Energi Panas', 'Gaya Gesek Statis'], jawabanBenar: 0, penjelasan: 'Hukum I Newton menyatakan benda yang sedang bergerak cenderung mempertahankan keadaan geraknya.', poin: 20 },
  { id: 'q-6', materiId: 'fis-3', pertanyaan: 'Sebuah benda bermassa 4 kg didorong dengan gaya total 20 Newton. Berapakah percepatan benda tersebut?', pilihanJawaban: ['0,2 m/s²', '5 m/s²', '16 m/s²', '80 m/s²'], jawabanBenar: 1, penjelasan: 'Menggunakan Hukum II Newton: a = F / m = 20 N / 4 kg = 5 m/s².', poin: 25 },
  { id: 'q-25', materiId: 'fis-pro-1', pertanyaan: 'Paket energi cahaya diskrit yang dijelaskan Einstein dalam fenomena Efek Fotolistrik disebut...', pilihanJawaban: ['Neutrino', 'Foton', 'Gluon', 'Positron'], jawabanBenar: 1, penjelasan: 'Foton adalah kuanta cahaya yang membawa energi sebanding dengan frekuensinya (E = h × f).', poin: 30 },

  { id: 'q-7', materiId: 'kim-1', pertanyaan: 'Partikel penyusun atom yang bermuatan negatif dan bergerak mengelilingi inti atom adalah...', pilihanJawaban: ['Proton', 'Neutron', 'Elektron', 'Nukleon'], jawabanBenar: 2, penjelasan: 'Elektron bermuatan negatif (−) dan mengorbit inti atom yang berisi proton (+) dan neutron (netral).', poin: 20 },
  { id: 'q-8', materiId: 'kim-1', pertanyaan: 'Jika sebuah atom netral memiliki 6 proton di dalam intinya, berapakah jumlah elektronnya?', pilihanJawaban: ['3 elektron', '6 elektron', '12 elektron', '0 elektron'], jawabanBenar: 1, penjelasan: 'Atom bersifat netral apabila jumlah muatan positif (proton) sama dengan muatan negatif (elektron).', poin: 20 },
  { id: 'q-9', materiId: 'kim-2', pertanyaan: 'Manakah di bawah ini yang termasuk contoh perubahan kimia (reaksi kimia)?', pilihanJawaban: ['Es batu mencair di bawah sinar matahari', 'Air mendidih menjadi uap air', 'Paku besi yang berkarat karena udara lembap', 'Garam dapur dilarutkan dalam air hangat'], jawabanBenar: 2, penjelasan: 'Perkaratan besi menghasilkan zat baru (besi oksida) sehingga termasuk perubahan kimia.', poin: 20 },
  { id: 'q-10', materiId: 'kim-2', pertanyaan: 'Manakah tanda yang paling umum menunjukkan telah terjadi reaksi kimia?', pilihanJawaban: ['Bentuk benda dipotong menjadi lebih kecil', 'Terbentuknya endapan, gas, atau perubahan warna permanen', 'Wujud zat berubah dari padat menjadi cair', 'Benda berpindah tempat'], jawabanBenar: 1, penjelasan: 'Reaksi kimia membentuk zat baru yang sering ditandai gas, endapan, perubahan suhu, atau warna baru.', poin: 20 },
  { id: 'q-11', materiId: 'kim-3', pertanyaan: 'Suatu larutan diuji dengan kertas lakmus biru dan mengubah warnanya menjadi merah. Larutan tersebut bersifat...', pilihanJawaban: ['Basa kuat', 'Netral', 'Asam', 'Garam murni'], jawabanBenar: 2, penjelasan: 'Larutan asam (pH < 7) mengubah kertas lakmus biru menjadi merah.', poin: 20 },
  { id: 'q-12', materiId: 'kim-3', pertanyaan: 'Berapakah nilai pH untuk air murni yang bersifat netral pada suhu ruang?', pilihanJawaban: ['pH 1', 'pH 5', 'pH 7', 'pH 14'], jawabanBenar: 2, penjelasan: 'Skala pH 7 menunjukkan kondisi netral, di bawah 7 asam, dan di atas 7 basa.', poin: 20 },
  { id: 'q-26', materiId: 'kim-pro-1', pertanyaan: 'Unit molekul kecil yang berulang-ulang bergabung membentuk rantai polimer panjang disebut...', pilihanJawaban: ['Isomer', 'Monomer', 'Katalis', 'Elektrolit'], jawabanBenar: 1, penjelasan: 'Monomer adalah blok penyusun dasar yang saling berikatan melalui polimerisasi membentuk polimer.', poin: 30 },

  { id: 'q-13', materiId: 'bio-1', pertanyaan: 'Organel sel yang dijuluki sebagai "pembangkit energi" karena menghasilkan ATP melalui respirasi sel adalah...', pilihanJawaban: ['Ribosom', 'Mitokondria', 'Vakuola', 'Dinding sel'], jawabanBenar: 1, penjelasan: 'Mitokondria mengubah nutrisi menjadi energi kimia (ATP) yang dibutuhkan sel untuk beraktivitas.', poin: 20 },
  { id: 'q-14', materiId: 'bio-1', pertanyaan: 'Bagian sel yang dimiliki oleh sel tumbuhan tetapi TIDAK dimiliki oleh sel hewan adalah...', pilihanJawaban: ['Membran sel dan sitoplasma', 'Inti sel (Nukleus)', 'Dinding sel dan kloroplas', 'Mitokondria'], jawabanBenar: 2, penjelasan: 'Kloroplas diperlukan tumbuhan untuk fotosintesis, dan dinding sel memberi bentuk kaku pada tumbuhan.', poin: 20 },
  { id: 'q-15', materiId: 'bio-2', pertanyaan: 'Gas apa yang diserap tumbuhan dari udara sebagai bahan baku utama fotosintesis?', pilihanJawaban: ['Oksigen (O₂)', 'Karbon dioksida (CO₂)', 'Nitrogen (N₂)', 'Helium (He)'], jawabanBenar: 1, penjelasan: 'Tumbuhan menyerap CO₂ melalui stomata dan melepaskan oksigen sebagai hasil fotosintesis.', poin: 20 },
  { id: 'q-16', materiId: 'bio-2', pertanyaan: 'Pigmen hijau pada daun yang berfungsi menangkap energi cahaya matahari disebut...', pilihanJawaban: ['Hemoglobin', 'Klorofil', 'Keratin', 'Melanin'], jawabanBenar: 1, penjelasan: 'Klorofil berada di dalam kloroplas dan menyerap energi cahaya untuk memulai reaksi fotosintesis.', poin: 20 },
  { id: 'q-17', materiId: 'bio-3', pertanyaan: 'Dalam rantai makanan: Padi → Belalang → Katak → Ular. Peran katak adalah sebagai...', pilihanJawaban: ['Produsen', 'Konsumen Tingkat I', 'Konsumen Tingkat II', 'Pengurai (Dekomposer)'], jawabanBenar: 2, penjelasan: 'Padi adalah produsen, belalang konsumen I (herbivora), dan katak konsumen II (karnivora).', poin: 20 },
  { id: 'q-18', materiId: 'bio-3', pertanyaan: 'Apa fungsi utama bakteri dan jamur dekomposer dalam suatu ekosistem?', pilihanJawaban: ['Membuat makanan dari sinar matahari', 'Menguraikan sisa makhluk hidup menjadi unsur hara tanah', 'Memburu predator puncak', 'Menghasilkan energi panas bumi'], jawabanBenar: 1, penjelasan: 'Dekomposer mendaur ulang materi organik kembali menjadi nutrisi bagi tanah dan tumbuhan.', poin: 20 },
  { id: 'q-27', materiId: 'bio-pro-1', pertanyaan: 'Pada struktur heliks ganda DNA, basa nitrogen Adenin (A) selalu berpasangan secara spesifik dengan...', pilihanJawaban: ['Guanin (G)', 'Sitosin (C)', 'Timin (T)', 'Urasil (U)'], jawabanBenar: 2, penjelasan: 'Aturan pasangan basa DNA adalah Adenin dengan Timin (A–T) serta Sitosin dengan Guanin (C–G).', poin: 30 },

  { id: 'q-19', materiId: 'ast-1', pertanyaan: 'Planet manakah di Tata Surya kita yang memiliki periode revolusi (waktu mengorbit Matahari) paling singkat?', pilihanJawaban: ['Bumi', 'Mars', 'Merkurius', 'Jupiter'], jawabanBenar: 2, penjelasan: 'Merkurius adalah planet terdekat dengan Matahari sehingga lintasannya paling pendek dan kecepatan orbitnya paling tinggi (88 hari Bumi).', poin: 20 },
  { id: 'q-20', materiId: 'ast-1', pertanyaan: 'Kelompok planet yang dikenal sebagai "Raksasa Gas" (Gas Giants) di Tata Surya adalah...', pilihanJawaban: ['Merkurius dan Venus', 'Bumi dan Mars', 'Jupiter dan Saturnus', 'Mars dan Merkurius'], jawabanBenar: 2, penjelasan: 'Jupiter dan Saturnus tersusun terutama atas gas hidrogen dan helium dengan ukuran sangat masif.', poin: 20 },
  { id: 'q-21', materiId: 'ast-2', pertanyaan: 'Gerhana Matahari terjadi ketika susunan posisi benda langit berada pada satu garis lurus dengan urutan...', pilihanJawaban: ['Matahari — Bumi — Bulan', 'Matahari — Bulan — Bumi', 'Bumi — Matahari — Bulan', 'Bulan — Matahari — Bumi'], jawabanBenar: 1, penjelasan: 'Saat Gerhana Matahari, Bulan berada di tengah sehingga bayangan Bulan jatuh menutupi sebagian permukaan Bumi.', poin: 25 },
  { id: 'q-22', materiId: 'ast-2', pertanyaan: 'Mengapa Bulan terlihat bersinar terang pada malam hari?', pilihanJawaban: ['Bulan menghasilkan reaksi nuklir seperti bintang', 'Bulan memantulkan cahaya dari Matahari', 'Atmosfer Bulan terbakar oleh meteor', 'Bulan memancarkan lava pijar'], jawabanBenar: 1, penjelasan: 'Bulan adalah satelit alami yang tidak memiliki cahaya sendiri; cahayanya berasal dari pantulan sinar Matahari.', poin: 20 },
  { id: 'q-23', materiId: 'ast-3', pertanyaan: 'Awan raksasa yang terdiri dari gas dan debu antarbintang tempat lahirnya bintang-bintang baru disebut...', pilihanJawaban: ['Lubang Hitam', 'Nebula', 'Asteroid', 'Komet'], jawabanBenar: 1, penjelasan: 'Nebula adalah tempat pembibitan bintang di mana gravitasi memadatkan gas hingga memicu fusi nuklir.', poin: 25 },
  { id: 'q-24', materiId: 'ast-3', pertanyaan: 'Nama galaksi spiral tempat Tata Surya dan planet Bumi kita berada adalah...', pilihanJawaban: ['Galaksi Andromeda', 'Galaksi Bima Sakti (Milky Way)', 'Galaksi Triangulum', 'Galaksi Sombrero'], jawabanBenar: 1, penjelasan: 'Tata Surya kita mengorbit pusat Galaksi Bima Sakti bersama ratusan miliar bintang lainnya.', poin: 20 },
  { id: 'q-28', materiId: 'ast-pro-1', pertanyaan: 'Batas di sekeliling Lubang Hitam di mana tidak ada materi maupun cahaya yang dapat lolos keluar disebut...', pilihanJawaban: ['Sabuk Kuiper', 'Horizon Peristiwa (Event Horizon)', 'Fotosfer', 'Kromosfer'], jawabanBenar: 1, penjelasan: 'Horizon Peristiwa adalah batas titik tidak kembali di sekitar lubang hitam.', poin: 30 }
];

export const ACHIEVEMENTS_DATA = [
  { id: 'first_step', nama: 'Langkah Pertama', deskripsi: 'Selesaikan 1 materi sains pertama.', icon: '🔬', check: (s) => s.materiSelesai.length >= 1 },
  { id: 'fisika_master', nama: 'Penjelajah Fisika', deskripsi: 'Selesaikan semua materi dasar Fisika.', icon: '🚀', check: (s) => ['fis-1', 'fis-2', 'fis-3'].every((id) => s.materiSelesai.includes(id)) },
  { id: 'kimia_master', nama: 'Ahli Kimia Muda', deskripsi: 'Selesaikan semua materi dasar Kimia.', icon: '🧪', check: (s) => ['kim-1', 'kim-2', 'kim-3'].every((id) => s.materiSelesai.includes(id)) },
  { id: 'biologi_master', nama: 'Sahabat Alam', deskripsi: 'Selesaikan semua materi dasar Biologi.', icon: '🌿', check: (s) => ['bio-1', 'bio-2', 'bio-3'].every((id) => s.materiSelesai.includes(id)) },
  { id: 'astro_master', nama: 'Astronot Cilik', deskripsi: 'Selesaikan semua materi dasar Astronomi.', icon: '🪐', check: (s) => ['ast-1', 'ast-2', 'ast-3'].every((id) => s.materiSelesai.includes(id)) },
  { id: 'all_materi', nama: 'Kutu Buku Sains', deskripsi: 'Selesaikan minimal 12 materi sains!', icon: '📚', check: (s) => s.materiSelesai.length >= 12 },
  { id: 'quiz_star', nama: 'Bintang Kuis', deskripsi: 'Jawab benar minimal 10 soal kuis.', icon: '⭐', check: (s) => s.kuisSelesai.length >= 10 },
  { id: 'sim_pro', nama: 'Profesor Eksperimen', deskripsi: 'Coba minimal 3 simulasi interaktif.', icon: '⚡', check: (s) => s.simulasiDicoba.length >= 3 },
  { id: 'vip_scientist', nama: 'DoodleLab VIP Scientist', deskripsi: 'Bergabung menjadi member DoodleLab PRO.', icon: '👑', check: (s) => Boolean(s.isPro) }
];

export const PRICING_PLANS = [
  {
    id: 'monthly',
    nama: 'Paket Pelajar Bulanan',
    harga: 29000,
    periode: '/ bulan',
    badge: 'Fleksibel',
    color: 'var(--doodle-blue)',
    fitur: ['Akses 4 Materi Sains Lanjutan PRO', 'Lab Simulasi Wave & Optics PRO', 'Bonus 2x XP & Poin Setiap Aktivitas', 'Stiker Eksklusif VIP Scientist']
  },
  {
    id: 'yearly',
    nama: 'Paket Juara Tahunan',
    harga: 199000,
    periode: '/ tahun',
    badge: 'Best Value · Hemat 42%',
    color: 'var(--warm-yellow)',
    fitur: ['Semua Keuntungan Paket Bulanan', 'Akses Penuh Selama 12 Bulan', 'Prioritas Konten Eksperimen Baru', 'Sertifikat Digital Ilmuwan Muda']
  },
  {
    id: 'lifetime',
    nama: 'Paket Akses Selamanya',
    harga: 349000,
    periode: 'Sekali Bayar',
    badge: 'Akses Permanen',
    color: 'var(--playful-purple)',
    fitur: ['Akses PRO Permanen Tanpa Biaya Ulang', 'Semua Materi & Simulator Masa Depan', 'Bonus 2x XP & Poin Selamanya', 'Lencana Mahkota Emas di Leaderboard']
  }
];

export const PROMO_CODES = {
  DOODLE50: { type: 'percent', value: 50, label: 'Diskon 50% Spesial DoodleLab' },
  SAINSJUARA: { type: 'flat', value: 10000, label: 'Potongan Langsung Rp 10.000' }
};

export const DAILY_CHALLENGES = [
  { pertanyaan: 'Tantangan Kilat: Planet manakah yang dijuluki Planet Merah karena kandungan besi oksida di permukaannya?', opsi: ['Venus', 'Mars', 'Jupiter', 'Saturnus'], benar: 1, xp: 50 },
  { pertanyaan: 'Tantangan Kilat: Perubahan wujud dari gas langsung menjadi padat (seperti terbentuknya salju) disebut...', opsi: ['Menyublim', 'Mengkristal / Deposisi', 'Mengembun', 'Membeku'], benar: 1, xp: 50 },
  { pertanyaan: 'Tantangan Kilat: Satuan internasional (SI) untuk mengukur kuat arus listrik adalah...', opsi: ['Volt', 'Ohm', 'Ampere', 'Watt'], benar: 2, xp: 50 },
  { pertanyaan: 'Tantangan Kilat: Bagian tumbuhan yang berfungsi mengangkut air dan mineral dari akar ke daun adalah...', opsi: ['Floem', 'Xilem', 'Stomata', 'Kambium'], benar: 1, xp: 50 },
  { pertanyaan: 'Tantangan Kilat: Gaya yang selalu melawan arah gerak benda ketika dua permukaan saling bersentuhan adalah...', opsi: ['Gaya Gesek', 'Gaya Magnet', 'Gaya Apung', 'Gaya Pegas'], benar: 0, xp: 50 }
];

export const DEMO_LEADERBOARD = [
  { namaAlias: 'Prof. Kancil Cerdik', xp: 640, avatar: '🦊', isPro: true },
  { namaAlias: 'Kapten Andromeda', xp: 480, avatar: '👩‍🚀', isPro: true },
  { namaAlias: 'Ratu Molekul', xp: 330, avatar: '🧬', isPro: false },
  { namaAlias: 'Maestro Newton', xp: 210, avatar: '🍎', isPro: false },
  { namaAlias: 'Detektif Daun', xp: 110, avatar: '🌱', isPro: false }
];
