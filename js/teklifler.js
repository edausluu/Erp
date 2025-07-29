document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("offerForm");
  const titleInput = document.getElementById("offerTitle");
  const clientInput = document.getElementById("offerClient");
  const priceInput = document.getElementById("offerPrice");
  const statusSelect = document.getElementById("offerStatus");
  const offerItems = document.getElementById("offerItems");
  const successMsg = document.getElementById("successMsg");

  const modal = document.getElementById("offerModal");
  const closeModalBtn = document.getElementById("closeOfferModal");

  let offers = JSON.parse(localStorage.getItem("teklifler")) || [];

  const renderOffers = () => {
    offerItems.innerHTML = "";
    offers.forEach((offer, index) => {
      const div = document.createElement("div");
      div.className = "offer-card";
      div.innerHTML = `
        <strong>${offer.title}</strong> - ${offer.client}<br>
        ₺${Number(offer.price).toFixed(2)} - <span class="status ${offer.status.toLowerCase()}">${offer.status}</span><br>
        <div class="btn-group">
          <button class="btn-detail" onclick="showOfferDetails(${index})">📋 Detay</button>
          <button class="btn-delete" onclick="deleteOffer(${index})">🗑️ Sil</button>
        </div>
      `;
      offerItems.appendChild(div);
    });
  };

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const title = titleInput.value.trim();
    const client = clientInput.value.trim();
    const price = priceInput.value;
    const status = statusSelect.value;

    if (!title || !client || !price || !status) return;

    offers.push({ title, client, price, status });
    localStorage.setItem("teklifler", JSON.stringify(offers));

    form.reset();
    successMsg.textContent = "✅ Teklif başarıyla eklendi!";
    setTimeout(() => (successMsg.textContent = ""), 3000);

    renderOffers();
  });

  window.deleteOffer = (index) => {
    if (confirm("Bu teklifi silmek istediğinize emin misiniz?")) {
      offers.splice(index, 1);
      localStorage.setItem("teklifler", JSON.stringify(offers));
      renderOffers();
    }
  };

  window.showOfferDetails = (index) => {
    const offer = offers[index];
    document.getElementById("detailTitle").textContent = offer.title;
    document.getElementById("detailClient").textContent = offer.client;
    document.getElementById("detailPrice").textContent = Number(offer.price).toFixed(2);
    document.getElementById("detailStatus").textContent = offer.status;
    modal.style.display = "block";
  };

  closeModalBtn.addEventListener("click", () => {
    modal.style.display = "none";
  });

  window.addEventListener("click", (e) => {
    if (e.target === modal) {
      modal.style.display = "none";
    }
  });

  renderOffers();
});




