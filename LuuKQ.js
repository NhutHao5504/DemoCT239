function saveResultsToFile() {
    let resultText = "DỮ LIỆU BAN ĐẦU\n";

    // Hàm lấy dữ liệu từ bảng với căn chỉnh cột
    function getTableData(tableId) {
        let table = document.getElementById(tableId);
        if (!table || table.style.display === "none") return "";

        let rows = table.querySelectorAll("tbody tr");
        let headers = table.querySelectorAll("thead th");

        if (rows.length === 0) return ""; // Không có dữ liệu

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

    // Lưu bảng dữ liệu đầu vào trước khi giải thuật
    let initialData = getTableData("dataTable");
    if (initialData.trim()) {
        resultText += initialData + "\n\n";
    } else {
        resultText += "Không có dữ liệu đầu vào!\n\n";
    }

    // Lấy dữ liệu từ từng bảng kết quả nếu nó hiển thị
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

    if (resultText.trim() === "DỮ LIỆU BAN ĐẦU\nKhông có dữ liệu đầu vào!\n\n") {
        alert("Không có dữ liệu nào để lưu!");
        return;
    }

    // Tạo file và tải xuống
    let blob = new Blob([resultText], { type: "text/plain" });
    let link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "ket_qua_balo.txt";
    link.click();
}
