const list = document.getElementById("list");
const LOW_STOCK_THRESHOLD = 10;

async function loadItems() {
  const res = await fetch("/api/inventory");
  const items = await res.json();

  list.innerHTML = "";

  items.forEach(item => {
    const isLowStock = item.quantity < LOW_STOCK_THRESHOLD;

    const li = document.createElement("li");
    li.style.marginBottom = "10px";

    if (isLowStock) {
      li.style.color = "red";
      li.style.fontWeight = "bold";
    }

    li.innerHTML = `
      <input
        type="text"
        value="${item.itemName}"
        id="name-${item._id}"
      />

      <input
        type="number"
        value="${item.quantity}"
        id="qty-${item._id}"
        style="width: 70px"
      />

      <button onclick="updateItem('${item._id}')">Update</button>
      <button onclick="deleteItem('${item._id}')">Delete</button>

      ${isLowStock ? "<span>LOW STOCK</span>" : ""}
    `;

    list.appendChild(li);

    // Optional: one-time alert logic (logistics-style)
    if (isLowStock) {
      console.warn(`Low stock warning for item: ${item.itemName}`);
    }
  });
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

async function updateItem(id) {
  const updatedName = document.getElementById(`name-${id}`).value;
  const updatedQty = document.getElementById(`qty-${id}`).value;

  await fetch(`/api/inventoryUpdate/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      itemName: updatedName,
      quantity: Number(updatedQty)
    })
  });

  loadItems();
}

async function deleteItem(id) {
  await fetch(`/api/inventoryDelete/${id}`, {
    method: "DELETE"
  });

  loadItems();
}

loadItems();
