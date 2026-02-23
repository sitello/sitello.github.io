# Changelog

All notable changes to SITELLO project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [1.1.0] - 2025-02-21

### ✨ Added
- **Notifications page** - Halaman khusus notifikasi dengan filter dan search
- **Real-time notification counter** - Badge merah di dashboard admin
- **Mark as read functionality** - Tandai notifikasi sudah dibaca
- **Auto-refresh notifications** - Update otomatis setiap 30 detik
- **6 tipe notifikasi** - submit, approve, reject, user_added, datasheet_added, late_request
- **Complete documentation** - 7 file dokumentasi lengkap

### 🔄 Changed
- **Notification system** - Dari email-based ke dashboard-only
- **Database structure** - Update struktur sheet `notifications`
- **Admin dashboard** - Tambah notif counter dan auto-refresh

### 📝 Documentation
- Added DEPLOYMENT.md - Panduan deploy lengkap
- Added QUICKSTART.md - Quick start 25 menit
- Added SPREADSHEET_SETUP.md - Template database
- Added PROJECT_SUMMARY.md - Project overview
- Added UPDATE_NOTIFIKASI.md - Changelog notifikasi
- Added GITHUB_INFO.md - Panduan GitHub

### 🐛 Fixed
- Email notification quota issues (removed email completely)

---

## [1.0.0] - 2025-02-19

### 🎉 Initial Release

### ✨ Added
- **Authentication system** - Login dengan User ID & Password
- **Role-based access control** - 5 roles (Hokage, Senpai, Anbu, Chunin, Akatsuki) + Admin (Otsutsuki)
- **Admin dashboard** - Kelola user, datasheet, monitoring
- **Checker input system** - Input data harian dengan landscape orientation
- **Approval flow** - Chunin → Anbu → Senpai → Hokage
- **Digital signature** - Auto-apply saat approve
- **Google Sheets integration** - Direct connection ke Google Sheets
- **Auto-create monthly sheets** - Otomatis buat sheet baru tiap bulan
- **PWA support** - Progressive Web App, bisa install ke home screen
- **Loading screen** - Logo SITELLO dengan animasi
- **Windows XP design** - Clean white-gray-blue theme

### 📊 Features
- Tambah user dengan foto & signature digital
- Tambah datasheet (link Google Sheets)
- Daftar user dengan stats
- Monitoring data (kalender reservasi)
- Pencapaian target sales
- Deadline checker (7 AM - 7 PM)
- Late submission dengan approval request
- Draft auto-save untuk checker input

### 🎨 Design
- Windows XP inspired interface
- Glossy buttons dengan gradients
- Responsive layout
- Portrait/Landscape auto-detection
- Clean typography (Segoe UI, Tahoma)

### 🔐 Security
- Session management (localStorage)
- Password structure ready for hashing
- Role-based page access
- Input sanitization
- Secure file storage (Google Drive)

### 📱 PWA
- Manifest.json configuration
- Install to home screen
- App-like experience
- Offline-ready structure

### 🛠️ Tech Stack
- Frontend: HTML5 + CSS3 + Vanilla JavaScript
- Backend: Google Apps Script
- Database: Google Sheets
- Storage: Google Drive
- Hosting: Apps Script Web App

---

## [Unreleased]

### 🚧 Planned Features
- Password hashing (bcrypt)
- 2FA untuk Admin
- Export data to Excel/PDF
- Grafik visualisasi monitoring
- Email notifications (optional)
- Dark mode toggle
- Multi-language support (ID/EN)
- Offline mode dengan cache
- Push notifications
- Advanced analytics

### 🐛 Known Issues
- None reported yet

---

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for ways to get started.

Please adhere to this project's [Code of Conduct](CODE_OF_CONDUCT.md).

---

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
