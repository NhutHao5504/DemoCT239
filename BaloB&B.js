function NhanhCan(type) {
    const TLbalo = parseFloat(document.getElementById('baloWeightDisplay').textContent);
    const tableRows = document.querySelectorAll('#dataTable tbody tr');
    let items = [];
    let ItemsBanDau = [];
    let hasSoLuongColumn = tableRows[0].cells.length > 4; // Kiểm tra nếu có cột "Số Lượng"

    // Lấy dữ liệu từ bảng
    tableRows.forEach(row => {
        const cells = row.cells;
        const tenDoVat = cells[0].textContent;
        const TLDoVat = parseFloat(cells[1].textContent);
        const GT = parseFloat(cells[2].textContent);
        const donGia = GT / TLDoVat;
        const soLuongNhap = hasSoLuongColumn ? parseInt(cells[3].textContent) : null;
        const limit = type === "bounded" ? soLuongNhap : (type === "01" ? 1 : Infinity);

        let item = { tenDoVat, TLDoVat, GT, donGia, soLuongNhap, limit };
        ItemsBanDau.push(item);
        items.push({ ...item });
    });

    quickSort(items);

    function BranchBound(items, TLbalo) {
        let GLNTT = 0;
        let bestCombination = {};
        let TGT = 0;
        let V = TLbalo;
 
        function taoNutGoc() {
            TGT = 0;
            V = TLbalo;
            GLNTT = 0;
        }

        function capNhatGLNTT(TGT, combination) {
            if (TGT > GLNTT) {
                GLNTT = TGT;
                bestCombination = { ...combination };
            }
        }

        function BranchBoundDeQuy(index, TGT, CT, V, combination) {
            if (V < 0) return;
            if (index >= items.length || V === 0) return;

            if (TGT > GLNTT) capNhatGLNTT(TGT, combination);
            const currentItem = items[index];
            let limit = Math.min(currentItem.limit, Math.floor(V / currentItem.TLDoVat));

            for (let j = limit; j >= 0; j--) {
                let newTGT = TGT + j * currentItem.GT;
                let newV = V - j * currentItem.TLDoVat;
                let newCT = newTGT + (newV > 0 ? newV * (items[index + 1]?.donGia || 0) : 0);

                if (newCT > GLNTT) {
                    let newCombination = { ...combination };
                    newCombination[currentItem.tenDoVat] = j;
                    if (index === items.length - 1 || newV === 0) {
                        capNhatGLNTT(newTGT, newCombination);
                    } else {
                        BranchBoundDeQuy(index + 1, newTGT, newCT, newV, newCombination);
                    }
                }
            }
        }

        taoNutGoc();
        BranchBoundDeQuy(0, TGT, 0, V, {});
        return { maxValue: GLNTT, bestCombination };
    }

    const result = BranchBound(items, TLbalo);
    let TLUsed = 0;
    for (const item of items) {
        if (result.bestCombination[item.tenDoVat]) {
            TLUsed += result.bestCombination[item.tenDoVat] * item.TLDoVat;
        }
    }
    let TLConLai = TLbalo - TLUsed;
    displayBandBResult(result, ItemsBanDau, TLConLai, hasSoLuongColumn);
}

function displayBandBResult(result, ItemsBanDau, TLConLai, hasSoLuongColumn) {
    document.getElementById('resultTableGreedy').style.display = 'none';
    document.getElementById('resultTableDP').style.display = 'none';

    const resultTableHead = document.querySelector('#bandBResultTable thead tr');
    const resultTableBody = document.querySelector('#bandBResultTable tbody');

    resultTableBody.innerHTML = '';
    resultTableHead.innerHTML = '';

    // Xây dựng header của bảng kết quả
    let headerHTML = `<th>Tên Đồ Vật</th>
                      <th>Trọng Lượng</th>
                      <th>Giá Trị</th>
                      <th>Đơn Giá</th>`;
    if (hasSoLuongColumn) headerHTML += `<th>Số Lượng</th>`;
    headerHTML += `<th>Phương Án</th>`;

    resultTableHead.innerHTML = headerHTML;

    // Xây dựng dữ liệu trong bảng kết quả
    ItemsBanDau.forEach(item => {
        let selectedItem = result.bestCombination[item.tenDoVat] || 0;

        let rowHTML = `<td>${item.tenDoVat}</td>  
                       <td>${item.TLDoVat}</td>  
                       <td>${item.GT}</td>  
                       <td>${item.donGia.toFixed(2)}</td>`;
        if (hasSoLuongColumn && item.soLuongNhap !== null) rowHTML += `<td>${item.soLuongNhap}</td>`;
        rowHTML += `<td>${selectedItem}</td>`;

        const row = document.createElement('tr');
        row.innerHTML = rowHTML;
        resultTableBody.appendChild(row);
    });

    document.getElementById('totalValueDisplayBandB').textContent = `Tổng giá trị tối ưu - Nhánh Cận: ${result.maxValue}`;
    document.getElementById('remainingCapacityDisplayBandB').textContent = `Trọng lượng còn lại của ba lô: ${TLConLai}`;
    document.getElementById('resultTableBandB').style.display = 'block';
}
