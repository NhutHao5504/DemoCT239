function solveKnapsackBandB(type) {
    const baloWeight = document.getElementById('baloWeightDisplay').textContent;
    let items = [];

    // Lấy dữ liệu từ bảng
    const rows = document.querySelectorAll('#dataTable tbody tr');
    rows.forEach(row => {
        const name = row.cells[0].textContent;
        const weight = parseInt(row.cells[1].textContent);
        const value = parseInt(row.cells[2].textContent);
        const unitPrice = value / weight;
        const limit = parseInt(row.cells[3].textContent) || Infinity;

        items.push({ name, weight, value, unitPrice, limit });
    });

    items = quickSort(items); // Sắp xếp theo đơn giá giảm dần

    function knapsackBranchBound(items, capacity) {
        let GLNTT = 0;
        let bestCombination = {};
        let TGT = 0;
        let V = capacity; // Trọng lượng còn lại

        function initializeRootNode() {
            TGT = 0;
            V = capacity;
            GLNTT = 0;
        }

        function updateBestSolution(TGT, combination) {
            if (TGT > GLNTT) {
                GLNTT = TGT;
                bestCombination = { ...combination };
            }
        }

        function branchAndBound(index, TGT, CT, V, combination) {
            if (V < 0) return;
            if (TGT > GLNTT) updateBestSolution(TGT, combination);
            if (index >= items.length || V === 0) return;

            const currentItem = items[index];
            let limit = 0;
            if (type === "unbounded") {
                limit = Math.floor(V / currentItem.weight); //Balo1
            } else if (type === "bounded") {
                limit = Math.min(currentItem.limit, Math.floor(V / currentItem.weight)); // Balo2
            } else if (type === "01") {
                limit = Math.min(1, Math.floor(V / currentItem.weight)); // Balo3
            }

            for (let j = limit; j >= 0; j--) {
                let newTGT = TGT + j * currentItem.value;
                let newV = V - j * currentItem.weight;
                let newCT = newTGT + (newV > 0 ? newV * (items[index + 1]?.unitPrice || 0) : 0);

                if (newCT > GLNTT) {
                    let newCombination = { ...combination };
                    newCombination[currentItem.name] = j;
                    if (index === items.length - 1 || newV === 0) {
                        updateBestSolution(newTGT, newCombination);
                    } else {
                        branchAndBound(index + 1, newTGT, newCT, newV, newCombination);
                    }
                }
            }
        }

        initializeRootNode();
        branchAndBound(0, TGT, 0, V, {});
        return { maxValue: GLNTT, bestCombination };
    }

    const result = knapsackBranchBound(items, baloWeight);
    let usedWeight = 0;
    for (const item of items) {
        if (result.bestCombination[item.name]) {
        usedWeight += result.bestCombination[item.name] * item.weight;
        }
    }
    let remainingWeight = baloWeight - usedWeight;
    displayBandBResult(result, items, baloWeight, remainingWeight);
}

function displayBandBResult(result, items, baloWeight, remainingWeight) {
    // Ẩn các bảng khác
    document.getElementById('resultTableGreedy').style.display = 'none';
    document.getElementById('resultTableDP').style.display = 'none';

    // Xóa dữ liệu cũ
    const resultTableBody = document.querySelector('#bandBResultTable tbody');
    resultTableBody.innerHTML = '';

    // Thêm dữ liệu mới
    items.forEach(item => {
        let quantity = result.bestCombination[item.name] || 0;

        const row = document.createElement('tr');
        row.innerHTML = `<td>${item.name}</td>  
                         <td>${item.weight}</td>  
                         <td>${item.value}</td>  
                         <td>${item.unitPrice.toFixed(2)}</td>  
                         <td>${quantity}</td>`;

        resultTableBody.appendChild(row);
    });

    // Hiển thị thông tin
    document.getElementById('totalValueDisplayBandB').innerText = `Tổng giá trị tối ưu Nhánh Cận: ${result.maxValue}`;
    document.getElementById('remainingCapacityDisplayBandB').innerText = `Trọng lượng còn lại của ba lô Nhánh Cận: ${remainingWeight}`;

    // Hiển thị bảng BandB
    document.getElementById('resultTableBandB').style.display = 'block';
}
