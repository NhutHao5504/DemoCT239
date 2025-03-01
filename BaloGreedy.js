function solveGreedyKnapsack(type) {
    const capacity = parseFloat(document.getElementById('baloWeightDisplay').textContent);
    const tableRows = document.querySelectorAll('#dataTable tbody tr');
    let items = [];

    // Lấy dữ liệu từ bảng
    tableRows.forEach(row => {
        const cells = row.querySelectorAll('td');
        const name = cells[0].textContent;
        const weight = parseFloat(cells[1].textContent);
        const value = parseFloat(cells[2].textContent);
        const unitPrice = value / weight; // Đơn giá = Giá trị / Trọng lượng
        let maxQuantity = type === 'bounded' ? parseInt(cells[3].textContent) : (type === '01' ? 1 : Infinity);
        items.push({ name, weight, value, unitPrice, maxQuantity });
    });

    items = quickSort(items);
//    console.log(items);
    let remainingCapacity = capacity;
    let totalValue = 0;
    let selectedItems = [];

    // Lựa chọn đồ vật theo chiến lược tham lam
    for (let item of items) {
        if (item.weight > remainingCapacity) continue; // TL > TLbalo => bỏ qua

        let quantity = Math.min(Math.floor(remainingCapacity / item.weight), item.maxQuantity); // SL chọn

        // Lưu tt vật phẩm vào selectedItems
        if (quantity > 0) {
            selectedItems.push({
                name: item.name,
                weight: item.weight,
                value: item.value,
                unitPrice: item.unitPrice.toFixed(2),
                quantity: quantity
            });

            totalValue += quantity * item.value;
            remainingCapacity -= quantity * item.weight;
        }

        // Nếu là bài toán 0/1 thì dừng sớm nếu ba lô đầy
        if (type === '01' && remainingCapacity <= 0) break;
    }
    
    displayGreedyResult(items,selectedItems, totalValue, remainingCapacity);
}

function displayGreedyResult(items, selectedItems, totalValue, remainingCapacity) {
    // Ẩn các bảng khác
    document.getElementById('resultTableBandB').style.display = 'none';
    document.getElementById('resultTableDP').style.display = 'none';

    // Xóa dữ liệu cũ
    const resultTableBody = document.querySelector('#greedyResultTable tbody');
    resultTableBody.innerHTML = '';

    // Thêm dữ liệu mới
    items.forEach(item => {
        let selectedItem = selectedItems.find(i => i.name === item.name);
        let quantity = selectedItem ? selectedItem.quantity : 0;

        const row = document.createElement('tr');
        row.innerHTML = `<td>${item.name}</td>  
                         <td>${item.weight}</td>  
                         <td>${item.value}</td>  
                         <td>${item.unitPrice.toFixed(2)}</td>  
                         <td>${quantity}</td>`;

        resultTableBody.appendChild(row);
    });

    // Hiển thị thông tin
    document.getElementById('totalValueDisplayGreedy').textContent = `Tổng giá trị tối ưu - Tham ăn: ${totalValue}`;
    document.getElementById('remainingCapacityDisplayGreedy').textContent = `Trọng lượng còn lại của ba lô: ${remainingCapacity}`;

    // Hiển thị bảng Greedy
    document.getElementById('resultTableGreedy').style.display = 'block';
}
