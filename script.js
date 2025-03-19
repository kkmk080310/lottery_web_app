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
        label.className = "checkbox-label";
        label.innerHTML = `<input type="checkbox" value="${member}"> ${member}`;
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
    const errorMessage = document.getElementById("errorMessage");
    errorMessage.classList.add("hidden"); // まずはエラーを非表示

    // 各メンバーのお題を取得
    let playerTopics = selectedMembers.map(member => ({
        name: member,
        character: inputs[member]?.character || "",
        element: inputs[member]?.element || ""
    }));

    // 入力が足りない場合のチェック
    if (playerTopics.some(topic => !topic.character || !topic.element)) {
        errorMessage.textContent = "全員のキャラクターと要素を入力してください。";
        errorMessage.classList.remove("hidden");
        return;
    }

    let characters = playerTopics.map(topic => topic.character);
    let elements = playerTopics.map(topic => topic.element);
    let shuffledCharacters, shuffledElements;
    let maxTries = 1000; // 無限ループ防止
    let tries = 0;

    do {
        tries++;
        if (tries > maxTries) {
            errorMessage.textContent = "適切なシャッフルができませんでした。再度試してください。";
            errorMessage.classList.remove("hidden");
            return;
        }

        // キャラクターと要素を個別にシャッフル
        shuffledCharacters = [...characters].sort(() => Math.random() - 0.5);
        shuffledElements = [...elements].sort(() => Math.random() - 0.5);

        // 条件を満たしているかチェック
    } while (
        shuffledCharacters.some((char, i) => char === characters[i]) ||  // 自分のキャラを引いていないか
        shuffledElements.some((elem, i) => elem === elements[i]) ||     // 自分の要素を引いていないか
        shuffledCharacters.some((char, i) => {                         // キャラと要素のペアが元と同じでないか
            const originalIndex = characters.indexOf(char);
            return shuffledElements[i] === elements[originalIndex];
        })
    );

    // 結果を表示
    displayResults(shuffledCharacters, shuffledElements);
}

function displayResults(shuffledCharacters, shuffledElements) {
    resultContainer.innerHTML = `<h2>シャッフル結果</h2>
                                 <table class="result-table">
                                     <thead>
                                         <tr><th>描く人</th><th>キャラクター</th><th>要素</th></tr>
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
    document.getElementById("errorMessage").classList.add("hidden"); // エラーを消す
    resultContainer.innerHTML = "ここに結果が表示されます";
    updateInputs();
    updateCheckboxes();
}

shuffleButton.addEventListener("click", shuffleTopics);

updateCheckboxes();
