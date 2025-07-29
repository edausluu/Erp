document.addEventListener("DOMContentLoaded", function () {
  const musteriSec = document.getElementById("musteriSec");

  const veriler = {
    a_firmasi: {
      firmaAdi: "A Firması",
      teklifSayisi: 12,
      satisAdedi: 8,
      teslimatSayisi: 6,
      destekSayisi: 2,
      kampanyaSayisi: 4,
      sonIslem: "2025-07-27"
    },
    b_sirketi: {
      firmaAdi: "B Şirketi",
      teklifSayisi: 5,
      satisAdedi: 2,
      teslimatSayisi: 1,
      destekSayisi: 3,
      kampanyaSayisi: 1,
      sonIslem: "2025-07-25"
    },
    c_ltd: {
      firmaAdi: "C Ltd.",
      teklifSayisi: 9,
      satisAdedi: 5,
      teslimatSayisi: 4,
      destekSayisi: 1,
      kampanyaSayisi: 3,
      sonIslem: "2025-07-24"
    },
    d_holding: {
      firmaAdi: "D Holding",
      teklifSayisi: 18,
      satisAdedi: 15,
      teslimatSayisi: 14,
      destekSayisi: 6,
      kampanyaSayisi: 5,
      sonIslem: "2025-07-22"
    },
    e_yazilim: {
      firmaAdi: "E Yazılım",
      teklifSayisi: 7,
      satisAdedi: 3,
      teslimatSayisi: 2,
      destekSayisi: 4,
      kampanyaSayisi: 2,
      sonIslem: "2025-07-20"
    },
    f_grubu: {
      firmaAdi: "F Grubu",
      teklifSayisi: 11,
      satisAdedi: 7,
      teslimatSayisi: 6,
      destekSayisi: 3,
      kampanyaSayisi: 4,
      sonIslem: "2025-07-18"
    }
  };

  musteriSec.addEventListener("change", function () {
    const secilen = musteriSec.value;
    const data = veriler[secilen];

    if (data) {
      document.getElementById("firmaAdi").innerText = data.firmaAdi;
      document.getElementById("teklifSayisi").innerText = data.teklifSayisi;
      document.getElementById("satisAdedi").innerText = data.satisAdedi;
      document.getElementById("teslimatSayisi").innerText = data.teslimatSayisi;
      document.getElementById("destekSayisi").innerText = data.destekSayisi;
      document.getElementById("kampanyaSayisi").innerText = data.kampanyaSayisi;
      document.getElementById("sonIslem").innerText = data.sonIslem;
    }
  });

  musteriSec.dispatchEvent(new Event("change"));
});

