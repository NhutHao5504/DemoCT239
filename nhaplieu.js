//Ẩn phần nhập dữ liệu giữa "file" và "manual":
function toggleInputMethod(method) {
    if (method === 'file') {
        const fileInput = document.getElementById('fileInput');
        fileInput.click(); // Tự động mở cửa sổ chọn tệp
    }
    document.getElementById('fileInputSection').style.display = method === 'file' ? 'block' : 'none';
    document.getElementById('manualInputSection').style.display = method === 'manual' ? 'block' : 'none';
}

//Hàm xử lý đọc và upload file
// function handleFileUpload(event) {
//     const file = event.target.files[0];
//     if (!file) return;

//     const reader = new FileReader(); //Khởi tạo API đọc tệp
//     //Xử lý tệp đã đọc xong:
//     reader.onload = function(e) {
//         const lines = e.target.result.split('\n').map(line => line.trim());
//         const tbody = document.querySelector('#dataTable tbody');
//         tbody.innerHTML = '';

//         if (lines.length > 0) {
//             document.getElementById('baloWeightDisplay').textContent = lines[0];
//         }

//         lines.slice(1).forEach(line => {    //Đọc mảng đồ vật, bỏ qua dòng đầu baloweight
//             const parts = line.split(',');
//             // Trường hợp balo2 có cột số lượng
//             if (currentPage === 'knapsack2.html' && parts.length === 4) {
//                 const [name, weight, value, quantity] = parts;
//                 const donGia = (parseFloat(value) / parseFloat(weight)).toFixed(2);
//                 const row = `<tr><td>${name}</td><td>${weight}</td><td>${value}</td><td>${quantity}</td><td>${donGia}</td></tr>`;
//                 tbody.innerHTML += row;
//             } else if (parts.length === 3) {
//             // Trường hợp balo1, balo3
//                 const [name, weight, value] = parts;
//                 const donGia = (parseFloat(value) / parseFloat(weight)).toFixed(2);
//                 const row = `<tr><td>${name}</td><td>${weight}</td><td>${value}</td><td>${donGia}</td></tr>`;
//                 tbody.innerHTML += row;
//             }
//         });
//         // Hiển thị bảng sau khi tải xong
//         document.getElementById('dataTable').style.display = 'table';
//         document.getElementById('knapsackButton').style.display = 'block';
//         document.getElementById('greedyResultTable').style.display = 'table';
//     };
    
//     reader.readAsText(file);
// }

function handleFileUpload(event) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function(e) {
        const lines = e.target.result.split('\n').map(line => line.trim());
        const tbody = document.querySelector('#dataTable tbody');
        tbody.innerHTML = '';

        if (lines.length > 0) {
            document.getElementById('baloWeightDisplay').textContent = lines[0]; // Trọng lượng balo
        }

        // Xác định loại Knapsack dựa vào số cột trong dòng dữ liệu đầu tiên
        const firstDataRow = lines[1]?.split(',').map(item => item.trim()); // Dòng dữ liệu đầu tiên (bỏ qua baloWeight)
        if (!firstDataRow) return; // Nếu không có dữ liệu, thoát luôn

        let isCBL2 = firstDataRow.length === 4; // Nếu có 4 cột thì là CBL2

        // Cập nhật tiêu đề bảng
        const tableHead = document.querySelector('#dataTable thead tr');
        if (isCBL2) {
            tableHead.innerHTML = `<th>Tên Đồ Vật</th><th>Trọng Lượng</th><th>Giá Trị</th><th>Số Lượng</th><th>Đơn Giá</th>`;
        } else {
            tableHead.innerHTML = `<th>Tên Đồ Vật</th><th>Trọng Lượng</th><th>Giá Trị</th><th>Đơn Giá</th>`;
        }

        // Đọc và hiển thị dữ liệu trong bảng
        lines.slice(1).forEach(line => {
            const parts = line.split(',').map(item => item.trim());
            let row = '';

            if (isCBL2 && parts.length === 4) {
                // Trường hợp CBL2 (Có số lượng)
                const [name, weight, value, quantity] = parts;
                const donGia = (parseFloat(value) / parseFloat(weight)).toFixed(2);
                row = `<tr><td>${name}</td><td>${weight}</td><td>${value}</td><td>${quantity}</td><td>${donGia}</td></tr>`;
            } else if (!isCBL2 && parts.length === 3) {
                // Trường hợp CBL1 & CBL3 (Không có số lượng)
                const [name, weight, value] = parts;
                const donGia = (parseFloat(value) / parseFloat(weight)).toFixed(2);
                row = `<tr><td>${name}</td><td>${weight}</td><td>${value}</td><td>${donGia}</td></tr>`;
            } else {
                console.warn("Dữ liệu nhập vào không hợp lệ:", line);
            }

            if (row) tbody.innerHTML += row;
        });

        document.getElementById('dataTable').style.display = 'table';
    };

    reader.readAsText(file);
}


// Xác định trang hiện tại để thêm cột số lượng (Balo2):
const currentPage = window.location.pathname.split('/').pop();
// Cập nhật tiêu đề bảng (Thêm cột số lượng đồ vật -> Balo2):
function updateTableHeader() {
    const tableHead = document.querySelector('#dataTable thead tr');
    if (currentPage === 'knapsack2.html') {
        tableHead.innerHTML = `<th>Tên Đồ Vật</th><th>Trọng Lượng</th><th>Giá Trị</th><th>Số Lượng</th><th>Đơn Giá</th>`;
    } else {
        tableHead.innerHTML = `<th>Tên Đồ Vật</th><th>Trọng Lượng</th><th>Giá Trị</th><th>Đơn Giá</th>`;
    }
}
updateTableHeader();

//Thêm danh sách đồ vật thủ công
function addItem() {
    const name = document.getElementById('nameInput').value;
    const weight = document.getElementById('weightInput').value;
    const value = document.getElementById('valueInput').value;
    const baloWeight = document.getElementById('baloInput').value;

    if (baloWeight) {
        document.getElementById('baloWeightDisplay').textContent = baloWeight;
    }
    //Khởi tạo dữ liệu cho bảng
    const tbody = document.querySelector('#dataTable tbody');
    let row = '';

    if (name && weight && value) {
        const donGia = (parseFloat(value) / parseFloat(weight)).toFixed(2);

        if (currentPage === 'knapsack2.html') {
            const quantity = document.getElementById('quantityInput').value;
            if (quantity) {
                row = `<tr><td>${name}</td><td>${weight}</td><td>${value}</td><td>${quantity}</td><td>${donGia}</td></tr>`;
            }
        } else {
            row = `<tr><td>${name}</td><td>${weight}</td><td>${value}</td><td>${donGia}</td></tr>`;
        }
    }
    //Thêm hàng dữ liệu vào bảng và reset lại ô input
    if (row) {
        tbody.innerHTML += row;
        document.getElementById('nameInput').value = '';
        document.getElementById('weightInput').value = '';
        document.getElementById('valueInput').value = '';

        if (currentPage === 'knapsack2.html') {
            document.getElementById('quantityInput').value = '';
        }
    }
    document.getElementById('dataTable').style.display = 'table';
    document.getElementById('knapsackButton').style.display = 'block';
    document.getElementById('greedyResultTable').style.display = 'table';
}

function hideManualInput() {
    document.getElementById('manualInputSection').style.display = 'none';
}
