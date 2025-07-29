// js/potansiyel.js
document.addEventListener("DOMContentLoaded", () => {
  const form       = document.getElementById("customerForm");
  const nameInput  = document.getElementById("name");
  const emailInput = document.getElementById("email");
  const phoneInput = document.getElementById("phone");
  const notesInput = document.getElementById("notes");
  const typeInputs = document.querySelectorAll('input[name="type"]');
  const listDiv    = document.getElementById("customerItems");
  const successMsg = document.getElementById("successMsg");

  const modal      = document.getElementById("detailModal");
  const closeModal = document.getElementById("closeModal");
  const dName      = document.getElementById("detailName");
  const dEmail     = document.getElementById("detailEmail");
  const dPhone     = document.getElementById("detailPhone");
  const dType      = document.getElementById("detailType");
  const dNote      = document.getElementById("detailNote");

  let customers = JSON.parse(localStorage.getItem("potansiyelMusteriler")) || [];

  function save() {
    localStorage.setItem("potansiyelMusteriler", JSON.stringify(customers));
  }

  function renderList() {
    listDiv.innerHTML = "";
    customers.forEach((c, i) => {
      const card = document.createElement("div");
      card.className = "customer-card";
      card.innerHTML = `
        <div class="customer-info">
          <strong>${c.name}</strong>
          <span class="type ${c.type.toLowerCase()}">${c.type}</span><br>
          📧 ${c.email}<br>
          📞 ${c.phone}
        </div>
        <div class="btn-group">
          <button class="btn-detail" data-index="${i}">📋</button>
          <button class="btn-delete" data-index="${i}">🗑️</button>
        </div>
      `;
      listDiv.appendChild(card);
    });
  }

  form.addEventListener("submit", e => {
    e.preventDefault();
    const name  = nameInput.value.trim();
    const email = emailInput.value.trim();
    const phone = phoneInput.value.trim();
    const notes = notesInput.value.trim();
    const type  = [...typeInputs].find(r=>r.checked).value;
    if (!name||!email||!phone) return;
    customers.push({ name, email, phone, notes, type });
    save();
    form.reset();
    successMsg.textContent = "✅ Müşteri başarıyla eklendi!";
    setTimeout(()=> successMsg.textContent="", 3000);
    renderList();
  });

  listDiv.addEventListener("click", e => {
    const i = e.target.dataset.index;
    if (e.target.classList.contains("btn-delete")) {
      if (confirm("Bu müşteriyi silmek istediğinize emin misiniz?")) {
        customers.splice(i,1);
        save(); renderList();
      }
    }
    if (e.target.classList.contains("btn-detail")) {
      const c = customers[i];
      dName.textContent  = c.name;
      dEmail.textContent = c.email;
      dPhone.textContent = c.phone;
      dType.textContent  = c.type;
      dNote.textContent  = c.notes || "-";
      modal.style.display = "block";
    }
  });

  closeModal.addEventListener("click", () => modal.style.display = "none");
  window.addEventListener("click", e => {
    if (e.target === modal) modal.style.display = "none";
  });

  renderList();
});










