const members = ["マーズ", "専務", "暖房", "岡田", "わまだ", "元橋"];
let selectedMembers = [];
let inputs = {};

const checkboxContainer = document.getElementById("checkboxContainer");
const inputContainer = document.getElementById("inputContainer");
const shuffleButton = document.getElementById("shuffleButton");
const resultContainer = document.getElementById("resultContainer");

function updateCheckboxes() {
    checkboxContainer.innerHTML = "";
    members.forEach(member => {
        const label = document.createElement("label");
label.className = "checkboxItem";
label.innerHTML = `
    <input type="checkbox" class="checkbox" value="${member}">
    ${member}
`;
        checkboxContainer.appendChild(label);

        label.querySelector("input").addEventListener("change", (e) => {
            handleCheckboxChange(e.target.value, e.target.checked);
        });
    });
}

function handleCheckboxChange(member, isChecked) {
    if (isChecked) {
        selectedMembers.push(member);
    } else {
        selectedMembers = selectedMembers.filter(m => m !== member);
        delete inputs[member];
    }
    updateInputs();
}

function updateInputs() {
    inputContainer.innerHTML = "";
    if (selectedMembers.length < 3) {
        shuffleButton.disabled = true;
        return;
    }

    selectedMembers.forEach(member => {
        const row = document.createElement("div");
        row.className = "input-row";
        row.innerHTML = `<strong>${member}</strong>
                         <input type="text" placeholder="キャラクター" data-member="${member}" data-type="character">
                         <input type="text" placeholder="要素" data-member="${member}" data-type="element">`;
        inputContainer.appendChild(row);
    });

    document.querySelectorAll("input[data-member]").forEach(input => {
        input.addEventListener("input", (e) => {
            const member = e.target.dataset.member;
            const type = e.target.dataset.type;
            inputs[member] = inputs[member] || {};
            inputs[member][type] = e.target.value;
        });
    });

    shuffleButton.disabled = false;
}

function shuffleTopics() {
    const characters = selectedMembers.map(m => inputs[m]?.character || "");
    const elements = selectedMembers.map(m => inputs[m]?.element || "");

    if (new Set(characters).size !== characters.length || new Set(elements).size !== elements.length) {
        alert("同じ単語が含まれています。異なる単語を入力してください。");
        return;
    }

    let shuffledCharacters = [...characters];
    let shuffledElements = [...elements];

    do {
        shuffledCharacters.sort(() => Math.random() - 0.5);
        shuffledElements.sort(() => Math.random() - 0.5);
    } while (shuffledCharacters.some((char, i) => char === characters[i]) ||
             shuffledElements.some((elem, i) => elem === elements[i]));

    displayResults(shuffledCharacters, shuffledElements);
}

function displayResults(shuffledCharacters, shuffledElements) {
    resultContainer.innerHTML = `<h2>シャッフル結果</h2>
                                 <table class="result-table">
                                     <thead>
                                         <tr><th>名前</th><th>キャラクター</th><th>要素</th></tr>
                                     </thead>
                                     <tbody>
                                         ${selectedMembers.map((member, i) =>
                                             `<tr>
                                                 <td>${member}</td>
                                                 <td>${shuffledCharacters[i]}</td>
                                                 <td>${shuffledElements[i]}</td>
                                             </tr>`).join('')}
                                     </tbody>
                                 </table>
                                 <button id="resetButton" class="reset-button">はじめから</button>`;

    document.getElementById("resetButton").addEventListener("click", reset);
}

function reset() {
    selectedMembers = [];
    inputs = {};
    resultContainer.innerHTML = "ここに結果が表示されます"; // デフォルトメッセージをセット
    updateInputs();
    updateCheckboxes();
}

shuffleButton.addEventListener("click", shuffleTopics);

updateCheckboxes();
