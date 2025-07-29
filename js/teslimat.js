document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("teslimat-form");
  const liste = document.getElementById("teslimatListesi");
  const modal = document.getElementById("teslimatModal");
  const closeBtn = document.getElementById("modalClose");

  // Filtre alanları
  const searchCustomer = document.getElementById("searchCustomer");
  const searchTeklif = document.getElementById("searchTeklif");
  const filterDurum = document.getElementById("filterDurum");
  const filterStartDate = document.getElementById("filterStartDate");
  const filterEndDate = document.getElementById("filterEndDate");
  const clearFilters = document.getElementById("clearFilters");

  // Pagination controls
  const prevPageBtn = document.getElementById("prevPage");
  const nextPageBtn = document.getElementById("nextPage");
  const pageInfo = document.getElementById("pageInfo");

  // CSV export button
  const exportBtn = document.getElementById("exportCsv");

  let teslimatlar = JSON.parse(localStorage.getItem("teslimatlar")) || [];

  // Pagination state
  const rowsPerPage = 10;
  let currentPage = 1;
  let filteredData = [];

  // Filtre ve sayfa bilgisi güncelle
  const applyFilters = () => {
    filteredData = teslimatlar.filter(item => {
      const custMatch = item.musteri.toLowerCase().includes(searchCustomer.value.toLowerCase());
      const teklifMatch = item.teklif.toLowerCase().includes(searchTeklif.value.toLowerCase());
      const durumMatch = filterDurum.value ? item.teslimatDurumu === filterDurum.value : true;
      const teslimatDate = new Date(item.teslimatTarihi);
      const startDate = filterStartDate.value ? new Date(filterStartDate.value) : null;
      const endDate = filterEndDate.value ? new Date(filterEndDate.value) : null;
      const startMatch = startDate ? teslimatDate >= startDate : true;
      const endMatch = endDate ? teslimatDate <= endDate : true;
      return custMatch && teklifMatch && durumMatch && startMatch && endMatch;
    });
    currentPage = 1;
    renderList();
  };

  // Sayfa sayısını hesapla
  const totalPages = () => Math.ceil(filteredData.length / rowsPerPage) || 1;

  // Listeyi renderla
  const renderList = () => {
    liste.innerHTML = "";
    const start = (currentPage - 1) * rowsPerPage;
    const end = start + rowsPerPage;
    const pageItems = filteredData.slice(start, end);

    const today = new Date();
    const oneWeekLater = new Date();
    oneWeekLater.setDate(today.getDate() + 7); // 7 gün sonrası

    pageItems.forEach((item, index) => {
      const teslimatDate = new Date(item.teslimatTarihi);
      const isNearDate = teslimatDate >= today && teslimatDate <= oneWeekLater;

      const durumClass =
        item.teslimatDurumu === "Tamamlandı" ? "onaylandı" :
        item.teslimatDurumu === "Bekliyor" ? "beklemede" : "reddedildi";

      const tr = document.createElement("tr");

      tr.innerHTML = `
        <td>${item.musteri}</td>
        <td>${item.teklif}</td>
        <td>
          <span class="${durumClass}">${item.teslimatDurumu}</span><br />
          <button class="durum-btn" data-index="${start + index}" data-durum="Bekliyor">Beklemede</button>
          <button class="durum-btn" data-index="${start + index}" data-durum="Tamamlandı">Tamamlandı</button>
          <button class="durum-btn" data-index="${start + index}" data-durum="İade Edildi">İade</button>
        </td>
        <td>
          ${item.teslimatTarihi} 
          ${isNearDate ? `<span class="tarih-uyari">Yaklaşıyor!</span>` : ""}
        </td>
        <td>${item.faturaNo}</td>
        <td>₺${Number(item.faturaTutar).toFixed(2)}</td>
        <td>
          <button class="detay-btn" data-index="${start + index}">👁️</button>
          <button class="edit-btn" data-index="${start + index}">✏️ Düzenle</button>
          <button class="sil-btn" data-index="${start + index}">🗑️</button>
        </td>
      `;
      liste.appendChild(tr);
    });

    pageInfo.textContent = `Sayfa ${currentPage} / ${totalPages()}`;
    prevPageBtn.disabled = currentPage === 1;
    nextPageBtn.disabled = currentPage === totalPages();
  };

  // Filtre alanlarına event bağla
  [searchCustomer, searchTeklif, filterDurum, filterStartDate, filterEndDate].forEach(el => {
    el.addEventListener("input", applyFilters);
  });

  clearFilters.addEventListener("click", () => {
    searchCustomer.value = "";
    searchTeklif.value = "";
    filterDurum.value = "";
    filterStartDate.value = "";
    filterEndDate.value = "";
    applyFilters();
  });

  // Pagination eventleri
  prevPageBtn.addEventListener("click", () => {
    if (currentPage > 1) {
      currentPage--;
      renderList();
    }
  });

  nextPageBtn.addEventListener("click", () => {
    if (currentPage < totalPages()) {
      currentPage++;
      renderList();
    }
  });

  // CSV export fonksiyonu
  function convertToCSV(arr) {
    const headers = ["Müşteri", "Teklif No", "Teslimat Durumu", "Teslimat Tarihi", "Fatura No", "Fatura Tutarı", "Açıklama"];
    const csvRows = [headers.join(",")];

    arr.forEach(item => {
      const row = [
        `"${item.musteri}"`,
        `"${item.teklif}"`,
        `"${item.teslimatDurumu}"`,
        `"${item.teslimatTarihi}"`,
        `"${item.faturaNo}"`,
        `"${Number(item.faturaTutar).toFixed(2)}"`,
        `"${item.aciklama.replace(/"/g, '""')}"`
      ];
      csvRows.push(row.join(","));
    });

    return csvRows.join("\n");
  }

  exportBtn.addEventListener("click", () => {
    const dataToExport = filteredData.length ? filteredData : teslimatlar;

    if (!dataToExport.length) {
      alert("Dışa aktarılacak kayıt bulunmamaktadır.");
      return;
    }

    const csvData = convertToCSV(dataToExport);
    const blob = new Blob([csvData], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `teslimat_faturalama_${new Date().toISOString().slice(0,10)}.csv`;
    a.style.display = "none";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  });

  // Form submit event (ekleme ve güncelleme)
  form.addEventListener("submit", function (e) {
    e.preventDefault();

    const musteri = document.getElementById("musteri").value.trim();
    const teklif = document.getElementById("teklif").value.trim();
    const teslimatTarihi = document.getElementById("teslimatTarihi").value;
    const teslimatDurumu = document.getElementById("teslimatDurumu").value;
    const faturaNo = document.getElementById("faturaNo").value.trim();
    const faturaTutar = document.getElementById("faturaTutar").value;
    const aciklama = document.getElementById("aciklama").value.trim();
    const editIndex = document.getElementById("editIndex").value;

    const errorMessages = [];

    // Validasyon
    if (!musteri) errorMessages.push("Müşteri adı boş bırakılamaz.");
    if (!teklif) errorMessages.push("Teklif numarası boş bırakılamaz.");
    if (!teslimatTarihi) errorMessages.push("Teslimat tarihi seçilmelidir.");
    if (!teslimatDurumu) errorMessages.push("Teslimat durumu seçilmelidir.");
    if (!faturaNo) errorMessages.push("Fatura numarası boş bırakılamaz.");
    if (!faturaTutar) errorMessages.push("Fatura tutarı boş bırakılamaz.");
    if (teslimatTarihi && isNaN(Date.parse(teslimatTarihi))) errorMessages.push("Geçerli bir teslimat tarihi giriniz.");
    if (faturaTutar && (isNaN(faturaTutar) || Number(faturaTutar) <= 0)) errorMessages.push("Fatura tutarı pozitif bir sayı olmalıdır.");

    const errorDiv = document.getElementById("errorMessages");
    if (errorMessages.length > 0) {
      errorDiv.innerHTML = errorMessages.map(msg => `<p>⚠️ ${msg}</p>`).join("");
      return;
    } else {
      errorDiv.innerHTML = "";
    }

    if (editIndex === "") {
      teslimatlar.push({ musteri, teklif, teslimatTarihi, teslimatDurumu, faturaNo, faturaTutar, aciklama });
    } else {
      teslimatlar[editIndex] = { musteri, teklif, teslimatTarihi, teslimatDurumu, faturaNo, faturaTutar, aciklama };
    }

    localStorage.setItem("teslimatlar", JSON.stringify(teslimatlar));
    applyFilters();
    form.reset();
    document.getElementById("editIndex").value = "";
    form.querySelector("button[type=submit]").textContent = "💾 Kaydet";
  });

  // Butonlar için tıklama olayları
  liste.addEventListener("click", function (e) {
    const index = e.target.getAttribute("data-index");

    if (e.target.classList.contains("sil-btn")) {
      if (confirm("Bu kaydı silmek istediğinize emin misiniz?")) {
        teslimatlar.splice(index, 1);
        localStorage.setItem("teslimatlar", JSON.stringify(teslimatlar));
        applyFilters();
      }
    } else if (e.target.classList.contains("detay-btn")) {
      const item = teslimatlar[index];
      document.getElementById("modalMusteri").textContent = item.musteri;
      document.getElementById("modalTeklif").textContent = item.teklif;
      document.getElementById("modalTarih").textContent = item.teslimatTarihi;
      document.getElementById("modalDurum").textContent = item.teslimatDurumu;
      document.getElementById("modalFaturaNo").textContent = item.faturaNo;
      document.getElementById("modalTutar").textContent = Number(item.faturaTutar).toFixed(2);
      document.getElementById("modalAciklama").textContent = item.aciklama || "-";

      modal.style.display = "block";
    } else if (e.target.classList.contains("edit-btn")) {
      const item = teslimatlar[index];
      document.getElementById("musteri").value = item.musteri;
      document.getElementById("teklif").value = item.teklif;
      document.getElementById("teslimatTarihi").value = item.teslimatTarihi;
      document.getElementById("teslimatDurumu").value = item.teslimatDurumu;
      document.getElementById("faturaNo").value = item.faturaNo;
      document.getElementById("faturaTutar").value = item.faturaTutar;
      document.getElementById("aciklama").value = item.aciklama;
      document.getElementById("editIndex").value = index;
      form.querySelector("button[type=submit]").textContent = "💾 Güncelle";
    } else if (e.target.classList.contains("durum-btn")) {
      const yeniDurum = e.target.getAttribute("data-durum");
      teslimatlar[index].teslimatDurumu = yeniDurum;
      localStorage.setItem("teslimatlar", JSON.stringify(teslimatlar));
      applyFilters();
    }
  });

  // Modal kapatma
  closeBtn.addEventListener("click", () => {
    modal.style.display = "none";
  });

  window.addEventListener("click", (e) => {
    if (e.target === modal) {
      modal.style.display = "none";
    }
  });

  // İlk filtre uygula ve listele
  applyFilters();
});



