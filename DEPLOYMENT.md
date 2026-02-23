# 🚀 Panduan Deployment SITELLO ke Google Apps Script

## Langkah-langkah Deploy (Step by Step)

### 1️⃣ Persiapan Spreadsheet Database

1. Buka [Google Sheets](https://sheets.google.com)
2. Buat spreadsheet baru dengan nama: **SITELLO_Database**
3. Buat 7 sheet dengan nama persis seperti ini:
   - `users`
   - `datasheets`
   - `checker_data`
   - `approvals`
   - `reservasi`
   - `target_sales`
   - `notifications`

4. **Setup Header untuk setiap sheet:**

#### Sheet: `users`
```
A1: User ID
B1: Password
C1: Nama
D1: Role
E1: Photo URL
F1: Signature URL
G1: Created At
```

#### Sheet: `datasheets`
```
A1: Sheet Name
B1: Sheet ID
C1: Sheet URL
D1: Type
E1: Created At
```

#### Sheet: `checker_data`
```
A1: Data ID
B1: User ID
C1: Check Date
D1: Items JSON
E1: Status
F1: Timestamp
```

#### Sheet: `approvals`
```
A1: Data ID
B1: Submitter ID
C1: Submitter Role
D1: Current Status
E1: Approved By Role
F1: Approved By User
G1: Approval Time
H1: Signature URL
I1: Reject Reason
J1: Rejected By
K1: Reject Time
L1: Items JSON
M1: Created At
```

#### Sheet: `reservasi`
```
A1: Tanggal
B1: Reservasi
C1: Jumlah Pack
D1: Area Booking
E1: Makan
F1: Wahana
G1: Sewa Sound
H1: Timestamp
```

#### Sheet: `target_sales`
```
A1: Sales ID
B1: Target
C1: Capaian
D1: Daerah
E1: Bulan
F1: Tahun
G1: Timestamp
```

#### Sheet: `notifications`
```
A1: Target Role/User
B1: Message
C1: Timestamp
D1: Read Status
```

5. **Tambahkan user admin default ke sheet `users`:**
   - Row 2:
     ```
     A2: admin
     B2: admin123
     C2: Admin Otsutsuki
     D2: otsutsuki
     E2: (kosong)
     F2: (kosong)
     G2: (tanggal hari ini)
     ```

6. **Copy Spreadsheet ID:**
   - Lihat di URL: `https://docs.google.com/spreadsheets/d/[ID_INI]/edit`
   - Save ID ini untuk nanti

---

### 2️⃣ Setup Google Apps Script

1. Di spreadsheet SITELLO_Database, klik **Extensions** → **Apps Script**
2. Hapus semua code default yang ada
3. Copy seluruh isi file `Code.gs` dari repository
4. Paste ke Apps Script editor
5. **PENTING:** Ganti baris ini:
   ```javascript
   const CONFIG = {
     SPREADSHEET_ID: 'YOUR_MASTER_SPREADSHEET_ID', // ← Ganti dengan ID spreadsheet kamu
   ```
6. Klik **💾 Save** (Ctrl+S)
7. Rename project jadi: **SITELLO Backend**

---

### 3️⃣ Upload File HTML

**Option A: Satu per satu**
1. Di Apps Script editor, klik **+** → **HTML file**
2. Buat file dengan nama: `index`
3. Copy-paste isi file `index.html` dari repository
4. Repeat untuk file lainnya:
   - `dashboard-admin` (dari `dashboard-admin.html`)
   - `checker-input` (dari `checker-input.html`)

**Option B: Menggunakan clasp (Advanced)**
```bash
npm install -g @google/clasp
clasp login
clasp create --title "SITELLO" --type webapp
clasp push
```

---

### 4️⃣ Setup Triggers (Automasi)

1. Di Apps Script editor, klik ⏰ **Triggers** (di sidebar kiri)
2. Klik **+ Add Trigger** dengan setting:
   - Choose function: `dailySheetMaintenance`
   - Event source: `Time-driven`
   - Type: `Day timer`
   - Time of day: `Midnight to 1am`
3. Klik **Save**
4. Authorize access (klik account Google Anda)

**Atau jalankan manual:**
1. Di Apps Script editor, pilih function: `setupTriggers`
2. Klik **Run**
3. Authorize access

---

### 5️⃣ Deploy as Web App

1. Di Apps Script, klik **Deploy** → **New deployment**
2. Klik ⚙️ **Type settings** → pilih **Web app**
3. Setting:
   - **Description:** SITELLO v1.0
   - **Execute as:** Me (email kamu)
   - **Who has access:** Anyone
4. Klik **Deploy**
5. **Copy Web app URL** (simpan baik-baik!)

**Format URL:** `https://script.google.com/macros/s/AKfycby.../exec`

---

### 6️⃣ Update Apps Script URL di HTML Files

**Update di 3 file:**

1. **File: `index.html`**
   - Cari: `YOUR_APPS_SCRIPT_URL`
   - Ganti dengan Web app URL dari step 5

2. **File: `dashboard-admin.html`**
   - Cari: `YOUR_APPS_SCRIPT_URL`
   - Ganti dengan Web app URL

3. **File: `checker-input.html`**
   - Cari: `YOUR_APPS_SCRIPT_URL`
   - Ganti dengan Web app URL

4. **Save semua file** (Ctrl+S)

---

### 7️⃣ Re-deploy (Update)

1. Klik **Deploy** → **Manage deployments**
2. Klik ✏️ **Edit** di deployment yang sudah ada
3. Klik **Version:** → **New version**
4. Klik **Deploy**
5. Copy Web app URL baru (atau pakai yang lama, sama aja)

---

### 8️⃣ Test Aplikasi

1. Buka Web app URL di browser
2. Cek loading screen muncul (logo SITELLO)
3. Login dengan:
   - **User ID:** `admin`
   - **Password:** `admin123`
4. Kalau berhasil masuk dashboard admin → **SUKSES!** 🎉

---

## 🔧 Troubleshooting Common Issues

### ❌ Error: "Script tidak bisa mengakses spreadsheet"

**Solusi:**
1. Pastikan Spreadsheet ID sudah benar di `Code.gs`
2. Di Apps Script, Run function `getMasterSheet()` untuk authorize
3. Klik **Review Permissions** → Allow access

### ❌ Error: "Cannot find function doGet"

**Solusi:**
1. Pastikan file `Code.gs` sudah ter-save
2. Refresh Apps Script editor
3. Re-deploy web app

### ❌ Login tidak berfungsi

**Solusi:**
1. Buka Console Browser (F12)
2. Cek error di tab "Console"
3. Pastikan Apps Script URL sudah di-update di HTML files
4. Pastikan user `admin` ada di sheet `users`

### ❌ "Reference Error: YOUR_APPS_SCRIPT_URL is not defined"

**Solusi:**
1. Ganti semua `YOUR_APPS_SCRIPT_URL` dengan URL asli dari Apps Script
2. Format: `https://script.google.com/macros/s/.../exec`
3. Save dan re-deploy

---

## 📱 Install ke HP

### Android (Chrome):
1. Buka Web app URL di Chrome
2. Tap Menu (⋮)
3. Tap **Add to Home screen**
4. Edit nama jadi "SITELLO"
5. Tap **Add**

### iOS (Safari):
1. Buka Web app URL di Safari
2. Tap Share button (📤)
3. Scroll dan tap **Add to Home Screen**
4. Edit nama jadi "SITELLO"
5. Tap **Add**

---

## 🎯 Next Steps After Deployment

1. ✅ Tambah user Chunin, Anbu, Senpai, Hokage via Admin dashboard
2. ✅ Tambah Datasheet untuk checker harian
3. ✅ Tambah Datasheet untuk data marketing
4. ✅ Test approval flow
5. ✅ Setup notification system
6. ✅ Customize logo dan warna

---

## 🔐 Security Checklist

- [ ] Ganti password default admin
- [ ] Setup 2FA untuk admin (future update)
- [ ] Hash password (future update)
- [ ] Restrict Apps Script execution permissions
- [ ] Regular backup database (export sheets)
- [ ] Monitor access logs

---

## 📚 Resources

- [Google Apps Script Docs](https://developers.google.com/apps-script)
- [Spreadsheet Service](https://developers.google.com/apps-script/reference/spreadsheet)
- [HTML Service](https://developers.google.com/apps-script/guides/html)
- [Web Apps Guide](https://developers.google.com/apps-script/guides/web)

---

**Need help? Open an issue di GitHub repository!** 🚀
