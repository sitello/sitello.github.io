# 📊 SPREADSHEET SETUP TEMPLATE

Copy-paste header ini ke masing-masing sheet!

---

## Sheet 1: `users`

**Paste di Row 1:**
```
User ID | Password | Nama | Role | Photo URL | Signature URL | Created At
```

**Data Admin Default (Paste di Row 2):**
```
admin | admin123 | Admin Otsutsuki | otsutsuki | | | 2025-02-19
```

**Keterangan:**
- User ID: Unique identifier (max 20 karakter)
- Password: Plain text (nanti di-hash)
- Nama: Nama lengkap user
- Role: otsutsuki / hokage / senpai / anbu / chunin / akatsuki
- Photo URL: Google Drive link (auto-fill dari upload)
- Signature URL: Google Drive link (auto-fill dari upload)
- Created At: Tanggal dibuat (format: YYYY-MM-DD)

---

## Sheet 2: `datasheets`

**Paste di Row 1:**
```
Sheet Name | Sheet ID | Sheet URL | Type | Created At
```

**Contoh Data (Paste di Row 2):**
```
Checker Divisi A | YOUR_SHEET_ID | https://docs.google.com/... | checker | 2025-02-19
```

**Keterangan:**
- Sheet Name: Nama datasheet (bebas)
- Sheet ID: ID dari URL Google Sheets
- Sheet URL: Full URL Google Sheets
- Type: checker / marketing / target
- Created At: Tanggal dibuat

---

## Sheet 3: `checker_data`

**Paste di Row 1:**
```
Data ID | User ID | Check Date | Items JSON | Status | Timestamp
```

**Keterangan:**
- Data ID: Auto-generated (DATA_timestamp)
- User ID: Siapa yang submit
- Check Date: Tanggal pengecekan
- Items JSON: Array objek checker items
- Status: pending / approved / rejected
- Timestamp: Waktu submit

---

## Sheet 4: `approvals`

**Paste di Row 1:**
```
Data ID | Submitter ID | Submitter Role | Current Status | Approved By Role | Approved By User | Approval Time | Signature URL | Reject Reason | Rejected By | Reject Time | Items JSON | Created At
```

**Keterangan:**
- Data ID: Reference ke checker_data
- Submitter ID: Yang submit data
- Submitter Role: chunin / anbu
- Current Status: anbu / senpai / hokage / approved / rejected
- Approved By Role: Role yang approve
- Approved By User: User ID yang approve
- Approval Time: Waktu approve
- Signature URL: Link signature digital
- Reject Reason: Alasan reject (jika ada)
- Rejected By: User ID yang reject
- Reject Time: Waktu reject
- Items JSON: Copy dari checker_data
- Created At: Waktu dibuat

---

## Sheet 5: `reservasi`

**Paste di Row 1:**
```
Tanggal | Reservasi | Jumlah Pack | Area Booking | Makan | Wahana | Sewa Sound | Timestamp
```

**Contoh Data:**
```
2025-02-20 | John Doe | 50 | Area A | Ya | Kolam Renang | Ya | 2025-02-19 10:30:00
```

**Keterangan:**
- Tanggal: Tanggal reservasi
- Reservasi: Nama pemesan
- Jumlah Pack: Jumlah paket
- Area Booking: Area yang dipesan
- Makan: Ya/Tidak
- Wahana: Nama wahana
- Sewa Sound: Ya/Tidak
- Timestamp: Waktu input data

---

## Sheet 6: `target_sales`

**Paste di Row 1:**
```
Sales ID | Target | Capaian | Daerah | Bulan | Tahun | Timestamp
```

**Contoh Data:**
```
SALES001 | 1000000 | 850000 | Bandung | Februari | 2025 | 2025-02-19 10:30:00
```

**Keterangan:**
- Sales ID: ID sales/marketing
- Target: Target penjualan (Rupiah)
- Capaian: Capaian saat ini (Rupiah)
- Daerah: Daerah/wilayah
- Bulan: Nama bulan
- Tahun: Tahun
- Timestamp: Waktu update

---

## Sheet 7: `notifications`

**Paste di Row 1:**
```
Notif ID | Type | Message | User ID | Data ID | Timestamp | Read Status
```

