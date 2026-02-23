// ============================================
// SITELLO - Google Apps Script Backend
// ============================================

// Configuration
const CONFIG = {
  SPREADSHEET_ID: 'YOUR_MASTER_SPREADSHEET_ID', // Ganti dengan ID spreadsheet master
  SHEETS: {
    USERS: 'users',
    DATASHEETS: 'datasheets',
    CHECKER_DATA: 'checker_data',
    APPROVALS: 'approvals',
    RESERVASI: 'reservasi',
    TARGET_SALES: 'target_sales',
    NOTIFICATIONS: 'notifications'
  }
};

// Get master spreadsheet
function getMasterSheet() {
  return SpreadsheetApp.openById(CONFIG.SPREADSHEET_ID);
}

// ============================================
// WEB APP HANDLER
// ============================================

function doGet(e) {
  return HtmlService.createHtmlOutputFromFile('index')
    .setTitle('SITELLO')
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}

function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    const action = data.action;

    switch(action) {
      case 'login':
        return ContentService.createTextOutput(JSON.stringify(handleLogin(data)))
          .setMimeType(ContentService.MimeType.JSON);
      
      case 'addUser':
        return ContentService.createTextOutput(JSON.stringify(handleAddUser(data)))
          .setMimeType(ContentService.MimeType.JSON);
      
      case 'addDatasheet':
        return ContentService.createTextOutput(JSON.stringify(handleAddDatasheet(data)))
          .setMimeType(ContentService.MimeType.JSON);
      
      case 'getUsers':
        return ContentService.createTextOutput(JSON.stringify(handleGetUsers()))
          .setMimeType(ContentService.MimeType.JSON);
      
      case 'submitCheckerData':
        return ContentService.createTextOutput(JSON.stringify(handleSubmitCheckerData(data)))
          .setMimeType(ContentService.MimeType.JSON);
      
      case 'approveData':
        return ContentService.createTextOutput(JSON.stringify(handleApproveData(data)))
          .setMimeType(ContentService.MimeType.JSON);
      
      case 'rejectData':
        return ContentService.createTextOutput(JSON.stringify(handleRejectData(data)))
          .setMimeType(ContentService.MimeType.JSON);
      
      case 'getNotifications':
        return ContentService.createTextOutput(JSON.stringify({
          success: true,
          notifications: getNotifications()
        })).setMimeType(ContentService.MimeType.JSON);
      
      case 'getUnreadCount':
        return ContentService.createTextOutput(JSON.stringify({
          success: true,
          count: getUnreadCount()
        })).setMimeType(ContentService.MimeType.JSON);
      
      case 'markNotificationAsRead':
        return ContentService.createTextOutput(JSON.stringify(markNotificationAsRead(data.notifId)))
          .setMimeType(ContentService.MimeType.JSON);
      
      default:
        return ContentService.createTextOutput(JSON.stringify({
          success: false,
          message: 'Invalid action'
        })).setMimeType(ContentService.MimeType.JSON);
    }
  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({
      success: false,
      message: error.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}

// ============================================
// AUTHENTICATION
// ============================================

function handleLogin(data) {
  const { userId, password } = data;
  
  const sheet = getMasterSheet().getSheetByName(CONFIG.SHEETS.USERS);
  const values = sheet.getDataRange().getValues();
  
  // Skip header row
  for (let i = 1; i < values.length; i++) {
    const row = values[i];
    const storedUserId = row[0];
    const storedPassword = row[1]; // In production, use hashed password
    const name = row[2];
    const role = row[3];
    const photoUrl = row[4];
    const signatureUrl = row[5];
    
    if (storedUserId === userId && storedPassword === password) {
      return {
        success: true,
        user: {
          userId,
          name,
          role,
          photoUrl,
          signatureUrl
        }
      };
    }
  }
  
  return {
    success: false,
    message: 'User ID atau Password salah'
  };
}

// ============================================
// USER MANAGEMENT
// ============================================

function handleAddUser(data) {
  const { userId, password, name, role, photo, signature } = data;
  
  // Check if user already exists
  const sheet = getMasterSheet().getSheetByName(CONFIG.SHEETS.USERS);
  const values = sheet.getDataRange().getValues();
  
  for (let i = 1; i < values.length; i++) {
    if (values[i][0] === userId) {
      return {
        success: false,
        message: 'User ID sudah terdaftar'
      };
    }
  }
  
  // Save photo and signature to Google Drive
  const photoUrl = photo ? saveFileToGoogleDrive(photo, `photo_${userId}`) : '';
  const signatureUrl = signature ? saveFileToGoogleDrive(signature, `signature_${userId}`) : '';
  
  // Add user to sheet
  const timestamp = new Date();
  sheet.appendRow([userId, password, name, role, photoUrl, signatureUrl, timestamp]);
  
  // Send notification to admin dashboard
  addNotification('user_added', `User baru ditambahkan: ${name} (${role})`, userId, null);
  
  return {
    success: true,
    message: 'User berhasil ditambahkan'
  };
}

function handleGetUsers() {
  const sheet = getMasterSheet().getSheetByName(CONFIG.SHEETS.USERS);
  const values = sheet.getDataRange().getValues();
  
  const users = [];
  for (let i = 1; i < values.length; i++) {
    const row = values[i];
    users.push({
      userId: row[0],
      name: row[2],
      role: row[3],
      photoUrl: row[4],
      signatureUrl: row[5],
      createdAt: row[6]
    });
  }
  
  return {
    success: true,
    users
  };
}

// ============================================
// DATASHEET MANAGEMENT
// ============================================

function handleAddDatasheet(data) {
  const { sheetName, sheetUrl, sheetType } = data;
  
  // Extract spreadsheet ID from URL
  const sheetId = extractSpreadsheetId(sheetUrl);
  
  if (!sheetId) {
    return {
      success: false,
      message: 'URL Google Sheets tidak valid'
    };
  }
  
  // Test connection
  try {
    const testSheet = SpreadsheetApp.openById(sheetId);
    testSheet.getName(); // Will throw error if not accessible
  } catch (error) {
    return {
      success: false,
      message: 'Tidak dapat mengakses Google Sheets. Pastikan sudah di-share dengan benar.'
    };
  }
  
  // Add to datasheets registry
  const sheet = getMasterSheet().getSheetByName(CONFIG.SHEETS.DATASHEETS);
  const timestamp = new Date();
  sheet.appendRow([sheetName, sheetId, sheetUrl, sheetType, timestamp]);
  
  // Setup auto-create monthly sheet if checker type
  if (sheetType === 'checker') {
    setupMonthlySheetCreation(sheetId);
  }
  
  return {
    success: true,
    message: 'Datasheet berhasil ditambahkan'
  };
}

function extractSpreadsheetId(url) {
  const match = url.match(/\/spreadsheets\/d\/([a-zA-Z0-9-_]+)/);
  return match ? match[1] : null;
}

function setupMonthlySheetCreation(sheetId) {
  // Create trigger for monthly sheet creation
  const targetSheet = SpreadsheetApp.openById(sheetId);
  createMonthlySheetIfNeeded(targetSheet);
}

function createMonthlySheetIfNeeded(spreadsheet) {
  const now = new Date();
  const monthYear = Utilities.formatDate(now, Session.getScriptTimeZone(), 'MMMM-yyyy');
  
  // Check if sheet already exists
  const sheets = spreadsheet.getSheets();
  for (let sheet of sheets) {
    if (sheet.getName() === monthYear) {
      return; // Sheet already exists
    }
  }
  
  // Create new sheet
  const newSheet = spreadsheet.insertSheet(monthYear);
  
  // Setup headers
  newSheet.appendRow(['Tanggal', 'Checker ID', 'Item Check', 'Kondisi', 'Jumlah Unit', 'Keterangan', 'Status', 'Timestamp']);
  
  // Format header
  const headerRange = newSheet.getRange(1, 1, 1, 8);
  headerRange.setBackground('#0078D4');
  headerRange.setFontColor('#FFFFFF');
  headerRange.setFontWeight('bold');
}

// ============================================
// CHECKER DATA SUBMISSION
// ============================================

function handleSubmitCheckerData(data) {
  const { userId, sheetId, checkDate, checkItems, notes } = data;
  
  const targetSheet = SpreadsheetApp.openById(sheetId);
  const now = new Date();
  const monthYear = Utilities.formatDate(now, Session.getScriptTimeZone(), 'MMMM-yyyy');
  
  let sheet = targetSheet.getSheetByName(monthYear);
  
  // Create sheet if not exists
  if (!sheet) {
    createMonthlySheetIfNeeded(targetSheet);
    sheet = targetSheet.getSheetByName(monthYear);
  }
  
  // Check deadline (7 AM - 7 PM)
  const hour = now.getHours();
  if (hour < 7 || hour >= 19) {
    // Need admin approval
    return {
      success: false,
      needsApproval: true,
      message: 'Sudah melewati deadline (19:00). Perlu approval admin.'
    };
  }
  
  // Add checker data
  for (let item of checkItems) {
    sheet.appendRow([
      checkDate,
      userId,
      item.name,
      item.condition,
      item.quantity,
      item.notes || notes,
      'pending',
      now
    ]);
  }
  
  // Add to approval queue
  addToApprovalQueue(userId, 'chunin', checkDate, checkItems);
  
  // Notify admin dashboard
  addNotification('submit', `${userId} submit data checker (${checkDate})`, userId, null);
  
  return {
    success: true,
    message: 'Data berhasil disubmit dan menunggu approval'
  };
}

// ============================================
// APPROVAL FLOW
// ============================================

function handleApproveData(data) {
  const { dataId, approverUserId, approverRole, signature } = data;
  
  // Get approval data
  const sheet = getMasterSheet().getSheetByName(CONFIG.SHEETS.APPROVALS);
  const values = sheet.getDataRange().getValues();
  
  let rowIndex = -1;
  for (let i = 1; i < values.length; i++) {
    if (values[i][0] === dataId) {
      rowIndex = i + 1; // +1 because array is 0-indexed
      break;
    }
  }
  
  if (rowIndex === -1) {
    return {
      success: false,
      message: 'Data tidak ditemukan'
    };
  }
  
  // Update approval status
  const timestamp = new Date();
  sheet.getRange(rowIndex, 5).setValue(approverRole); // Approved by role
  sheet.getRange(rowIndex, 6).setValue(approverUserId); // Approved by user
  sheet.getRange(rowIndex, 7).setValue(timestamp); // Approval timestamp
  sheet.getRange(rowIndex, 8).setValue(signature); // Signature URL
  
  // Determine next approver
  const nextRole = getNextApprovalRole(approverRole);
  
  if (nextRole) {
    sheet.getRange(rowIndex, 4).setValue(nextRole); // Update status to next role
    addNotification('approve', `Data di-approve oleh ${approverRole}, menunggu ${nextRole}`, approverUserId, dataId);
  } else {
    sheet.getRange(rowIndex, 4).setValue('approved'); // Final approval
    addNotification('approve', `Data telah FINAL di-approve oleh ${approverRole}`, approverUserId, dataId);
  }
  
  return {
    success: true,
    message: 'Data berhasil diapprove',
    nextRole
  };
}

function handleRejectData(data) {
  const { dataId, rejecterUserId, rejecterRole, reason } = data;
  
  const sheet = getMasterSheet().getSheetByName(CONFIG.SHEETS.APPROVALS);
  const values = sheet.getDataRange().getValues();
  
  let rowIndex = -1;
  for (let i = 1; i < values.length; i++) {
    if (values[i][0] === dataId) {
      rowIndex = i + 1;
      break;
    }
  }
  
  if (rowIndex === -1) {
    return {
      success: false,
      message: 'Data tidak ditemukan'
    };
  }
  
  const timestamp = new Date();
  sheet.getRange(rowIndex, 4).setValue('rejected');
  sheet.getRange(rowIndex, 9).setValue(reason);
  sheet.getRange(rowIndex, 10).setValue(rejecterUserId);
  sheet.getRange(rowIndex, 11).setValue(timestamp);
  
  // Notify admin dashboard
  const submitterId = values[rowIndex - 1][1];
  addNotification('reject', `Data dari ${submitterId} di-reject oleh ${rejecterRole}: ${reason}`, rejecterUserId, dataId);
  
  return {
    success: true,
    message: 'Data telah direject'
  };
}

function getNextApprovalRole(currentRole) {
  const hierarchy = {
    'chunin': 'anbu',
    'anbu': 'senpai',
    'senpai': 'hokage',
    'hokage': null // Final
  };
  
  return hierarchy[currentRole] || null;
}

function addToApprovalQueue(userId, role, checkDate, checkItems) {
  const sheet = getMasterSheet().getSheetByName(CONFIG.SHEETS.APPROVALS);
  const dataId = `DATA_${Date.now()}`;
  const timestamp = new Date();
  
  sheet.appendRow([
    dataId,
    userId,
    role,
    'anbu', // Start with Anbu approval
    '', // Approved by role
    '', // Approved by user
    '', // Approval timestamp
    '', // Signature
    '', // Reject reason
    '', // Rejected by
    '', // Reject timestamp
    JSON.stringify(checkItems),
    timestamp
  ]);
}

// ============================================
// NOTIFICATIONS (Admin Dashboard Only - No Email)
// ============================================

function addNotification(type, message, userId, dataId) {
  const sheet = getMasterSheet().getSheetByName(CONFIG.SHEETS.NOTIFICATIONS);
  const timestamp = new Date();
  const notifId = `NOTIF_${Date.now()}`;
  
  // Type: submit, approve, reject, late_request, user_added, datasheet_added
  sheet.appendRow([
    notifId,
    type,
    message,
    userId || '',
    dataId || '',
    timestamp,
    false // read status
  ]);
}

function getNotifications() {
  const sheet = getMasterSheet().getSheetByName(CONFIG.SHEETS.NOTIFICATIONS);
  const values = sheet.getDataRange().getValues();
  
  const notifications = [];
  for (let i = values.length - 1; i > 0; i--) { // Reverse order (newest first)
    const row = values[i];
    notifications.push({
      notifId: row[0],
      type: row[1],
      message: row[2],
      userId: row[3],
      dataId: row[4],
      timestamp: row[5],
      read: row[6]
    });
  }
  
  return notifications;
}

function markNotificationAsRead(notifId) {
  const sheet = getMasterSheet().getSheetByName(CONFIG.SHEETS.NOTIFICATIONS);
  const values = sheet.getDataRange().getValues();
  
  for (let i = 1; i < values.length; i++) {
    if (values[i][0] === notifId) {
      sheet.getRange(i + 1, 7).setValue(true); // Mark as read
      return { success: true };
    }
  }
  
  return { success: false, message: 'Notification not found' };
}

function getUnreadCount() {
  const sheet = getMasterSheet().getSheetByName(CONFIG.SHEETS.NOTIFICATIONS);
  const values = sheet.getDataRange().getValues();
  
  let count = 0;
  for (let i = 1; i < values.length; i++) {
    if (!values[i][6]) { // If not read
      count++;
    }
  }
  
  return count;
}

// ============================================
// GOOGLE DRIVE FILE STORAGE
// ============================================

function saveFileToGoogleDrive(base64Data, fileName) {
  try {
    // Remove data URL prefix
    const base64 = base64Data.split(',')[1];
    const mimeType = base64Data.split(';')[0].split(':')[1];
    
    // Decode base64
    const blob = Utilities.newBlob(Utilities.base64Decode(base64), mimeType, fileName);
    
    // Create or get SITELLO folder
    const folders = DriveApp.getFoldersByName('SITELLO_Files');
    const folder = folders.hasNext() ? folders.next() : DriveApp.createFolder('SITELLO_Files');
    
    // Save file
    const file = folder.createFile(blob);
    file.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
    
    return file.getUrl();
  } catch (error) {
    Logger.log('Error saving file: ' + error);
    return '';
  }
}

// ============================================
// SCHEDULED TASKS (Triggers)
// ============================================

// Run daily at midnight to create new monthly sheets
function dailySheetMaintenance() {
  const sheet = getMasterSheet().getSheetByName(CONFIG.SHEETS.DATASHEETS);
  const values = sheet.getDataRange().getValues();
  
  for (let i = 1; i < values.length; i++) {
    const sheetType = values[i][3];
    const sheetId = values[i][1];
    
    if (sheetType === 'checker') {
      const targetSheet = SpreadsheetApp.openById(sheetId);
      createMonthlySheetIfNeeded(targetSheet);
    }
  }
}

// Setup triggers (run once manually)
function setupTriggers() {
  // Delete existing triggers
  const triggers = ScriptApp.getProjectTriggers();
  triggers.forEach(trigger => ScriptApp.deleteTrigger(trigger));
  
  // Create daily trigger at midnight
  ScriptApp.newTrigger('dailySheetMaintenance')
    .timeBased()
    .atHour(0)
    .everyDays(1)
    .create();
}
