function solveAllKnapsack(type) {
    // Gọi thuật toán Tham ăn (Greedy)
    solveGreedyKnapsack(type);

    // Gọi thuật toán Nhánh cận (Branch and Bound)
    solveKnapsackBandB(type);

    // Gọi thuật toán Quy hoạch động (Dynamic Programming)
    solveKnapsackDP(type);

    // Hiển thị cả ba bảng kết quả
    document.getElementById('resultTableGreedy').style.display = 'block';
    document.getElementById('resultTableBandB').style.display = 'block';
    document.getElementById('resultTableDP').style.display = 'block';
}
