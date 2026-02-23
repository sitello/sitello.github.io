# 🎯 SITELLO - Monitoring & Pendataan System

Aplikasi monitoring dan pendataan berbasis Google Apps Script dengan tampilan Windows XP modern.

## 📋 Fitur Utama

### Role & Akses:
- **Otsutsuki (Admin)**: Kelola user, datasheet, monitoring penuh
- **Hokage (Management)**: Approve dari Leader, monitoring target & reservasi
- **Senpai (Leader)**: Approve dari Coordinator, monitoring target & reservasi
- **Anbu (Coordinator)**: Approve dari Chunin, monitoring reservasi, bisa jadi backup checker
- **Chunin (Karyawan)**: Input data checker harian
- **Akatsuki (Team Khusus)**: Pantau semua (read-only)

### Fitur Admin:
✅ Tambah User (dengan foto & signature digital)
✅ Tambah Datasheet (link Google Sheets)
✅ Daftar User
✅ Monitoring Data (kalender reservasi)
✅ Pencapaian Target Sales
✅ Notifikasi Real-time

### Approval Flow:
```
Chunin → Anbu → Senpai → Hokage → Final
(Setiap level bisa reject, Hokage & Admin bisa reject kapan saja)
```

---

## 🚀 Cara Setup

### 1. Buat Google Spreadsheet Master

Buat spreadsheet baru dengan nama **"SITELLO_Database"** dan buat sheet berikut:

#### Sheet: `users`
| User ID | Password | Nama | Role | Photo URL | Signature URL | Created At |
|---------|----------|------|------|-----------|---------------|------------|

#### Sheet: `datasheets`
| Sheet Name | Sheet ID | Sheet URL | Type | Created At |
|------------|----------|-----------|------|------------|

#### Sheet: `checker_data`
| Data ID | User ID | Check Date | Items JSON | Status | Timestamp |
|---------|---------|------------|------------|--------|-----------|

#### Sheet: `approvals`
| Data ID | Submitter ID | Submitter Role | Current Status | Approved By Role | Approved By User | Approval Time | Signature URL | Reject Reason | Rejected By | Reject Time | Items JSON | Created At |
|---------|--------------|----------------|----------------|------------------|------------------|---------------|---------------|---------------|-------------|-------------|------------|------------|

#### Sheet: `reservasi`
| Tanggal | Reservasi | Jumlah Pack | Area Booking | Makan | Wahana | Sewa Sound | Timestamp |
|---------|-----------|-------------|--------------|-------|--------|------------|-----------|

#### Sheet: `target_sales`
| Sales ID | Target | Capaian | Daerah | Bulan | Tahun | Timestamp |
|----------|--------|---------|--------|-------|-------|-----------|

#### Sheet: `notifications`
| Target Role/User | Message | Timestamp | Read Status |
|------------------|---------|-----------|-------------|

---

### 2. Setup Google Apps Script

1. Buka spreadsheet → **Extensions** → **Apps Script**
2. Delete semua code default
3. Copy-paste isi file `Code.gs` ke Apps Script editor
4. Ganti `YOUR_MASTER_SPREADSHEET_ID` dengan ID spreadsheet Anda
   - ID ada di URL: `https://docs.google.com/spreadsheets/d/[ID_NYA_INI]/edit`

5. **Deploy as Web App:**
   - Klik **Deploy** → **New deployment**
   - Type: **Web app**
   - Execute as: **Me**
   - Who has access: **Anyone**
   - Klik **Deploy**
   - Copy **Web app URL**

6. **Setup Triggers:**
   - Di Apps Script, jalankan function `setupTriggers()` secara manual
   - Ini akan membuat trigger otomatis untuk maintenance harian

---

### 3. Setup Frontend Files

1. Buka Apps Script editor
2. Klik **+** → **HTML file**
3. Buat file baru dengan nama `index` (akan jadi `index.html`)
4. Copy-paste isi file `index.html` (dari repository ini)
5. Update `YOUR_APPS_SCRIPT_URL` dengan Web app URL dari step 2

6. Ulangi untuk file HTML lainnya:
   - `dashboard-admin.html`
   - `manifest.json` (sebagai HTML file juga bisa, atau di-host terpisah)

