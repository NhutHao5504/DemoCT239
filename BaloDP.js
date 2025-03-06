function QuyHoachDong(type) {
    const TLbalo = document.getElementById('baloWeightDisplay').textContent;
    const tableRows = document.querySelectorAll('#dataTable tbody tr');
    if (!TLbalo || isNaN(TLbalo) || parseInt(TLbalo) <= 0) {
        alert("Vui lòng nhập trọng lượng ba lô hợp lệ (số nguyên dương).");
        return;
    }
 
    let items = [];
    //Lấy dữ liệu từ bảng
    tableRows.forEach(row => {
        const tenDoVat = row.cells[0].innerText;
        const TLDoVat = parseInt(row.cells[1].innerText);
        const giaTri = parseInt(row.cells[2].innerText);
        const limit = row.cells[3] ? parseInt(row.cells[3].innerText) : Infinity;
        items.push({ tenDoVat, TLDoVat, giaTri, limit, selectedQuantity: 0 });
    });

    let n = items.length;
    const W = parseInt(TLbalo);
    let F = [];
    let X = [];
    for (let i = 0; i < n; i++) {
        F[i] = [];
        X[i] = [];
        for (let j = 0; j <= W; j++) {
            F[i][j] = 0;
            X[i][j] = 0;
        }
    }

    function createTable() {
        for (let V = 0; V <= W; V++) {
            if (type === "01") {
                X[0][V] = (V >= items[0].TLDoVat) ? 1 : 0;
            } else {
                X[0][V] = Math.min(Math.floor(V / items[0].TLDoVat), type === "bounded" ? items[0].limit : Infinity);
            }
            F[0][V] = X[0][V] * items[0].giaTri;
        }

        for (let k = 1; k < n; k++) {
            for (let V = 0; V <= W; V++) {
                let Fmax = F[k - 1][V];
                let Xmax = 0;

                let maxQuantity = (type === "01") ? Math.min(1, Math.floor(V / items[k].TLDoVat))
                    : (type === "bounded") ? Math.min(items[k].limit, Math.floor(V / items[k].TLDoVat))
                        : Math.floor(V / items[k].TLDoVat);

                for (let xk = 0; xk <= maxQuantity; xk++) {
                    let TLConLai = V - xk * items[k].TLDoVat;
                    if (TLConLai >= 0) {
                        let newValue = F[k - 1][TLConLai] + xk * items[k].giaTri;
                        if (newValue > Fmax) {
                            Fmax = newValue;
                            Xmax = xk;
                        }
                    }
                }
                F[k][V] = Fmax;
                X[k][V] = Xmax;
                console.log(X);
            }
        }
    }

    function traceTable() {
        let V = W;
        for (let k = n - 1; k >= 0; k--) {
            items[k].selectedQuantity = X[k][V];
            V -= items[k].selectedQuantity * items[k].TLDoVat;
        }
        return V;
    }

    createTable();
    let TLConLai = traceTable();
    let totalValue = F[n - 1][W];

    displayDPResult(items, totalValue, TLConLai);
}

function displayDPResult(items, totalValue, TLConLai) {
    document.getElementById('resultTableGreedy').style.display = 'none';
    document.getElementById('resultTableBandB').style.display = 'none';

    const resultTableBody = document.querySelector('#dpResultTable tbody');
    resultTableBody.innerHTML = '';

    items.forEach(item => {
        const row = document.createElement('tr');
        row.innerHTML = `<td>${item.tenDoVat}</td>  
                         <td>${item.TLDoVat}</td>  
                         <td>${item.giaTri}</td>  
                         <td>${(item.giaTri / item.TLDoVat).toFixed(2)}</td>  
                         <td>${item.selectedQuantity}</td>`;
        resultTableBody.appendChild(row);
    });

    document.getElementById('totalValueDisplayDP').innerText = `Tổng giá trị tối ưu - Quy hoạch động: ${totalValue}`;
    document.getElementById('remainingCapacityDisplayDP').innerText = `Trọng lượng còn lại của ba lô: ${TLConLai}`;
    document.getElementById('resultTableDP').style.display = 'block';
}

// function displayKnapsackResult(algorithm, originalItems, selectedItems, totalValue, remainingWeight) {
//     // Ẩn tất cả các bảng trước khi hiển thị bảng kết quả của thuật toán được chọn
//     document.getElementById('resultTableGreedy').style.display = 'none';
//     document.getElementById('resultTableBandB').style.display = 'none';
//     document.getElementById('resultTableDP').style.display = 'none';

//     // Xác định bảng nào sẽ hiển thị
//     let resultTableBody, totalValueDisplay, remainingCapacityDisplay;
//     switch (algorithm) {
//         case 'greedy':
//             resultTableBody = document.querySelector('#greedyResultTable tbody');
//             totalValueDisplay = document.getElementById('totalValueDisplayGreedy');
//             remainingCapacityDisplay = document.getElementById('remainingCapacityDisplayGreedy');
//             document.getElementById('resultTableGreedy').style.display = 'block';
//             break;
//         case 'bandb':
//             resultTableBody = document.querySelector('#bandBResultTable tbody');
//             totalValueDisplay = document.getElementById('totalValueDisplayBandB');
//             remainingCapacityDisplay = document.getElementById('remainingCapacityDisplayBandB');
//             document.getElementById('resultTableBandB').style.display = 'block';
//             break;
//         case 'dp':
//             resultTableBody = document.querySelector('#dpResultTable tbody');
//             totalValueDisplay = document.getElementById('totalValueDisplayDP');
//             remainingCapacityDisplay = document.getElementById('remainingCapacityDisplayDP');
//             document.getElementById('resultTableDP').style.display = 'block';
//             break;
//         default:
//             console.error("Thuật toán không hợp lệ");
//             return;
//     }

//     // Xóa dữ liệu cũ trong bảng
//     resultTableBody.innerHTML = '';

//     // Duyệt danh sách và hiển thị dữ liệu
//     originalItems.forEach(item => {
//         let selectedItem = selectedItems.find(i => i.name === item.name);
//         let quantity = selectedItem ? selectedItem.quantity || selectedItem.selectedQuantity || 0 : 0;

//         const row = document.createElement('tr');
//         row.innerHTML = `<td>${item.name}</td>
//                          <td>${item.weight}</td>
//                          <td>${item.value}</td>
//                          <td>${(item.value / item.weight).toFixed(2)}</td>
//                          <td>${quantity}</td>`;
//         resultTableBody.appendChild(row);
//     });

//     // Cập nhật giá trị tổng và trọng lượng còn lại
//     totalValueDisplay.textContent = `Tổng giá trị tối ưu (${algorithm.toUpperCase()}): ${totalValue}`;
//     remainingCapacityDisplay.textContent = `Trọng lượng còn lại của ba lô (${algorithm.toUpperCase()}): ${remainingWeight}`;
// }

// displayKnapsackResult('greedy', originalItems, selectedItems, totalValue, remainingCapacity);
// displayKnapsackResult('bandb', items, result.bestCombination, result.maxValue, remainingWeight);
// displayKnapsackResult('dp', items, selectedItems, totalValue, remainingWeight);
