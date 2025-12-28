let socket;
let token = "";
let userId = "";

const notificationsDiv = document.getElementById("notifications");
const unreadCountSpan = document.getElementById("unreadCount");

window.connect = async function () {
  userId = document.getElementById("userIdInput").value;
  token = document.getElementById("tokenInput").value;

  if (!userId || !token) {
    alert("User ID and Token required");
    return;
  }

  socket = io("http://localhost:8000");

  socket.on("connect", () => {
    console.log("🟢 Socket connected");
    socket.emit("join", userId);
  });

  socket.on("notification", (data) => {
    console.log("🔔 New notification:", data);
    renderNotification(data, true);
    incrementUnread();
  });

  await loadNotifications();
  await loadUnreadCount();
};

async function loadNotifications() {
  const res = await fetch("/api/notifications", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const result = await res.json();
  notificationsDiv.innerHTML = "";

  result.data.forEach((n) => renderNotification(n, !n.isRead));
}

async function loadUnreadCount() {
  const res = await fetch("/api/notifications/unread-count", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const result = await res.json();
  unreadCountSpan.innerText = result.count;
}

function renderNotification(notification, unread = false) {
  const div = document.createElement("div");
  div.className = `notification ${unread ? "unread" : ""}`;

  div.innerHTML = `
    <strong>${notification.title}</strong>
    <p>${notification.message}</p>
    <small>${new Date(notification.createdAt).toLocaleString()}</small>
    ${
      !notification.isRead
        ? `<br/><button onclick="markRead('${notification._id}', this)">Mark as read</button>`
        : ""
    }
  `;

  notificationsDiv.prepend(div);
}

async function markRead(id, btn) {
  await fetch(`/api/notifications/${id}/read`, {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  btn.remove();
  decrementUnread();
}

function incrementUnread() {
  unreadCountSpan.innerText = Number(unreadCountSpan.innerText) + 1;
}

function decrementUnread() {
  unreadCountSpan.innerText = Math.max(
    0,
    Number(unreadCountSpan.innerText) - 1
  );
}
