document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("satis-form");
  const tbody = document.getElementById("satisListesi");
  const modal = document.getElementById("detayModal");
  const closeBtn = modal.querySelector(".modal-close");

  let satislar = JSON.parse(localStorage.getItem("satislar")) || [];

  const renderList = () => {
    tbody.innerHTML = "";
    satislar.forEach((satis, index) => {
      const durumClass =
        satis.satisDurumu === "Onaylandı" ? "onaylandı" :
        satis.satisDurumu === "Beklemede" ? "beklemede" : "reddedildi";

      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td>${satis.musteriAdi}</td>
        <td>${satis.teklifNo}</td>
        <td>${satis.satisTarihi}</td>
        <td><span class="${durumClass}">${satis.satisDurumu}</span></td>
        <td>
          <button class="goruntule" data-index="${index}">👁️</button>
          <button class="sil" data-index="${index}">🗑️</button>
        </td>
      `;
      tbody.appendChild(tr);
    });
  };

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const musteriAdi = document.getElementById("musteriAdi").value.trim();
    const teklifNo = document.getElementById("teklifNo").value.trim();
    const satisTarihi = document.getElementById("satisTarihi").value;
    const satisDurumu = document.getElementById("satisDurumu").value;
    const aciklama = document.getElementById("aciklama").value.trim();

    if (!musteriAdi || !teklifNo || !satisTarihi || !satisDurumu) return;

    satislar.push({ musteriAdi, teklifNo, satisTarihi, satisDurumu, aciklama });
    localStorage.setItem("satislar", JSON.stringify(satislar));
    renderList();
    form.reset();
  });

  tbody.addEventListener("click", (e) => {
    const index = e.target.getAttribute("data-index");
    if (e.target.classList.contains("sil")) {
      if (confirm("Bu satışı silmek istediğinize emin misiniz?")) {
        satislar.splice(index, 1);
        localStorage.setItem("satislar", JSON.stringify(satislar));
        renderList();
      }
    }

    if (e.target.classList.contains("goruntule")) {
      const satis = satislar[index];
      document.getElementById("modalMusteri").textContent = satis.musteriAdi;
      document.getElementById("modalTeklif").textContent = satis.teklifNo;
      document.getElementById("modalTarih").textContent = satis.satisTarihi;
      document.getElementById("modalDurum").textContent = satis.satisDurumu;
      document.getElementById("modalAciklama").textContent = satis.aciklama || "-";

      modal.style.display = "block";
    }
  });

  closeBtn.addEventListener("click", () => {
    modal.style.display = "none";
  });

  window.addEventListener("click", (e) => {
    if (e.target === modal) {
      modal.style.display = "none";
    }
  });

  renderList();
});



