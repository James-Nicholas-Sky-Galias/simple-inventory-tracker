const list = document.getElementById("list");
const LOW_STOCK_THRESHOLD = 10;

async function loadItems() {
  const res = await fetch("/api/inventory");
  const items = await res.json();
  list.innerHTML = "";

  if (!items || items.length === 0) {
    list.innerHTML = "<i>No items in inventory.</i>";
    return;
  }

  let html = `
    <table width="100%" border="1" cellpadding="6" cellspacing="0">
      <tr bgcolor="#f0f0f0">
        <th>Item Name</th>
        <th>Quantity</th>
        <th>Actions</th>
      </tr>
  `;

  items.forEach(item => {
    const lowStockClass =
      item.quantity < LOW_STOCK_THRESHOLD ? "low-stock" : "";

    html += `
      <tr>
        <td>${item.itemName}</td>
        <td class="${lowStockClass}">${item.quantity}</td>
        <td align="center">
          <button onclick="updateItem('${item._id}')">Update</button>
          <button onclick="deleteItem('${item._id}', '${item.itemName}')">Delete</button>
        </td>
      </tr>
    `;
  });

  html += "</table>";
  list.innerHTML = html;
}

async function addItem() {
  const itemName = document.getElementById("itemName").value;
  const quantity = Number(document.getElementById("quantity").value);

  const res = await fetch("/api/inventory", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ itemName, quantity })
  });

  const data = await res.json();

  if (!res.ok) {
    alert(data.message);
    return;
  }

  document.getElementById("itemName").value = "";
  document.getElementById("quantity").value = "";

  loadItems();
}

function openUpdateModal(id, name, qty) {
  document.getElementById("updateId").value = id;
  document.getElementById("updateName").value = name;
  document.getElementById("updateQty").value = qty;

  document.getElementById("updateModal").style.display = "block";
}

function closeModal() {
  document.getElementById("updateModal").style.display = "none";
}

function updateItem(id, name, qty) {
  document.getElementById("updateId").value = id;
  document.getElementById("updateName").value = name || "";
  document.getElementById("updateQty").value = qty;

  document.getElementById("updateModal").style.display = "block";
}

async function confirmUpdate() {
  const id = document.getElementById("updateId").value;
  const choice = document.querySelector('input[name="updateChoice"]:checked').value;

  let updateData = {};

  if (choice === "1" || choice === "3") {
    const newName = document.getElementById("updateName").value.trim();
    if (!newName) {
      alert("Item name cannot be empty.");
      return;
    }
    updateData.itemName = newName;
  }

  if (choice === "2" || choice === "3") {
    const newQty = Number(document.getElementById("updateQty").value);
    if (Number.isNaN(newQty) || newQty < 0) {
      alert("Invalid quantity.");
      return;
    }
    updateData.quantity = newQty;
  }

  const res = await fetch(`/api/inventoryUpdate/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(updateData)
  });

  if (!res.ok) {
    alert("Item already exists in inventory");
    return;
  }

  closeModal();
  loadItems();
}

function closeDeleteModal() {
  document.getElementById("deleteModal").style.display = "none";
}

function deleteItem(id, name) {
  document.getElementById("deleteId").value = id;
  document.getElementById("deleteMessage").innerText =
    `Are you sure you want to delete "${name}"?`;

  document.getElementById("deleteModal").style.display = "block";
}

async function confirmDelete() {
  const id = document.getElementById("deleteId").value;

  await fetch(`/api/inventoryDelete/${id}`, {
    method: "DELETE"
  });

  closeDeleteModal();
  await loadItems();
}

loadItems();
