function QuyHoachDong(type) {
    const TLbalo = document.getElementById('baloWeightDisplay').textContent;
    const tableRows = document.querySelectorAll('#dataTable tbody tr');

    let items = [];
    let ItemsBanDau = [];
    let hasSoLuongColumn = tableRows[0].cells.length > 4;

    // Lấy dữ liệu từ bảng
    tableRows.forEach(row => {
        const tenDoVat = row.cells[0].textContent;
        const TLDoVat = parseInt(row.cells[1].textContent);
        const giaTri = parseInt(row.cells[2].textContent);
        const soLuongNhap = hasSoLuongColumn ? parseInt(row.cells[3].textContent) : null;
        const limit = hasSoLuongColumn ? soLuongNhap : Infinity;
        let item = { tenDoVat, TLDoVat, giaTri, limit, selectedQuantity: 0, soLuongNhap };
        ItemsBanDau.push(item);
        items.push({ ...item });
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
    let TGT = F[n - 1][W];

    displayDPResult(ItemsBanDau, items, TGT, TLConLai, hasSoLuongColumn);
}

function displayDPResult(ItemsBanDau, items, TGT, TLConLai, hasSoLuongColumn) {
    document.getElementById('resultTableGreedy').style.display = 'none';
    document.getElementById('resultTableBandB').style.display = 'none';

    const resultTableHead = document.querySelector('#dpResultTable thead tr');
    const resultTableBody = document.querySelector('#dpResultTable tbody');

    resultTableBody.innerHTML = '';
    resultTableHead.innerHTML = '';

    let headerHTML = `<th>Tên Đồ Vật</th>
                      <th>Trọng Lượng</th>
                      <th>Giá Trị</th>
                      <th>Đơn Giá</th>`;
    if (hasSoLuongColumn) headerHTML += `<th>Số Lượng</th>`;
    headerHTML += `<th>Phương Án</th>`;

    resultTableHead.innerHTML = headerHTML;

    items.forEach(item => {
        let rowHTML = `<td>${item.tenDoVat}</td>  
                       <td>${item.TLDoVat}</td>  
                       <td>${item.giaTri}</td>  
                       <td>${(item.giaTri / item.TLDoVat).toFixed(2)}</td>`;
        if (hasSoLuongColumn && item.soLuongNhap !== null) rowHTML += `<td>${item.soLuongNhap}</td>`;
        rowHTML += `<td>${item.selectedQuantity}</td>`;

        const row = document.createElement('tr');
        row.innerHTML = rowHTML;
        resultTableBody.appendChild(row);
    });

    document.getElementById('totalValueDisplayDP').innerText = `Tổng giá trị tối ưu - Quy hoạch động: ${TGT}`;
    document.getElementById('remainingCapacityDisplayDP').innerText = `Trọng lượng còn lại của ba lô: ${TLConLai}`;
    document.getElementById('resultTableDP').style.display = 'block';
}
