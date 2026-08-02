import { fetchAdminData, deleteDocument } from './firebase.js';

document.addEventListener('DOMContentLoaded', () => {
  const loginOverlay = document.getElementById('loginOverlay');
  const adminLoginForm = document.getElementById('adminLoginForm');
  const adminPass = document.getElementById('adminPass');

  // Hardcoded Admin Passkey (Change in production)
  const ADMIN_KEY = "maya2027";

  if (sessionStorage.getItem('admin_authenticated') === 'true') {
    loginOverlay.style.display = 'none';
    loadDashboardData();
  }

  adminLoginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    if (adminPass.value === ADMIN_KEY) {
      sessionStorage.setItem('admin_authenticated', 'true');
      loginOverlay.style.display = 'none';
      loadDashboardData();
    } else {
      alert("كلمة المرور غير صحيحة!");
    }
  });

  document.getElementById('btnLogout').addEventListener('click', () => {
    sessionStorage.removeItem('admin_authenticated');
    window.location.reload();
  });

  async function loadDashboardData() {
    const data = await fetchAdminData();

    // Fill Metrics
    document.getElementById('statVisitors').textContent = data.visitorsCount;
    const attendingCount = data.rsvps.filter(r => r.attendance === 'attending').length;
    const declinedCount = data.rsvps.filter(r => r.attendance === 'declined').length;
    
    document.getElementById('statAttending').textContent = attendingCount;
    document.getElementById('statDeclined').textContent = declinedCount;
    document.getElementById('statMessages').textContent = data.messages.length;

    // Render RSVPs
    const rsvpBody = document.getElementById('rsvpTableBody');
    rsvpBody.innerHTML = '';
    data.rsvps.forEach(item => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>${item.name}</td>
        <td>${item.phone}</td>
        <td>${item.guests}</td>
        <td>${item.attendance === 'attending' ? 'حاضر' : 'معتذر'}</td>
        <td>${item.message || '-'}</td>
        <td><button class="btn-delete" data-id="${item.id}" data-col="RSVP">حذف</button></td>
      `;
      rsvpBody.appendChild(tr);
    });

    // Render Messages
    const gbBody = document.getElementById('guestbookTableBody');
    gbBody.innerHTML = '';
    data.messages.forEach(item => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>${item.name}</td>
        <td>${item.message}</td>
        <td><button class="btn-delete" data-id="${item.id}" data-col="GuestBook">حذف</button></td>
      `;
      gbBody.appendChild(tr);
    });

    // Event Delegation for Deletion
    document.querySelectorAll('.btn-delete').forEach(btn => {
      btn.addEventListener('click', async () => {
        if (confirm("هل أنت تأكد من رغبتك في الحذف؟")) {
          await deleteDocument(btn.dataset.col, btn.dataset.id);
          loadDashboardData();
        }
      });
    });
  }

  // Export to CSV Functionality
  document.getElementById('btnExportCSV').addEventListener('click', async () => {
    const data = await fetchAdminData();
    let csvContent = "data:text/csv;charset=utf-8,\uFEFF";
    csvContent += "الاسم,رقم الهاتف,عدد المرافقين,الحالة,الرسالة\n";

    data.rsvps.forEach(r => {
      const status = r.attendance === 'attending' ? 'حاضر' : 'معتذر';
      csvContent += `"${r.name}","${r.phone}","${r.guests}","${status}","${r.message || ''}"\n`;
    });

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "RSVP_Wedding_Maya_Abdelrahman.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  });
});