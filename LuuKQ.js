function saveResultsToFile() {
    let resultText = "";

    // Hàm lấy dữ liệu từ bảng với căn chỉnh cột
    function getTableData(tableId) {
        let table = document.getElementById(tableId);
        let rows = table.querySelectorAll("tbody tr");
        let headers = table.querySelectorAll("thead th");

        // Tìm độ dài tối đa của mỗi cột
        let colWidths = Array.from(headers).map((header, colIndex) => {
            let maxLen = header.innerText.length;
            rows.forEach(row => {
                let cell = row.querySelectorAll("td")[colIndex];
                if (cell) maxLen = Math.max(maxLen, cell.innerText.length);
            });
            return maxLen;
        });

        let formatCell = (text, width) => text.padEnd(width, " "); // Căn trái

        let data = "";

        // Lấy tiêu đề bảng (có căn chỉnh)
        headers.forEach((header, index) => {
            data += formatCell(header.innerText, colWidths[index]) + "\t";
        });
        data += "\n";

        // Lấy nội dung bảng (có căn chỉnh)
        rows.forEach(row => {
            let cells = row.querySelectorAll("td");
            cells.forEach((cell, index) => {
                data += formatCell(cell.innerText, colWidths[index]) + "\t";
            });
            data += "\n";
        });

        return data;
    }

    // Lấy dữ liệu từ từng bảng nếu nó hiển thị
    if (document.getElementById("resultTableGreedy").style.display !== "none") {
        resultText += "KẾT QUẢ THUẬT TOÁN THAM ĂN\n";
        resultText += getTableData("greedyResultTable");
        resultText += "Tổng giá trị: " + document.getElementById("totalValueDisplayGreedy").innerText + "\n";
        resultText += "Dung lượng còn lại: " + document.getElementById("remainingCapacityDisplayGreedy").innerText + "\n\n";
    }

    if (document.getElementById("resultTableBandB").style.display !== "none") {
        resultText += "KẾT QUẢ THUẬT TOÁN NHÁNH CẬN\n";
        resultText += getTableData("bandBResultTable");
        resultText += "Tổng giá trị: " + document.getElementById("totalValueDisplayBandB").innerText + "\n";
        resultText += "Dung lượng còn lại: " + document.getElementById("remainingCapacityDisplayBandB").innerText + "\n\n";
    }

    if (document.getElementById("resultTableDP").style.display !== "none") {
        resultText += "KẾT QUẢ THUẬT TOÁN QUY HOẠCH ĐỘNG\n";
        resultText += getTableData("dpResultTable");
        resultText += "Tổng giá trị: " + document.getElementById("totalValueDisplayDP").innerText + "\n";
        resultText += "Dung lượng còn lại: " + document.getElementById("remainingCapacityDisplayDP").innerText + "\n\n";
    }

    if (resultText === "") {
        alert("Không có kết quả để lưu!");
        return;
    }

    // Tạo file và tải xuống
    let blob = new Blob([resultText], { type: "text/plain" });
    let link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "ket_qua_balo.txt";
    link.click();
}
