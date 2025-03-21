function ThamAn(type) {
    const TLbalo = parseFloat(document.getElementById('baloWeightDisplay').textContent);
    const tableRows = document.querySelectorAll('#dataTable tbody tr');
    let items = [];
    let ItemsBanDau = [];
    let hasSoLuongColumn = tableRows[0].cells.length > 4;

    // Lấy dữ liệu từ bảng
    tableRows.forEach(row => {
        const cells = row.querySelectorAll('td');
        const tenDoVat = cells[0].textContent;
        const TLDoVat = parseFloat(cells[1].textContent);
        const giaTri = parseFloat(cells[2].textContent);
        const donGia = giaTri / TLDoVat;
        const soLuongNhap = hasSoLuongColumn ? parseInt(cells[3].textContent) : null;
        let SLMax = type === 'bounded' ? soLuongNhap : (type === '01' ? 1 : Infinity);
        
        let item = { tenDoVat, TLDoVat, giaTri, donGia, SLMax, soLuongNhap };
        ItemsBanDau.push(item);
        items.push({ ...item });
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
                soLuongNhap: item.soLuongNhap,
                SL: SL
            });

            TGT += SL * item.giaTri;
            TLConLai -= SL * item.TLDoVat;
        }

        if (type === '01' && TLConLai <= 0) break;
    }   
    displayGreedyResult(ItemsBanDau, selectedItems, TGT, TLConLai, hasSoLuongColumn);
}
 
function displayGreedyResult(ItemsBanDau, selectedItems, TGT, TLConLai, hasSoLuongColumn) {
    document.getElementById('resultTableBandB').style.display = 'none';
    document.getElementById('resultTableDP').style.display = 'none';

    const resultTableHead = document.querySelector('#greedyResultTable thead tr');
    const resultTableBody = document.querySelector('#greedyResultTable tbody');

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
        let selectedItem = selectedItems.find(i => i.tenDoVat === item.tenDoVat);
        let SL = selectedItem ? selectedItem.SL : 0;

        let rowHTML = `<td>${item.tenDoVat}</td>  
                       <td>${item.TLDoVat}</td>  
                       <td>${item.giaTri}</td>  
                       <td>${item.donGia.toFixed(2)}</td>`;
        if (hasSoLuongColumn && item.soLuongNhap !== null) rowHTML += `<td>${item.soLuongNhap}</td>`;
        rowHTML += `<td>${SL}</td>`;

        const row = document.createElement('tr');
        row.innerHTML = rowHTML;
        resultTableBody.appendChild(row);
    });

    document.getElementById('totalValueDisplayGreedy').textContent = `Tổng giá trị tối ưu - Tham ăn: ${TGT}`;
    document.getElementById('remainingCapacityDisplayGreedy').textContent = `Trọng lượng còn lại của ba lô: ${TLConLai}`;
    document.getElementById('resultTableGreedy').style.display = 'block';
}
