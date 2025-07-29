document.addEventListener("DOMContentLoaded", function () {
  // 🎯 1. Kartlara örnek veriler
  document.getElementById("cardMusteri").innerText = "120";
  document.getElementById("cardDonusum").innerText = "%42";
  document.getElementById("cardKampanya").innerText = "36";
  document.getElementById("cardDestek").innerText = "2.5 gün";

  // 📊 2. Bar Chart: Teklif Sayısına Göre Müşteriler
  const barCtx = document.getElementById("barChart").getContext("2d");
  new Chart(barCtx, {
    type: "bar",
    data: {
      labels: ["A Firması", "B Ltd.", "C Şirketi", "D Holding", "E Teknoloji"],
      datasets: [{
        label: "Teklif Sayısı",
        data: [5, 8, 3, 6, 4],
        backgroundColor: "#3498db"
      }]
    },
    options: {
      responsive: true,
      plugins: { legend: { display: false } },
      scales: {
        y: { beginAtZero: true, title: { display: true, text: "Teklif Sayısı" } },
        x: { title: { display: true, text: "Müşteriler" } }
      }
    }
  });

  // 🥧 3. Pie Chart: Kampanya Türü Dağılımı
  const pieCtx = document.getElementById("pieChart").getContext("2d");
  new Chart(pieCtx, {
    type: "pie",
    data: {
      labels: ["Sadakat", "İndirim", "Kupon"],
      datasets: [{
        label: "Kampanya Türleri",
        data: [12, 16, 8],
        backgroundColor: ["#2ecc71", "#f1c40f", "#e74c3c"]
      }]
    },
    options: {
      responsive: true,
      plugins: {
        legend: {
          position: "bottom"
        }
      }
    }
  });

  // 📈 4. Line Chart: Aylık Satış Eğrisi
  const lineCtx = document.getElementById("lineChart").getContext("2d");
  new Chart(lineCtx, {
    type: "line",
    data: {
      labels: ["Ocak", "Şubat", "Mart", "Nisan", "Mayıs", "Haziran", "Temmuz"],
      datasets: [{
        label: "Satış Sayısı",
        data: [8, 12, 10, 15, 18, 13, 20],
        fill: false,
        borderColor: "#8e44ad",
        tension: 0.3
      }]
    },
    options: {
      responsive: true,
      plugins: {
        legend: {
          display: true
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          title: { display: true, text: "Satış Miktarı" }
        },
        x: {
          title: { display: true, text: "Aylar" }
        }
      }
    }
  });
});


