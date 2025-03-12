function ThamAn(type) {
    const TLbalo = parseFloat(document.getElementById('baloWeightDisplay').textContent);
    const tableRows = document.querySelectorAll('#dataTable tbody tr');
    let items = [];
    let ItemsBanDau = [];

    // Lấy dữ liệu từ bảng
    tableRows.forEach(row => {
        const cells = row.querySelectorAll('td');
        const tenDoVat = cells[0].textContent;
        const TLDoVat = parseFloat(cells[1].textContent);
        const giaTri = parseFloat(cells[2].textContent);
        const donGia = giaTri / TLDoVat;
        let SLMax = type === 'bounded' ? parseInt(cells[3].textContent) : (type === '01' ? 1 : Infinity);
        
        let item = { tenDoVat, TLDoVat, giaTri, donGia, SLMax };
        ItemsBanDau.push(item);
        items.push({ tenDoVat, TLDoVat, giaTri, donGia, SLMax });
    });

    quickSort(items);

    let TLConLai = TLbalo;
    let TGT = 0;
    let selectedItems = [];

    for (let item of items) {
        if (item.TLDoVat > TLConLai) continue; 
        let SL = Math.min(Math.floor(TLConLai / item.TLDoVat), item.SLMax); 
        if (SL > 0) {
            selectedItems.push({
                tenDoVat: item.tenDoVat,
                TLDoVat: item.TLDoVat,
                giaTri: item.giaTri,
                donGia: item.donGia.toFixed(2),
                SL: SL
            });

            TGT += SL * item.giaTri;
            TLConLai -= SL * item.TLDoVat;
        }

        if (type === '01' && TLConLai <= 0) break;
    }   
    displayGreedyResult(ItemsBanDau, selectedItems, TGT, TLConLai);
}

function displayGreedyResult(ItemsBanDau, selectedItems, TGT, TLConLai) {
    document.getElementById('resultTableBandB').style.display = 'none';
    document.getElementById('resultTableDP').style.display = 'none';

    const resultTableBody = document.querySelector('#greedyResultTable tbody');
    resultTableBody.innerHTML = '';

    ItemsBanDau.forEach(item => {
        let selectedItem = selectedItems.find(i => i.tenDoVat === item.tenDoVat);
        let SL = selectedItem ? selectedItem.SL : 0;

        const row = document.createElement('tr');
        row.innerHTML = `<td>${item.tenDoVat}</td>  
                         <td>${item.TLDoVat}</td>  
                         <td>${item.giaTri}</td>  
                         <td>${item.donGia.toFixed(2)}</td>  
                         <td>${SL}</td>`;

        resultTableBody.appendChild(row);
    });

    document.getElementById('totalValueDisplayGreedy').textContent = `Tổng giá trị tối ưu - Tham ăn: ${TGT}`;
    document.getElementById('remainingCapacityDisplayGreedy').textContent = `Trọng lượng còn lại của ba lô: ${TLConLai}`;
    document.getElementById('resultTableGreedy').style.display = 'block';
}
