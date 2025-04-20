function findPivot(arr, i, j) {
    let firstKey = arr[i].donGia;
    for (let k = i + 1; k <= j; k++) {
        if (arr[k].donGia !== firstKey) {
            return arr[k].donGia > firstKey ? k : i;
        }
    }
    return i; // Nếu cùng đơn giá, trả về chỉ số đầu tiên
}

function partition(arr, i, j, pivot) {
    let L = i, R = j;
    while (L <= R) {  
        while (L <= j && arr[L].donGia > pivot) L++;  
        while (R >= i && arr[R].donGia < pivot) R--;  
        if (L <= R) {
            [arr[L], arr[R]] = [arr[R], arr[L]]; // Hoán đổi phần tử
            L++;
            R--;
        }
    }
    return L;
}

function quickSort(arr, i = 0, j = arr.length - 1) {
    if (i >= j) return;

    let pivotIndex = findPivot(arr, i, j);
    let pivot = arr[pivotIndex].donGia;
    
    let k = partition(arr, i, j, pivot);

    if (i < k - 1) quickSort(arr, i, k - 1);
    if (k < j) quickSort(arr, k, j);
}


let duLieuGoc = []; 
let isSorted = false;

function sapXepDonGiaGiam() {
    const tableRows = document.querySelectorAll("#dataTable tbody tr");
    let items = [];

    const isBalo2 = document.querySelector("#dataTable thead tr").children.length === 5;

    if (duLieuGoc.length === 0) {
        tableRows.forEach(row => {
            const cells = row.querySelectorAll("td");
            const ten = cells[0].textContent;
            const trongLuong = parseFloat(cells[1].textContent);
            const giaTri = parseFloat(cells[2].textContent);
            const donGia = giaTri / trongLuong;
            const soLuong = isBalo2 ? parseInt(cells[3].textContent) : null;
            duLieuGoc.push({ ten, trongLuong, giaTri, soLuong, donGia });
        });
    }

    if (isSorted) {
        items = [...duLieuGoc]; // Khôi phục lại thứ tự ban đầu
        isSorted = false;
    } else {
        items = [...duLieuGoc.map(item => ({ ...item }))]; // Sao chép dữ liệu
        quickSort(items);
        isSorted = true;
    }

    // Cập nhật bảng sau khi sắp xếp
    const tbody = document.querySelector("#dataTable tbody");
    tbody.innerHTML = "";

    items.forEach(item => {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${item.ten}</td>
            <td>${item.trongLuong}</td>
            <td>${item.giaTri}</td>
            ${isBalo2 ? `<td>${item.soLuong}</td>` : ""}
            <td>${item.donGia.toFixed(2)}</td>
        `;
        tbody.appendChild(row);
    });
}
