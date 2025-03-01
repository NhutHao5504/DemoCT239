function solveKnapsackDP(type) {
    const baloInput = document.getElementById('baloWeightDisplay').textContent;
    if (!baloInput || isNaN(baloInput) || parseInt(baloInput) <= 0) {
        alert("Vui lòng nhập trọng lượng ba lô hợp lệ (số nguyên dương).");
        return;
    }
    const W = parseInt(baloInput);

    let items = [];
    const rows = document.querySelectorAll('#dataTable tbody tr');
    rows.forEach(row => {
        const name = row.cells[0].innerText;
        const weight = parseInt(row.cells[1].innerText);
        const value = parseInt(row.cells[2].innerText);
        const limit = row.cells[3] ? parseInt(row.cells[3].innerText) : Infinity;
        items.push({ name, weight, value, limit, selectedQuantity: 0 });
    });

    let n = items.length;
    let F = Array(n).fill(0).map(() => Array(W + 1).fill(0));
    let X = Array(n).fill(0).map(() => Array(W + 1).fill(0));

    function createTable() {
        for (let V = 0; V <= W; V++) {
            if (type === "01") {
                X[0][V] = (V >= items[0].weight) ? 1 : 0;
            } else {
                X[0][V] = Math.min(Math.floor(V / items[0].weight), type === "bounded" ? items[0].limit : Infinity);
            }
            F[0][V] = X[0][V] * items[0].value;
        }

        for (let k = 1; k < n; k++) {
            for (let V = 0; V <= W; V++) {
                let Fmax = F[k - 1][V];
                let Xmax = 0;

                let maxQuantity = (type === "01") ? Math.min(1, Math.floor(V / items[k].weight))
                    : (type === "bounded") ? Math.min(items[k].limit, Math.floor(V / items[k].weight))
                        : Math.floor(V / items[k].weight);

                for (let xk = 0; xk <= maxQuantity; xk++) {
                    let remainingWeight = V - xk * items[k].weight;
                    if (remainingWeight >= 0) {
                        let newValue = F[k - 1][remainingWeight] + xk * items[k].value;
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
            V -= items[k].selectedQuantity * items[k].weight;
        }
        return V;
    }

    createTable();
    let remainingWeight = traceTable();
    let totalValue = F[n - 1][W];

    displayDPResult(items, totalValue, remainingWeight);
}

function displayDPResult(items, totalValue, remainingWeight) {
    document.getElementById('resultTableGreedy').style.display = 'none';
    document.getElementById('resultTableBandB').style.display = 'none';

    const resultTableBody = document.querySelector('#dpResultTable tbody');
    resultTableBody.innerHTML = '';

    items.forEach(item => {
        const row = document.createElement('tr');
        row.innerHTML = `<td>${item.name}</td>  
                         <td>${item.weight}</td>  
                         <td>${item.value}</td>  
                         <td>${(item.value / item.weight).toFixed(2)}</td>  
                         <td>${item.selectedQuantity}</td>`;
        resultTableBody.appendChild(row);
    });

    document.getElementById('totalValueDisplayDP').innerText = `Tổng giá trị tối ưu - DP: ${totalValue}`;
    document.getElementById('remainingCapacityDisplayDP').innerText = `Trọng lượng còn lại của ba lô DP: ${remainingWeight}`;
    document.getElementById('resultTableDP').style.display = 'block';
}
