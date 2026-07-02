"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
function generateImage() {
    return __awaiter(this, void 0, void 0, function* () {
        const fileInput = document.getElementById('fileInput');
        const widthInput = document.getElementById('width');
        const colorsInput = document.getElementById('colors');
        if (!fileInput.files || fileInput.files.length === 0)
            return;
        const formData = new FormData();
        formData.append('file', fileInput.files[0]);
        formData.append('width', widthInput.value);
        formData.append('colors', colorsInput.value);
        const response = yield fetch('/generate', { method: 'POST', body: formData });
        const data = yield response.json();
        renderGrid(data);
    });
}
function renderGrid(data) {
    return __awaiter(this, void 0, void 0, function* () {
        const container = document.getElementById('resultContainer');
        if (!container)
            return;
        container.innerHTML = '';
        const table = document.createElement('table');
        const tbody = document.createElement('tbody');
        for (let i = 0; i < data.height; i++) {
            const tr = document.createElement('tr');
            for (let j = 0; j < data.width; j++) {
                const td = document.createElement('td');
                td.style.backgroundColor = data.grid[i][j];
                tr.appendChild(td);
            }
            tbody.appendChild(tr);
        }
        table.appendChild(tbody);
        container.appendChild(table);
    });
}