---

### 4. Test Login

Default admin user (tambahkan manual ke sheet `users`):

| User ID | Password | Nama | Role | Photo URL | Signature URL | Created At |
|---------|----------|------|-----------|-----------|---------------|------------|
| admin | admin123 | Admin Otsutsuki | otsutsuki | (kosongkan) | (kosongkan) | (tanggal sekarang) |

**Login URL**: Web app URL dari step 2

---

## 📱 Install ke HP (PWA)

1. Buka aplikasi di browser HP (Chrome/Safari)
2. Chrome: Menu (⋮) → **Add to Home screen**
3. Safari: Share (📤) → **Add to Home Screen**
4. Icon SITELLO akan muncul di home screen

---

## 🔒 Keamanan

### Current Implementation:
- ✅ Password tersimpan di Google Sheets (plain text - **untuk development**)
- ✅ Session management via localStorage
- ✅ Role-based access control
- ✅ File storage di Google Drive dengan sharing settings
- ✅ Apps Script execution protection

### Recommended for Production:
- 🔄 Hash password dengan library crypto (tambahkan di Apps Script)
- 🔄 Implement 2FA untuk Admin
- 🔄 Rate limiting untuk login attempts
- 🔄 Audit log untuk semua actions
- 🔄 Encrypt sensitive data di sheets

---

## 🎨 Customization

### Ubah Warna:
Edit di file HTML bagian `<style>`:
```css
/* Primary color (Windows XP Blue) */
--primary-color: #0078D4;

/* Secondary color (Silver/Gray) */
--secondary-color: #E1E1E1;

/* Background */
--bg-color: #F0F0F0;
```

### Ubah Logo:
1. Buat icon 512x512px
2. Upload ke Google Drive (share public)
3. Ganti `.logo` dan `.login-logo` di CSS dengan:
```css
background-image: url('YOUR_ICON_URL');
background-size: cover;
```

---

## 📊 Struktur Data

### Approval Flow Status:
- `pending` → Menunggu approval Chunin
- `anbu` → Menunggu approval Anbu
- `senpai` → Menunggu approval Senpai
- `hokage` → Menunggu approval Hokage
- `approved` → Sudah diapprove semua level
- `rejected` → Ditolak

### Checker Deadline:
- **Deadline**: 07:00 - 19:00
- **Lewat deadline**: Butuh approval admin (via notifikasi)
- **Lupa isi**: Berlanjut ke hari berikutnya (tercatat sebagai kelalaian)

---

## 🛠️ Troubleshooting

### Error: "Script tidak bisa mengakses spreadsheet"
**Solusi**: 
1. Pastikan ID spreadsheet benar
2. Pastikan script punya akses ke spreadsheet (run sekali untuk authorize)

### Error: "Cannot access external sheets"
**Solusi**:
1. Sheet harus di-share dengan: **Anyone with the link can edit**
2. Copy link sheet dan test akses di incognito window

### PWA tidak bisa diinstall
**Solusi**:
1. Pastikan menggunakan HTTPS (Apps Script otomatis HTTPS)
2. Cek `manifest.json` sudah benar
3. Clear browser cache dan coba lagi

### Login tidak berfungsi
**Solusi**:
1. Cek console browser (F12) untuk error
2. Pastikan Web app URL sudah benar di file HTML
3. Pastikan user sudah ada di sheet `users`

---

## 📝 TODO / Roadmap

- [ ] Hash password implementation
- [ ] 2FA untuk Admin
- [ ] Export data ke Excel
- [ ] Grafik visualisasi di monitoring
- [ ] Push notification (via email)
- [ ] Dark mode option
- [ ] Multi-language support
- [ ] Offline mode dengan cache

---

## 🤝 Kontribusi

Silakan fork repository ini dan submit pull request untuk improvement!

---

## 📄 Lisensi

MIT License - Free to use and modify

---

## 💬 Support

Jika ada pertanyaan atau issue, buka **Issues** di GitHub repository ini.

---

**Dibuat dengan ❤️ menggunakan Google Apps Script**
**Design inspired by Windows XP 💙**
