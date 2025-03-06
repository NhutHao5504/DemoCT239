function solveAllKnapsack(type) {
    ThamAn(type);
    NhanhCan(type);
    QuyHoachDong(type);

    // Hiển thị cả ba bảng kết quả
    document.getElementById('resultTableGreedy').style.display = 'block';
    document.getElementById('resultTableBandB').style.display = 'block';
    document.getElementById('resultTableDP').style.display = 'block';
}
