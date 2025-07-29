document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("destek-form");
  const liste = document.getElementById("destekListesi");
  const modal = document.getElementById("destekModal");
  const closeBtn = document.getElementById("modalClose");

  const searchCustomer = document.getElementById("searchCustomer");
  const filterDurum = document.getElementById("filterDurum");
  const clearFilters = document.getElementById("clearFilters");
  const exportBtn = document.getElementById("exportCsv");

  const prevPageBtn = document.getElementById("prevPage");
  const nextPageBtn = document.getElementById("nextPage");
  const pageInfo = document.getElementById("pageInfo");

  let destekler = JSON.parse(localStorage.getItem("destekKayitlari")) || [];

  // Pagination ayarları
  const rowsPerPage = 10;
  let currentPage = 1;
  let filteredData = [];

  // Kayıt listesini filtrele ve sayfala
  const applyFilters = () => {
    filteredData = destekler.filter(item => {
      const custMatch = item.musteri.toLowerCase().includes(searchCustomer.value.toLowerCase());
      const durumMatch = filterDurum.value ? item.durum === filterDurum.value : true;
      return custMatch && durumMatch;
    });
    currentPage = 1;
    renderList();
  };

  const totalPages = () => Math.ceil(filteredData.length / rowsPerPage) || 1;

  const renderList = () => {
    liste.innerHTML = "";
    const start = (currentPage - 1) * rowsPerPage;
    const end = start + rowsPerPage;
    const pageItems = filteredData.slice(start, end);

    pageItems.forEach((item, index) => {
      const durumClass =
        item.durum === "Çözüldü" ? "onaylandı" :
        item.durum === "Bekliyor" ? "beklemede" : "reddedildi";

      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td>${item.musteri}</td>
        <td>${item.baslik}</td>
        <td><span class="${durumClass}">${item.durum}</span></td>
        <td>${item.tarih}</td>
        <td>
          <button class="detay-btn" data-index="${start + index}">👁️</button>
          <button class="edit-btn" data-index="${start + index}">✏️</button>
          <button class="sil-btn" data-index="${start + index}">🗑️</button>
        </td>
      `;
      liste.appendChild(tr);
    });

    pageInfo.textContent = `Sayfa ${currentPage} / ${totalPages()}`;
    prevPageBtn.disabled = currentPage === 1;
    nextPageBtn.disabled = currentPage === totalPages();
  };

  // Form verisini temizle ve hazırla
  const clearForm = () => {
    form.reset();
    form.dataset.editIndex = "";
  };

  // Yeni kayıt ekleme veya var olanı düzenleme
  form.addEventListener("submit", e => {
    e.preventDefault();

    const musteri = document.getElementById("musteri").value.trim();
    const baslik = document.getElementById("baslik").value.trim();
    const aciklama = document.getElementById("aciklama").value.trim();
    const durum = document.getElementById("durum").value;
    const tarih = document.getElementById("tarih").value;

    if (!musteri || !baslik || !tarih) {
      alert("Lütfen gerekli alanları doldurun.");
      return;
    }

    const yeniKayit = { musteri, baslik, aciklama, durum, tarih };
    const editIndex = form.dataset.editIndex;

    if (editIndex !== undefined && editIndex !== "") {
      // Düzenleme modunda
      destekler[editIndex] = yeniKayit;
      delete form.dataset.editIndex;
    } else {
      // Yeni kayıt
      destekler.push(yeniKayit);
    }
    localStorage.setItem("destekKayitlari", JSON.stringify(destekler));

    applyFilters();
    clearForm();
  });

  // Butonlar için tıklama olayları
  liste.addEventListener("click", e => {
    const index = e.target.dataset.index;
    if (e.target.classList.contains("sil-btn")) {
      if (confirm("Bu destek kaydını silmek istediğinize emin misiniz?")) {
        destekler.splice(index, 1);
        localStorage.setItem("destekKayitlari", JSON.stringify(destekler));
        applyFilters();
      }
    } else if (e.target.classList.contains("detay-btn")) {
      const item = destekler[index];
      document.getElementById("modalMusteri").innerText = item.musteri;
      document.getElementById("modalBaslik").innerText = item.baslik;
      document.getElementById("modalAciklama").innerText = item.aciklama;
      document.getElementById("modalDurum").innerText = item.durum;
      document.getElementById("modalTarih").innerText = item.tarih;
      modal.style.display = "block";
    } else if (e.target.classList.contains("edit-btn")) {
      const item = destekler[index];
      document.getElementById("musteri").value = item.musteri;
      document.getElementById("baslik").value = item.baslik;
      document.getElementById("aciklama").value = item.aciklama;
      document.getElementById("durum").value = item.durum;
      document.getElementById("tarih").value = item.tarih;
      form.dataset.editIndex = index;
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  });

  // Modal kapatma
  closeBtn.addEventListener("click", () => {
    modal.style.display = "none";
  });

  window.addEventListener("click", e => {
    if (e.target === modal) {
      modal.style.display = "none";
    }
  });

  // Filtre eventleri
  searchCustomer.addEventListener("input", applyFilters);
  filterDurum.addEventListener("change", applyFilters);

  // Filtreleri temizle
  clearFilters.addEventListener("click", () => {
    searchCustomer.value = "";
    filterDurum.value = "";
    applyFilters();
  });

  // CSV dışa aktarma fonksiyonu
  function convertToCSV(arr) {
    const headers = ["Müşteri", "Başlık", "Durum", "Tarih", "Açıklama"];
    const csvRows = [headers.join(",")];

    arr.forEach(item => {
      const row = [
        `"${item.musteri.replace(/"/g, '""')}"`,
        `"${item.baslik.replace(/"/g, '""')}"`,
        `"${item.durum.replace(/"/g, '""')}"`,
        `"${item.tarih}"`,
        `"${item.aciklama ? item.aciklama.replace(/"/g, '""') : ""}"`,
      ];
      csvRows.push(row.join(","));
    });

    return csvRows.join("\n");
  }

  exportBtn.addEventListener("click", () => {
    if (destekler.length === 0) {
      alert("Dışa aktarılacak kayıt bulunmamaktadır.");
      return;
    }
    const csvData = "\uFEFF" + convertToCSV(filteredData.length ? filteredData : destekler);
    const blob = new Blob([csvData], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `destek_kayitlari_${new Date().toISOString().slice(0,10)}.csv`;
    a.style.display = "none";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  });

  // İlk filtre ve liste render
  applyFilters();
});


