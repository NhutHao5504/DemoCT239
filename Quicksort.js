function quickSort(items) {
    if (items.length <= 1) return items;

    const pivot = items[items.length - 1]; // Chọn phần tử cuối làm pivot
    const left = [], right = [];

    for (let i = 0; i < items.length - 1; i++) {
        if (items[i].donGia >= pivot.donGia) {
            left.push(items[i]); // Đơn giá cao hơn hoặc bằng thì đưa vào nhóm bên trái
        } else {
            right.push(items[i]); // Đơn giá thấp hơn thì đưa vào nhóm bên phải
        }
    }

    return [...quickSort(left), pivot, ...quickSort(right)]; // Kết hợp kết quả
}
let originalOrder = []; // Lưu trạng thái ban đầu
let isSorted = false;   // Biến kiểm tra trạng thái

function sortByUnitPrice() {
    const tableRows = document.querySelectorAll("#dataTable tbody tr");
    let items = [];

    // Kiểm tra có phải knapsack2.html không (dựa vào số lượng cột bảng)
    const isKnapsack2 = document.querySelector("#dataTable thead tr").children.length === 5;

    // Nếu chưa lưu trạng thái ban đầu, thì lưu lại
    if (originalOrder.length === 0) {
        tableRows.forEach(row => {
            const cells = row.querySelectorAll("td");
            const name = cells[0].textContent;
            const weight = parseFloat(cells[1].textContent);
            const value = parseFloat(cells[2].textContent);
            const unitPrice = value / weight;
            const quantity = isKnapsack2 ? parseInt(cells[3].textContent) : null;

            originalOrder.push({ name, weight, value, quantity, unitPrice });
        });
    }

    // Nếu đang ở trạng thái sắp xếp, thì khôi phục thứ tự ban đầu
    if (isSorted) {
        items = [...originalOrder]; // Khôi phục dữ liệu gốc
        isSorted = false;
    } else {
        items = quickSort([...originalOrder]); // Sắp xếp theo đơn giá giảm dần
        isSorted = true;
    }

    // Cập nhật lại bảng
    const tbody = document.querySelector("#dataTable tbody");
    tbody.innerHTML = ""; // Xóa dữ liệu cũ

    items.forEach(item => {
        let row = `<tr>
                        <td>${item.name}</td>
                        <td>${item.weight}</td>
                        <td>${item.value}</td>`;

        if (isKnapsack2) {
            row += `<td>${item.quantity}</td>`;
        }

        row += `<td>${item.unitPrice.toFixed(2)}</td>
                </tr>`;

        tbody.innerHTML += row;
    });
}
