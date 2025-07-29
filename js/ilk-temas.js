document.addEventListener("DOMContentLoaded", () => {
  const currentUser = "Eda";
  // ELEMENTLERİ AL
  const form           = document.getElementById("contactForm");
  const nameIn         = document.getElementById("name");
  const dateIn         = document.getElementById("date");
  const statusIn       = document.getElementById("status");
  const assignedIn     = document.getElementById("assigned");
  const noteIn         = document.getElementById("note");
  const successMsg     = document.getElementById("successMsg");

  const searchIn       = document.getElementById("searchInput");
  const statusFilter   = document.getElementById("statusFilter");
  const startDate      = document.getElementById("startDate");
  const endDate        = document.getElementById("endDate");
  const assignedFilter = document.getElementById("assignedFilter");
  const sortSelect     = document.getElementById("sortSelect");

  const bulkDeleteBtn    = document.getElementById("bulkDeleteBtn");
  const bulkStatusSelect = document.getElementById("bulkStatusSelect");
  const bulkStatusBtn    = document.getElementById("bulkStatusBtn");
  const exportBtn        = document.getElementById("exportBtn");
  const importInput      = document.getElementById("importInput");
  const toggleViewBtn    = document.getElementById("toggleViewBtn");
  const listView         = document.getElementById("listView");
  const calendarView     = document.getElementById("calendarView");
  const tableBody        = document.getElementById("contactTable");
  const noRec            = document.getElementById("noRecords");
  const calendarTable    = document.querySelector("#calendarTable tbody");

  const editModal    = document.getElementById("editModal");
  const closeEditBtn = document.getElementById("closeEditModal");
  const editForm     = document.getElementById("editForm");
  const editIndexIn  = document.getElementById("editIndex");
  const editName     = document.getElementById("editName");
  const editDate     = document.getElementById("editDate");
  const editStatus   = document.getElementById("editStatus");
  const editAssigned = document.getElementById("editAssigned");
  const editNote     = document.getElementById("editNote");

  const toast = document.getElementById("toast");

  let contacts = JSON.parse(localStorage.getItem("ilkTemasTakip")) || [];

  function save() {
    localStorage.setItem("ilkTemasTakip", JSON.stringify(contacts));
  }
  function showToast(msg) {
    toast.textContent = msg;
    toast.classList.add("show");
    setTimeout(()=> toast.classList.remove("show"), 2500);
  }

  function renderList() {
    tableBody.innerHTML = "";
    if (!contacts.length) {
      noRec.style.display = "block";
      return;
    }
    noRec.style.display = "none";

    let data = contacts.map((c,i)=>({ ...c, idx:i }));
    const q = searchIn.value.toLowerCase();
    data = data.filter(c=>
      (c.name.toLowerCase().includes(q) || c.assigned.toLowerCase().includes(q)) &&
      (statusFilter.value==="All"||c.status===statusFilter.value) &&
      (!startDate.value||c.date>=startDate.value) &&
      (!endDate.value  ||c.date<=endDate.value) &&
      (!assignedFilter.value||c.assigned.toLowerCase().includes(assignedFilter.value.toLowerCase()))
    );
    data.sort((a,b)=>
      sortSelect.value==="dateNew"
        ? new Date(b.date)-new Date(a.date)
        : new Date(a.date)-new Date(b.date)
    );
    data.forEach(c=>{
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td><input type="checkbox" class="sel" data-idx="${c.idx}"></td>
        <td>${c.name}</td>
        <td>${c.date}</td>
        <td><span class="status-badge status-${c.status}">${c.status}</span></td>
        <td>${c.assigned||"-"}</td>
        <td>${c.note||"-"}</td>
        <td>${c.createdAt.split("T")[0]} ${c.createdAt.split("T")[1].slice(0,5)}</td>
        <td>${c.user}</td>
        <td>
          <button class="editBtn" data-idx="${c.idx}">✏️</button>
          <button class="delBtn"  data-idx="${c.idx}">🗑️</button>
        </td>`;
      tableBody.appendChild(tr);
    });
  }

  function renderCalendar() {
    calendarTable.innerHTML = "";
    const now = new Date(), year=now.getFullYear(), month=now.getMonth();
    const firstDay=new Date(year,month,1).getDay(), daysInMonth=new Date(year,month+1,0).getDate();
    let row=document.createElement("tr");
    for(let i=0;i<firstDay;i++) row.appendChild(document.createElement("td"));
    for(let d=1;d<=daysInMonth;d++){
      if(row.children.length===7) { calendarTable.appendChild(row); row=document.createElement("tr"); }
      const cell=document.createElement("td");
      cell.innerHTML=`<strong>${d}</strong>`;
      contacts.filter(c=>{
        const dt=new Date(c.date);
        return dt.getFullYear()===year&&dt.getMonth()===month&&dt.getDate()===d;
      }).forEach(c=>{
        const ev=document.createElement("div");
        ev.className="event"; ev.textContent=c.name;
        cell.appendChild(ev);
      });
      row.appendChild(cell);
    }
    while(row.children.length<7) row.appendChild(document.createElement("td"));
    calendarTable.appendChild(row);
  }

  // EVENT LISTENERS
  form.addEventListener("submit",e=>{
    e.preventDefault();
    contacts.push({
      name: nameIn.value.trim(),
      date: dateIn.value,
      status: statusIn.value,
      assigned: assignedIn.value.trim(),
      note: noteIn.value.trim(),
      createdAt: new Date().toISOString(),
      user: currentUser
    });
    save(); form.reset(); successMsg.style.display="block"; showToast("Kayıt eklendi");
    renderList();
  });

  [searchIn,statusFilter,startDate,endDate,assignedFilter,sortSelect]
    .forEach(el=>el.addEventListener("input",renderList));

  tableBody.addEventListener("click",e=>{
    const idx=+e.target.dataset.idx;
    if(e.target.classList.contains("delBtn")&&confirm("Silinsin mi?")){
      contacts.splice(idx,1); save(); renderList(); showToast("Kayıt silindi");
    }
    if(e.target.classList.contains("editBtn")){
      const c=contacts[idx];
      editIndexIn.value=idx;
      editName.value=c.name;
      editDate.value=c.date;
      editStatus.value=c.status;
      editAssigned.value=c.assigned;
      editNote.value=c.note;
      editModal.style.display="block";
    }
  });

  bulkDeleteBtn.addEventListener("click",()=>{
    const sel=[...document.querySelectorAll(".sel:checked")].map(cb=>+cb.dataset.idx);
    if(!sel.length) return alert("Hiç kayıt seçilmedi");
    if(confirm("Seçili kayıtlar silinsin mi?")){
      sel.sort((a,b)=>b-a).forEach(i=>contacts.splice(i,1));
      save(); renderList(); showToast("Seçili silindi");
    }
  });

  bulkStatusBtn.addEventListener("click",()=>{
    const st=bulkStatusSelect.value, sel=[...document.querySelectorAll(".sel:checked")].map(cb=>+cb.dataset.idx);
    if(!st||!sel.length) return;
    sel.forEach(i=>contacts[i].status=st);
    save(); renderList(); showToast("Durum güncellendi");
  });

  exportBtn.addEventListener("click",()=>{
    const hdr=["name","date","status","assigned","note","createdAt","user"];
    const csv=[hdr.join(",")];
    contacts.forEach(c=>csv.push(hdr.map(h=>`"${c[h]||""}"`).join(",")));
    const blob=new Blob([csv.join("\n")],{type:"text/csv"}), a=document.createElement("a");
    a.href=URL.createObjectURL(blob); a.download="takip.csv"; a.click();
  });

  importInput.addEventListener("change",e=>{
    const f=e.target.files[0]; if(!f) return;
    const r=new FileReader();
    r.onload=ev=>{
      const [h,...lines]=ev.target.result.split("\n");
      lines.forEach(l=>{
        if(!l) return;
        const cols=l.match(/(".*?"|[^,]+)/g).map(s=>s.replace(/^"|"$/g,""));
        contacts.push({
          name:cols[0], date:cols[1], status:cols[2],
          assigned:cols[3], note:cols[4], createdAt:cols[5], user:cols[6]
        });
      });
      save(); renderList(); showToast("CSV içe aktarıldı");
    };
    r.readAsText(f);
  });

  toggleViewBtn.addEventListener("click",()=>{
    const showCal=listView.style.display!=="none";
    listView.style.display=showCal?"none":"block";
    calendarView.style.display=showCal?"block":"none";
    if(showCal) renderCalendar();
  });

  closeEditBtn.addEventListener("click",()=>editModal.style.display="none");
  document.getElementById("cancelEdit")
    .addEventListener("click",()=>editModal.style.display="none");

  editForm.addEventListener("submit",e=>{
    e.preventDefault();
    const i=+editIndexIn.value;
    contacts[i]={
      ...contacts[i],
      name:editName.value.trim(),
      date:editDate.value,
      status:editStatus.value,
      assigned:editAssigned.value.trim(),
      note:editNote.value.trim()
    };
    save(); renderList(); editModal.style.display="none"; showToast("Güncellendi");
  });

  renderList();
});




