function solveAllKnapsack(type) {  
    // Gọi các thuật toán  
    ThamAn(type);  
    NhanhCan(type);  
    QuyHoachDong(type);  

    // Ẩn tất cả các bảng kết quả trước khi hiển thị bảng so sánh  
    document.getElementById('resultTableGreedy').style.display = 'none';  
    document.getElementById('resultTableBandB').style.display = 'none';  
    document.getElementById('resultTableDP').style.display = 'none';  

    // Hiển thị bảng so sánh  
    document.getElementById('resultTableCombined').style.display = 'block';  
    combineResults();  
}  

function combineResults() {  
    let greedyRows = document.querySelectorAll('#greedyResultTable tbody tr');  
    let bandBRows = document.querySelectorAll('#bandBResultTable tbody tr');  
    let dpRows = document.querySelectorAll('#dpResultTable tbody tr');  
    let combinedTableBody = document.querySelector('#combinedResultTable tbody');  
    combinedTableBody.innerHTML = '';  

    let dataMap = new Map();  
    let totalValueGreedy = 0, totalValueBandB = 0, totalValueDP = 0;  
    let initialWeight = parseInt(document.getElementById('baloWeightDisplay').textContent);  
    let remainingWeightGreedy = initialWeight;  
    let remainingWeightBandB = initialWeight;  
    let remainingWeightDP = initialWeight;  

    function addToMap(rows, method) {  
        let totalValue = 0;  
        let remainingWeight = initialWeight;  

        rows.forEach(row => {  
            let cols = row.children;  
            let name = cols[0].textContent.trim();  
            let weight = parseInt(cols[1].textContent.trim());  
            let value = parseInt(cols[2].textContent.trim());  
            let unitPrice = cols[3].textContent.trim();  
            let decision = parseInt(cols[4].textContent.trim());  

            if (!dataMap.has(name)) {  
                dataMap.set(name, { weight, value, unitPrice, ThamAn: '0', NhanhCan: '0', QuyHoachDong: '0' });  
            }  
            dataMap.get(name)[method] = decision;  

            if (decision > 0) {  
                totalValue += decision * value;  
                remainingWeight -= decision * weight;  
            }  
        });  

        return [totalValue, remainingWeight];  
    }  

    [totalValueGreedy, remainingWeightGreedy] = addToMap(greedyRows, 'ThamAn');  
    [totalValueBandB, remainingWeightBandB] = addToMap(bandBRows, 'NhanhCan');  
    [totalValueDP, remainingWeightDP] = addToMap(dpRows, 'QuyHoachDong');  

    // Tạo bảng hiển thị kết quả  
    dataMap.forEach((data, name) => {  
        let newRow = `<tr>  
            <td>${name}</td>  
            <td>${data.weight}</td>  
            <td>${data.value}</td>  
            <td>${data.unitPrice}</td>  
            <td>${data.ThamAn}</td>  
            <td>${data.NhanhCan}</td>  
            <td>${data.QuyHoachDong}</td>  
        </tr>`;  
        combinedTableBody.innerHTML += newRow;  
    });  

    // Dòng tổng giá trị  
    let totalRow = `<tr style="font-weight: bold;">  
    <td>Tổng giá trị</td>  
    <td></td>  
    <td></td>  
    <td></td>  
    <td>${totalValueGreedy}</td>  
    <td>${totalValueBandB}</td>  
    <td>${totalValueDP}</td>  
    </tr>`;  
    combinedTableBody.innerHTML += totalRow;  

    // Dòng trọng lượng còn lại  
    let remainingWeightRow = `<tr style="font-weight: bold;">  
    <td>Trọng lượng còn lại</td>  
    <td></td>  
    <td></td>  
    <td></td>  
    <td>${remainingWeightGreedy}</td>  
    <td>${remainingWeightBandB}</td>  
    <td>${remainingWeightDP}</td>  
    </tr>`;  
    combinedTableBody.innerHTML += remainingWeightRow;  
}  