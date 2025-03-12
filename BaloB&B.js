function NhanhCan(type) {
    const TLbalo = document.getElementById('baloWeightDisplay').textContent;
    const tableRows = document.querySelectorAll('#dataTable tbody tr');
    let items = [];
    let ItemsBanDau = [];

    // Lấy dữ liệu từ bảng
    tableRows.forEach(row => {
        const tenDoVat = row.cells[0].textContent;
        const TLDoVat = parseInt(row.cells[1].textContent);
        const GT = parseInt(row.cells[2].textContent);
        const donGia = GT / TLDoVat;
        const limit = parseInt(row.cells[3].textContent) || Infinity;

        let item = { tenDoVat, TLDoVat, GT, donGia, limit };
        ItemsBanDau.push(item);
        items.push({ tenDoVat, TLDoVat, GT, donGia, limit });
    });

    quickSort(items);

    function BranchBound(items, TLbalo) {
        let GLNTT = 0;
        let bestCombination = {};
        let TGT = 0;
        let V = TLbalo; // Trọng lượng còn lại

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
            //Điều kiện dừng
            if (V < 0) return;
            if (index >= items.length || V === 0) return;

            if (TGT > GLNTT) capNhatGLNTT(TGT, combination);
            const currentItem = items[index];
            let limit = 0;
            if (type === "unbounded") {
                limit = Math.floor(V / currentItem.TLDoVat); //Balo1
            } else if (type === "bounded") {
                limit = Math.min(currentItem.limit, Math.floor(V / currentItem.TLDoVat)); // Balo2
            } else if (type === "01") {
                limit = Math.min(1, Math.floor(V / currentItem.TLDoVat)); // Balo3
            }

            for (let j = limit; j >= 0; j--) {
                let newTGT = TGT + j * currentItem.GT;
                let newV = V - j * currentItem.TLDoVat;
                let newCT = newTGT + (newV > 0 ? newV * (items[index + 1]?.donGia || 0) : 0);

                if (newCT > GLNTT) {
                    let newCombination = { ...combination };    //Copy phương án cũ
                    newCombination[currentItem.tenDoVat] = j;   //Cập nhật số lượng đồ vật
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
    displayBandBResult(result, ItemsBanDau, TLConLai);
}

function displayBandBResult(result, ItemsBanDau, TLConLai) {
    // Ẩn các bảng khác
    document.getElementById('resultTableGreedy').style.display = 'none';
    document.getElementById('resultTableDP').style.display = 'none';

    // Xóa dữ liệu cũ
    const resultTableBody = document.querySelector('#bandBResultTable tbody');
    resultTableBody.innerHTML = '';

    // Thêm dữ liệu mới
    ItemsBanDau.forEach(item => {
        let quantity = result.bestCombination[item.tenDoVat] || 0;

        const row = document.createElement('tr');
        row.innerHTML = `<td>${item.tenDoVat}</td>  
                         <td>${item.TLDoVat}</td>  
                         <td>${item.GT}</td>  
                         <td>${item.donGia.toFixed(2)}</td>  
                         <td>${quantity}</td>`;

        resultTableBody.appendChild(row);
    });

    // Hiển thị thông tin
    document.getElementById('totalValueDisplayBandB').innerText = `Tổng giá trị tối ưu - Nhánh Cận: ${result.maxValue}`;
    document.getElementById('remainingCapacityDisplayBandB').innerText = `Trọng lượng còn lại của ba lô: ${TLConLai}`;

    // Hiển thị bảng BandB
    document.getElementById('resultTableBandB').style.display = 'block';
}
 