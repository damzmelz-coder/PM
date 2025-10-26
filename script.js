let equipmentList = [];
let inspections = [];

async function loadEquipment() {
  const res = await fetch("equipment.json");
  equipmentList = await res.json();
  const dropdown = document.getElementById("equipment-dropdown");
  dropdown.innerHTML = "";
  equipmentList.forEach((eq, i) => {
    const option = document.createElement("option");
    option.value = i;
    option.text = `${eq.type} – ${eq.serial}`;
    dropdown.appendChild(option);
  });
}

document.getElementById("inspection").addEventListener("submit", function (e) {
  e.preventDefault();
  const selected = equipmentList[document.getElementById("equipment-dropdown").value];
  const checklistItems = document.querySelectorAll(".check-item");
  const checklist = Array.from(checklistItems).map(item => ({
    item: item.dataset.label,
    status: item.value,
    notes: item.nextElementSibling.value
  }));
  inspections.push({
    equipment_serial: selected.serial,
    date: new Date().toISOString(),
    inspected_by: "Inspector",
    status: "Operational",
    checklist
  });
  alert("Inspection submitted!");
});

function exportToExcel() {
  const worksheet = XLSX.utils.json_to_sheet(inspections);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Inspections");
  XLSX.writeFile(workbook, "inspection_log.xlsx");
}

window.onload = () => {
  loadEquipment();
  renderChecklist();
};

function renderChecklist() {
  const checklist = [
    "Check cable damage",
    "Check hydraulic leaks",
    "Ensure terminal box is secured",
    "Check tank lid condition",
    "Inspect hoist ropes",
    "Check overhead switch assembly",
    "Clean motor fins",
    "Inspect bearing bar",
    "Clean adaptors and inspect threads",
    "Check hydraulic hose routing",
    "Inspect latch cable sheaves",
    "Secure branch Tee",
    "Check adaptor movement",
    "Inspect restraint gear teeth",
    "Check adaptor rollers and bearings",
    "Listen for strange bearing noise",
    "Inspect actuate cover",
    "Tighten loose bolts",
    "Inspect motor bracket welds"
  ];
  const container = document.getElementById("checklist");
  checklist.forEach(label => {
    const div = document.createElement("div");
    div.innerHTML = `
      <label>${label}</label>
      <select class="check-item" data-label="${label}">
        <option value="OK">✅ OK</option>
        <option value="Needs Attention">⚠️ Needs Attention</option>
        <option value="Critical">❌ Critical</option>
      </select>
      <input type="text" placeholder="Notes (optional)" />
    `;
    container.appendChild(div);
  });
}
