# 🚀 QUICK START GUIDE - SITELLO

## 📋 Checklist Deployment (Super Cepat!)

### Step 1: Buat Database (5 menit)
1. ✅ Buka [Google Sheets](https://sheets.google.com)
2. ✅ Buat spreadsheet baru: **SITELLO_Database**
3. ✅ Buat 7 sheet dengan nama:
   - users
   - datasheets
   - checker_data
   - approvals
   - reservasi
   - target_sales
   - notifications

4. ✅ Copy template header dari file **DEPLOYMENT.md**
5. ✅ Tambah admin default di sheet `users`:
   ```
   User ID: admin
   Password: admin123
   Nama: Admin Otsutsuki
   Role: otsutsuki
   ```

6. ✅ Copy Spreadsheet ID dari URL

---

### Step 2: Deploy Apps Script (10 menit)
1. ✅ Di spreadsheet → **Extensions** → **Apps Script**
2. ✅ Hapus code default
3. ✅ Copy-paste file **Code.gs**
4. ✅ Ganti `YOUR_MASTER_SPREADSHEET_ID` dengan ID spreadsheet kamu
5. ✅ Save (Ctrl+S)
6. ✅ **Deploy** → **New deployment** → **Web app**
   - Execute as: **Me**
   - Who has access: **Anyone**
7. ✅ **Copy Web app URL** (simpan!)

---

### Step 3: Upload HTML Files (5 menit)
1. ✅ Di Apps Script, klik **+** → **HTML file**
2. ✅ Buat 3 file:
   - `index` → copy dari **index.html**
   - `dashboard-admin` → copy dari **dashboard-admin.html**
   - `checker-input` → copy dari **checker-input.html**

---

### Step 4: Update URLs (2 menit)
Di ketiga file HTML, cari dan ganti:
```javascript
YOUR_APPS_SCRIPT_URL
```
Dengan Web app URL dari Step 2

Contoh:
```javascript
https://script.google.com/macros/s/AKfycbxxx.../exec
```

---

### Step 5: Re-Deploy (1 menit)
1. ✅ **Deploy** → **Manage deployments**
2. ✅ Klik **✏️ Edit**
3. ✅ **Version:** → **New version**
4. ✅ **Deploy**

---

### Step 6: Test! (2 menit)
1. ✅ Buka Web app URL di browser
2. ✅ Tunggu loading screen
3. ✅ Login:
   - User ID: **admin**
   - Password: **admin123**
4. ✅ Berhasil masuk dashboard? **SUKSES!** 🎉

---

### Step 7: Install ke HP (1 menit)
**Android:**
1. ✅ Buka URL di Chrome
2. ✅ Menu (⋮) → **Add to Home screen**

**iOS:**
1. ✅ Buka URL di Safari
2. ✅ Share (📤) → **Add to Home Screen**

---

## ⚡ Total Waktu: ~25 menit

---

## 🆘 Troubleshooting Cepat

**❌ Login tidak berfungsi?**
→ Cek console browser (F12), pastikan Apps Script URL sudah benar

**❌ "Cannot find function doGet"?**
→ Refresh Apps Script editor, pastikan Code.gs ter-save

**❌ "Script tidak bisa akses spreadsheet"?**
→ Run function `getMasterSheet()` untuk authorize akses

---

## 📱 Default Login Credentials

```
User ID: admin
Password: admin123
Role: Otsutsuki (Super Admin)
```

**⚠️ PENTING:** Ganti password setelah login pertama kali!

---

## 🎯 Yang Bisa Dilakukan Setelah Deploy

1. ✅ Tambah user (Chunin, Anbu, Senpai, Hokage, Akatsuki)
2. ✅ Tambah datasheet untuk checker harian
3. ✅ Tambah datasheet untuk data marketing
4. ✅ Test input checker
5. ✅ Test approval flow
6. ✅ Monitor notifikasi

---

## 📞 Butuh Bantuan?

Lihat file lengkap:
- **DEPLOYMENT.md** → Panduan detail
- **README.md** → Dokumentasi fitur
- **PROJECT_SUMMARY.md** → Overview project

---

**Selamat Deploy! 🚀💙**