**Keterangan:**
- Notif ID: Unique ID (NOTIF_timestamp)
- Type: submit / approve / reject / user_added / datasheet_added / late_request
- Message: Isi notifikasi
- User ID: User yang melakukan action (optional)
- Data ID: Reference ke data terkait (optional)
- Timestamp: Waktu notif dibuat
- Read Status: TRUE/FALSE

---

## 🎯 Quick Setup Script

Copy-paste script ini ke Google Sheets Script Editor untuk setup otomatis:

```javascript
function setupSitelloDatabase() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  
  // Sheet names
  var sheets = [
    {
      name: 'users',
      headers: ['User ID', 'Password', 'Nama', 'Role', 'Photo URL', 'Signature URL', 'Created At'],
      defaultData: [['admin', 'admin123', 'Admin Otsutsuki', 'otsutsuki', '', '', new Date()]]
    },
    {
      name: 'datasheets',
      headers: ['Sheet Name', 'Sheet ID', 'Sheet URL', 'Type', 'Created At']
    },
    {
      name: 'checker_data',
      headers: ['Data ID', 'User ID', 'Check Date', 'Items JSON', 'Status', 'Timestamp']
    },
    {
      name: 'approvals',
      headers: ['Data ID', 'Submitter ID', 'Submitter Role', 'Current Status', 'Approved By Role', 
                'Approved By User', 'Approval Time', 'Signature URL', 'Reject Reason', 'Rejected By', 
                'Reject Time', 'Items JSON', 'Created At']
    },
    {
      name: 'reservasi',
      headers: ['Tanggal', 'Reservasi', 'Jumlah Pack', 'Area Booking', 'Makan', 'Wahana', 'Sewa Sound', 'Timestamp']
    },
    {
      name: 'target_sales',
      headers: ['Sales ID', 'Target', 'Capaian', 'Daerah', 'Bulan', 'Tahun', 'Timestamp']
    },
    {
      name: 'notifications',
      headers: ['Notif ID', 'Type', 'Message', 'User ID', 'Data ID', 'Timestamp', 'Read Status']
    }
  ];
  
  sheets.forEach(function(sheetConfig) {
    var sheet = ss.getSheetByName(sheetConfig.name);
    
    // Create sheet if not exists
    if (!sheet) {
      sheet = ss.insertSheet(sheetConfig.name);
    }
    
    // Clear existing content
    sheet.clear();
    
    // Add headers
    var headerRange = sheet.getRange(1, 1, 1, sheetConfig.headers.length);
    headerRange.setValues([sheetConfig.headers]);
    headerRange.setBackground('#0078D4');
    headerRange.setFontColor('#FFFFFF');
    headerRange.setFontWeight('bold');
    headerRange.setHorizontalAlignment('center');
    
    // Add default data if exists
    if (sheetConfig.defaultData) {
      sheet.getRange(2, 1, sheetConfig.defaultData.length, sheetConfig.defaultData[0].length)
           .setValues(sheetConfig.defaultData);
    }
    
    // Auto-resize columns
    for (var i = 1; i <= sheetConfig.headers.length; i++) {
      sheet.autoResizeColumn(i);
    }
    
    // Freeze header row
    sheet.setFrozenRows(1);
  });
  
  SpreadsheetApp.getUi().alert('✅ SITELLO Database berhasil di-setup!');
}
```

**Cara Pakai Script:**
1. Buka spreadsheet → **Extensions** → **Apps Script**
2. Buat project baru
3. Copy-paste script di atas
4. Save (Ctrl+S)
5. Run function `setupSitelloDatabase`
6. Authorize akses
7. Semua sheet otomatis dibuat dengan header! ✅

---

## ✅ Checklist Setelah Setup

- [ ] 7 sheet sudah dibuat
- [ ] Semua header sudah di-paste
- [ ] Header berwarna biru (#0078D4)
- [ ] Admin default sudah ada di sheet `users`
- [ ] Freeze header row aktif
- [ ] Column sudah auto-resize
- [ ] Spreadsheet ID sudah di-copy

---

## 📌 Tips

1. **Jangan ubah nama sheet** - harus persis: users, datasheets, dll
2. **Jangan ubah nama column** - backend rely on column names
3. **Freeze row 1** - supaya header selalu terlihat saat scroll
4. **Share spreadsheet** dengan "Anyone with link can edit" untuk datasheet eksternal
5. **Backup berkala** - File → Make a copy

---

**Next Step:** Lanjut ke file **DEPLOYMENT.md** untuk deploy Apps Script! 🚀
