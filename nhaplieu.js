//Ẩn phần nhập dữ liệu giữa "file" và "manual":
function chuyenDoiNhapLieu(method) {
    if (method === 'file') {
        const fileInput = document.getElementById('fileInput');
        fileInput.click();
    }
    document.getElementById('fileInputSection').style.display = method === 'file' ? 'block' : 'none';
    document.getElementById('manualInputSection').style.display = method === 'manual' ? 'block' : 'none';
}

function upLoadFile(event) {
    const file = event.target.files[0]; //Chọn file đầu tiên
    if (!file) return;

    //Tạo API đọc file
    const reader = new FileReader();
    reader.onload = function(e) {
        const lines = e.target.result.split('\n').map(line => line.trim());
        const tbody = document.querySelector('#dataTable tbody');
        tbody.innerHTML = '';

        if (lines.length > 0) {
            document.getElementById('baloWeightDisplay').textContent = lines[0];
        }
        //Xác định loại ba lô từ file
        const firstDataRow = lines[1]?.split(',').map(item => item.trim());
        if (!firstDataRow) return;
        let isCBL2 = firstDataRow.length === 4;
        
        const tableHead = document.querySelector('#dataTable thead tr');
        if (isCBL2) {
            tableHead.innerHTML = `<th>Tên Đồ Vật</th>
                                    <th>Trọng Lượng</th>
                                    <th>Giá Trị</th>
                                    <th>Số Lượng</th>
                                    <th>Đơn Giá</th>`;
        } else {
            tableHead.innerHTML = `<th>Tên Đồ Vật</th>
                                    <th>Trọng Lượng</th>
                                    <th>Giá Trị</th>
                                    <th>Đơn Giá</th>`;
        }
        // Đọc và hiển thị dữ liệu trong bảng
        lines.slice(1).forEach(line => {
            const parts = line.split(',').map(item => item.trim());
            let row = '';

            if (isCBL2 && parts.length === 4) {
                const [ten, trongLuong, giaTri, soLuong] = parts;
                const donGia = (parseFloat(giaTri) / parseFloat(trongLuong)).toFixed(2);
                row = `<tr>
                            <td>${ten}</td>
                            <td>${trongLuong}</td>
                            <td>${giaTri}</td>
                            <td>${soLuong}</td>
                            <td>${donGia}</td>
                        </tr>`;
            } else if (!isCBL2 && parts.length === 3) {
                const [ten, trongLuong, giaTri] = parts;
                const donGia = (parseFloat(giaTri) / parseFloat(trongLuong)).toFixed(2);
                row = `<tr>
                            <td>${ten}</td>
                            <td>${trongLuong}</td>
                            <td>${giaTri}</td>
                            <td>${donGia}</td>
                        </tr>`;
            } else {
                console.warn("Dữ liệu nhập vào không hợp lệ:", line);
            }
            if (row) tbody.innerHTML += row;
        });
        document.getElementById('dataTable').style.display = 'table';
    };
    reader.readAsText(file);
    showBaloWeight();
}

//Thêm danh sách đồ vật thủ công
const currentPage = window.location.pathname.split('/').pop();
function updateTableHeader() {
    const tableHead = document.querySelector('#dataTable thead tr');
    if (currentPage === 'knapsack2.html') {
        tableHead.innerHTML = `<th>Tên Đồ Vật</th>
                                <th>Trọng Lượng</th>
                                <th>Giá Trị</th>
                                <th>Số Lượng</th>
                                <th>Đơn Giá</th>`;
    } else {
        tableHead.innerHTML = `<th>Tên Đồ Vật</th>
                                <th>Trọng Lượng</th>
                                <th>Giá Trị</th>
                                <th>Đơn Giá</th>`;
    }
}
updateTableHeader();
function addItem() {
    const ten = document.getElementById('nameInput').value;
    const trongLuong = document.getElementById('weightInput').value;
    const giaTri = document.getElementById('valueInput').value;
    const TLBalo = document.getElementById('baloInput').value;

    if (TLBalo) {
        document.getElementById('baloWeightDisplay').textContent = TLBalo;
        showBaloWeight();
    }
    //Khởi tạo dữ liệu cho bảng
    const tbody = document.querySelector('#dataTable tbody');
    let row = '';

    if (ten && trongLuong && giaTri) {
        const donGia = (parseFloat(giaTri) / parseFloat(trongLuong)).toFixed(2);

        if (currentPage === 'knapsack2.html') {
            const soLuong = document.getElementById('quantityInput').value;
            if (soLuong) {
                row = `<tr>
                            <td>${ten}</td>
                            <td>${trongLuong}</td>
                            <td>${giaTri}</td>
                            <td>${soLuong}</td>
                            <td>${donGia}</td>
                        </tr>`;
            }
        } else {
            row = `<tr>
                        <td>${ten}</td>
                        <td>${trongLuong}</td>
                        <td>${giaTri}</td>
                        <td>${donGia}</td>
                    </tr>`;
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
//Ẩn bảng nhập khi hoàn thành
function hideManualInput() {
    document.getElementById('manualInputSection').style.display = 'none';
}
