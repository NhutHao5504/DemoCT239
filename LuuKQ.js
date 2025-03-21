function saveResultsToFile() {
    let resultText = "DỮ LIỆU BAN ĐẦU\n";

    // Lấy dữ liệu từ bảng và căn chỉnh dữ liệu
    function getTableData(tableId) {
        let table = document.getElementById(tableId);
        if (!table || table.style.display === "none") return "";

        let rows = table.querySelectorAll("tbody tr");
        let headers = table.querySelectorAll("thead th");

        if (rows.length === 0) return "";

        // Tìm độ dài tối đa của mỗi cột trong header
        let doDaiCot = Array.from(headers).map((header, soThuTuCot) => {
            let maxLen = header.innerText.length;
            rows.forEach(row => {
                let cell = row.querySelectorAll("td")[soThuTuCot];
                if (cell) maxLen = Math.max(maxLen, cell.innerText.length);
            });
            return maxLen;
        });

        let formatCell = (text, width) => text.padEnd(width, " "); // Căn trái

        let data = "";
        // Lấy tiêu đề bảng (có căn chỉnh)
        headers.forEach((header, index) => {
            data += formatCell(header.innerText, doDaiCot[index]) + "\t";
        });
        data += "\n";

        // Lấy nội dung bảng (có căn chỉnh)
        rows.forEach(row => {
            let cells = row.querySelectorAll("td");
            cells.forEach((cell, index) => {
                data += formatCell(cell.innerText, doDaiCot[index]) + "\t";
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
        resultText += document.getElementById("totalValueDisplayGreedy").innerText + "\n";
        resultText += document.getElementById("remainingCapacityDisplayGreedy").innerText + "\n\n";
    }

    if (document.getElementById("resultTableBandB").style.display !== "none") {
        resultText += "KẾT QUẢ THUẬT TOÁN NHÁNH CẬN\n";
        resultText += getTableData("bandBResultTable");
        resultText += document.getElementById("totalValueDisplayBandB").innerText + "\n";
        resultText += document.getElementById("remainingCapacityDisplayBandB").innerText + "\n\n";
    }

    if (document.getElementById("resultTableDP").style.display !== "none") {
        resultText += "KẾT QUẢ THUẬT TOÁN QUY HOẠCH ĐỘNG\n";
        resultText += getTableData("dpResultTable");
        resultText += document.getElementById("totalValueDisplayDP").innerText + "\n";
        resultText += document.getElementById("remainingCapacityDisplayDP").innerText + "\n\n";
    }

    let combinedTable = document.getElementById("resultTableCombined");
    if (combinedTable && combinedTable.style.display !== "none") {  
//        console.log("Lưu bảng so sánh...");
        let combinedData = getTableData("combinedResultTable");
//        console.log("Dữ liệu bảng so sánh:", combinedData);
        resultText += "KẾT QUẢ SO SÁNH CÁC GIẢI THUẬT\n";  
        resultText += combinedData;  
        resultText += "\n";
    }

    // Tạo file và tải xuống
    let blob = new Blob([resultText], { type: "text/plain" }); //Tạo đối tượng Blob lưu dữ liệu văn bản
    let link = document.createElement("a");
    link.href = URL.createObjectURL(blob);  //Tạo đường dẫn URL cho Blob
    link.download = "Ket_Qua.txt";
    link.click();
}
