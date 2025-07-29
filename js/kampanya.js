// js/kampanya.js
document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("kampanya-form");
  const liste = document.getElementById("kampanyaListesi");
  const filterTur = document.getElementById("filterTur");
  const kampanyaSayisi = document.getElementById("kampanyaSayisi");
  const modal = document.getElementById("kampanyaModal");
  const closeBtn = document.getElementById("modalClose");
  const submitBtn = document.getElementById("submitBtn");
  const resetBtn = document.getElementById("resetBtn");
  let kampanyalar = JSON.parse(localStorage.getItem("kampanyalar")) || [];

  // Sayfa Yüklenince listele
  function renderList(filter = "All") {
    liste.innerHTML = "";
    const today = new Date().toISOString().slice(0,10);
    let count = 0;

    kampanyalar.forEach((k, i) => {
      if (filter !== "All" && k.tur !== filter) return;

      const isExpired = k.bitis < today;
      if (!isExpired) count++;

      const tr = document.createElement("tr");
      if (isExpired) tr.classList.add("expired");
      tr.innerHTML = `
        <td>${k.musteri}</td>
        <td>${k.adi}</td>
        <td>${k.tur}</td>
        <td>${k.baslangic} - ${k.bitis}</td>
        <td>${k.kod}</td>
        <td>${k.deger}</td>
        <td>
          <button class="detay-btn" data-index="${i}">👁️</button>
          <button class="edit-btn" data-index="${i}">📝</button>
          <button class="sil-btn" data-index="${i}">🗑️</button>
        </td>
      `;
      liste.appendChild(tr);
    });

    kampanyaSayisi.textContent = `Toplam Aktif Kampanya: ${count}`;
  }

  // storage güncelle
  function saveStorage() {
    localStorage.setItem("kampanyalar", JSON.stringify(kampanyalar));
  }

  // Form sıfırlanınca düzenlemeyi iptal et
  resetBtn.addEventListener("click", () => {
    document.getElementById("editIndex").value = -1;
    submitBtn.textContent = "💾 Kaydet";
  });

  // Form gönderme
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const idx = parseInt(document.getElementById("editIndex").value, 10);
    const yeni = {
      musteri: form.musteri.value,
      adi: form.kampanyaAdi.value,
      tur: form.tur.value,
      baslangic: form.baslangic.value,
      bitis: form.bitis.value,
      aciklama: form.aciklama.value,
      kod: form.kod.value,
      deger: form.deger.value
    };

    if (idx >= 0) {
      // Güncelle
      kampanyalar[idx] = yeni;
    } else {
      // Yeni ekle
      kampanyalar.push(yeni);
    }

    saveStorage();
    form.reset();
    document.getElementById("editIndex").value = -1;
    submitBtn.textContent = "💾 Kaydet";
    renderList(filterTur.value);
  });

  // Liste üzerindeki işlemler
  liste.addEventListener("click", (e) => {
    const i = parseInt(e.target.dataset.index, 10);
    if (e.target.classList.contains("sil-btn")) {
      kampanyalar.splice(i, 1);
      saveStorage();
      renderList(filterTur.value);
    }

    if (e.target.classList.contains("detay-btn")) {
      const k = kampanyalar[i];
      document.getElementById("modalMusteri").innerText = k.musteri;
      document.getElementById("modalAdi").innerText = k.adi;
      document.getElementById("modalTur").innerText = k.tur;
      document.getElementById("modalTarih").innerText = `${k.baslangic} - ${k.bitis}`;
      document.getElementById("modalKod").innerText = k.kod;
      document.getElementById("modalDeger").innerText = k.deger;
      document.getElementById("modalAciklama").innerText = k.aciklama || "-";
      modal.style.display = "block";
    }

    if (e.target.classList.contains("edit-btn")) {
      const k = kampanyalar[i];
      form.musteri.value = k.musteri;
      form.kampanyaAdi.value = k.adi;
      form.tur.value = k.tur;
      form.baslangic.value = k.baslangic;
      form.bitis.value = k.bitis;
      form.aciklama.value = k.aciklama;
      form.kod.value = k.kod;
      form.deger.value = k.deger;
      document.getElementById("editIndex").value = i;
      submitBtn.textContent = "✏️ Güncelle";
      window.scrollTo(0, 0);
    }
  });

  // Filtre
  filterTur.addEventListener("change", () => {
    renderList(filterTur.value);
  });

  // Modal kapatma
  closeBtn.addEventListener("click", () => modal.style.display = "none");
  window.addEventListener("click", (e) => {
    if (e.target === modal) modal.style.display = "none";
  });

  // İlk render
  renderList();
});

