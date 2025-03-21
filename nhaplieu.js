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
    const file = event.target.files[0]; // Chọn file đầu tiên
    if (!file) return;
    const errorDisplay = document.getElementById('errorDisplay');
    errorDisplay.innerHTML = ''; // Xóa thông báo lỗi cũ

    // Kiểm tra định dạng file
    const validExtensions = ['text/plain'];
    if (!validExtensions.includes(file.type)) {
        errorDisplay.innerHTML = `<p style="color: red;">Lỗi: Định dạng file không hợp lệ! Chỉ chấp nhận file .txt.</p>`;
        return;
    }

    // Tạo API đọc file
    const reader = new FileReader();
    reader.onload = function(e) {
        const lines = e.target.result.split('\n').map(line => line.trim());
        if (lines.length === 0 || lines[0] === '') {
            errorDisplay.innerHTML = `<p style="color: red;">Lỗi: File không có dữ liệu!</p>`;
            return;
        }

        const tbody = document.querySelector('#dataTable tbody');
        tbody.innerHTML = '';

        if (lines.length > 0) {
            document.getElementById('baloWeightDisplay').textContent = lines[0];
        }

        // Xác định loại ba lô từ file
        const firstDataRow = lines[1]?.split(',').map(item => item.trim());
        if (!firstDataRow) {
            errorDisplay.innerHTML = `<p style="color: red;">Lỗi: Dữ liệu không hợp lệ! Hãy kiểm tra nội dung file.</p>`;
            return;
        }

        let isCBL2 = firstDataRow.length === 4;
        const tableHead = document.querySelector('#dataTable thead tr');

        if (isCBL2) {
            tableHead.innerHTML = `<th>Tên Đồ Vật</th>
                                   <th>Trọng Lượng</th>
                                   <th>Giá Trị</th>
                                   <th>Số Lượng</th>
                                   <th>Đơn Giá</th>`;
        } else if (firstDataRow.length === 3) {
            tableHead.innerHTML = `<th>Tên Đồ Vật</th>
                                   <th>Trọng Lượng</th>
                                   <th>Giá Trị</th>
                                   <th>Đơn Giá</th>`;
        } else {
            errorDisplay.innerHTML = `<p style="color: red;">Lỗi: Định dạng dữ liệu không đúng!</p>`;
            return;
        }

        let hasError = false; // Biến kiểm soát lỗi trong dữ liệu

        // Đọc và hiển thị dữ liệu trong bảng
        lines.slice(1).forEach((line, index) => {
            const parts = line.split(',').map(item => item.trim());
            let row = '';

            if (isCBL2 && parts.length === 4) {
                const [ten, trongLuong, giaTri, soLuong] = parts;
                if (isNaN(trongLuong) || isNaN(giaTri) || isNaN(soLuong)) {
                    hasError = true;
                    errorDisplay.innerHTML += `<p style="color: red;">Lỗi tại dòng ${index + 2}: Dữ liệu không hợp lệ! (${line})</p>`;
                    return;
                }
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
                if (isNaN(trongLuong) || isNaN(giaTri)) {
                    hasError = true;
                    errorDisplay.innerHTML += `<p style="color: red;">Lỗi tại dòng ${index + 2}: Dữ liệu không hợp lệ! (${line})</p>`;
                    return;
                }
                const donGia = (parseFloat(giaTri) / parseFloat(trongLuong)).toFixed(2);
                row = `<tr>
                            <td>${ten}</td>
                            <td>${trongLuong}</td>
                            <td>${giaTri}</td>
                            <td>${donGia}</td>
                        </tr>`;
            } else {
                hasError = true;
                errorDisplay.innerHTML += `<p style="color: red;">Lỗi tại dòng ${index + 2}: Định dạng dòng không hợp lệ! (${line})</p>`;
                return;
            }

            tbody.innerHTML += row;
        });

        // Nếu có lỗi trong dữ liệu, ẩn bảng kết quả
        if (hasError) {
            document.getElementById('dataTable').style.display = 'none';
        } else {
            showBaloWeight();
            document.getElementById('dataTable').style.display = 'table';
        }
    };
    reader.readAsText(file);
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
