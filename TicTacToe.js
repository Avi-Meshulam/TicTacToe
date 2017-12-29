var boardTDs;
var boardSide = 3;
var player = "X";
var isRunning = false;
var allRowsDirty = false;
var allColumnsDirty = false;
var rightDiagonalDirty = false;
var leftDiagonalDirty = false;
var prevBoardSide = txtBoardSide.value;
var settingsDiv = document.getElementById("settings");
var boardDiv = document.getElementById("gameBoard");

document.onkeydown = function () {
    // Set default buttons
    if (event.key == "Enter" && !isRunning)
        document.getElementById('btnStart').click();
    else if (event.key == "Esc" && isRunning)
        document.getElementById('btnReturn').click();
};

function txtBoardSide_Input() {
    if (txtBoardSide.value == 0 && txtBoardSide.value != "") {
        document.getElementById("txtBoardSide").value = prevBoardSide;
    }
    else if (txtBoardSide.value > 10) {
        txtBoardSide.value = Number(txtBoardSide.value.slice(0, txtBoardSide.value.length - 1));
    }
    else {
        prevBoardSide = txtBoardSide.value;
    }

    if (txtBoardSide.value < 2 || txtBoardSide.value > 10) {
        btnStart.setAttribute("disabled", true);
    }
    else {
        btnStart.removeAttribute("disabled");
    }
}

function radioPlayer_Clicked() {
    if (document.getElementById("PlayerX").checked)
        player = "X";
    else
        player = "O";
}

function btnStart_Clicked() {
    startGame();
}

function startGame() {
    allRowsDirty = false;
    allColumnsDirty = false;
    rightDiagonalDirty = false;
    leftDiagonalDirty = false;

    boardSide = Number(txtBoardSide.value);
    var table = createTable(boardSide);
    var btnReturn = CreateButton("Return", endGame);

    settingsDiv.style.display = "none";

    boardDiv.style.display = "block";
    boardDiv.appendChild(table);
    boardDiv.appendChild(document.createElement("br"));
    boardDiv.appendChild(btnReturn);

    boardTDs = table.querySelectorAll("td");

    for (var index = 0; index < boardTDs.length; index++) {
        boardTDs[index].addEventListener(
            "click",
            function () {
                if (this.innerHTML == "") {
                    this.style.color =
                        player == "X" ? "black" : "red";
                    this.innerHTML = player;
                    if (checkBoard()) {
                        return;
                    }
                    player = player == "X" ? "O" : "X";
                }
            }
        );
    }

    isRunning = true;
}

function checkBoard() {
    if (checkRows() || checkColumns() || checkRightDiagonal() || checkLeftDiagonal()) {
        displayWinner();
        return true;
    }

    if (allRowsDirty && allColumnsDirty && rightDiagonalDirty && leftDiagonalDirty) {
        gameOver();
        return true;
    }
}

function checkRows() {

    var dirtyCounter = 0;

    for (var row = 0; row < boardSide; row++) {
        var playerCounter = 0;
        var enemyFound = false;

        for (var col = 0; col < boardSide ; col++) {
            if (boardTDs[(row * boardSide) + col].innerHTML == player) {
                playerCounter++;
                if (enemyFound)
                    break;
            }
            else if (boardTDs[(row * boardSide) + col].innerHTML != "") {
                enemyFound = true;
                if (playerCounter > 0)
                    break;
            }
        }

        if (playerCounter == boardSide) {
            // Inner loop didn't break => current player wins
            return true;
        }
        else if (playerCounter > 0 && enemyFound) {
            dirtyCounter++;
        }
    }

    if (dirtyCounter == boardSide) {
        allRowsDirty = true;
    }
}

function checkColumns() {

    var dirtyCounter = 0;

    for (var col = 0; col < boardSide; col++) {
        var playerCounter = 0;
        var enemyFound = false;

        for (var row = 0; row < boardSide ; row++) {
            if (boardTDs[(row * boardSide) + col].innerHTML == player) {
                playerCounter++;
                if (enemyFound)
                    break;
            }
            else if (boardTDs[(row * boardSide) + col].innerHTML != "") {
                enemyFound = true;
                if (playerCounter > 0)
                    break;
            }
        }

        if (playerCounter == boardSide) {
            // Inner loop didn't break => current player wins
            return true;
        }
        else if (playerCounter > 0 && enemyFound) {
            dirtyCounter++;
        }
    }

    if (dirtyCounter == boardSide) {
        allColumnsDirty = true;
    }
}

function checkRightDiagonal() {
    var playerCounter = 0;
    var enemyFound = false;

    for (var row = 0; row < boardSide; row++) {
        if (boardTDs[row * (boardSide + 1)].innerHTML == player) {
            playerCounter++
            if (enemyFound)
                break;
        }
        else if (boardTDs[row * (boardSide + 1)].innerHTML != "") {
            enemyFound = true;
            if (playerCounter > 0)
                break;
        }
    }

    if (playerCounter == boardSide) {
        // Inner loop didn't break => current player wins
        return true;
    }
    else if (playerCounter > 0 && enemyFound) {
        rightDiagonalDirty = true;
    }
}

function checkLeftDiagonal() {
    var playerCounter = 0;
    var enemyFound = false;

    for (var row = 0; row < boardSide; row++) {
        if (boardTDs[(row + 1) * (boardSide - 1)].innerHTML == player) {
            playerCounter++
            if (enemyFound)
                break;
        }
        else if (boardTDs[(row + 1) * (boardSide - 1)].innerHTML != "") {
            enemyFound = true;
            if (playerCounter > 0)
                break;
        }
    }

    if (playerCounter == boardSide) {
        // Inner loop didn't break => current player wins
        return true;
    }
    else if (playerCounter > 0 && enemyFound) {
        leftDiagonalDirty = true;
    }
}

function displayWinner() {
    // Display the message with a delay,
    // in order to let the screen to refresh
    setTimeout(
        function (player) {
            alert(player + " Wins!");
            endGame();
        },
    10, player);
}

function gameOver() {
    // Display the message with a delay,
    // in order to let the screen to refresh
    setTimeout(
        function (player) {
            alert("G a m e   O v e r");
            endGame();
        },
    10, player);
}

function endGame() {
    while (boardDiv.firstChild) {
        boardDiv.removeChild(boardDiv.firstChild);
    }
    boardDiv.style.display = "none";
    settingsDiv.style.display = "block";
    txtBoardSide.focus();
    isRunning = false;
}

function createTable(size) {

    var tdSide = document.documentElement["clientHeight"] / size / 1.5;

    var fontSize = tdSide / 1.8;

    var table = document.createElement("table");
    table.id = "gameTable";

    for (var row = 0; row < size; row++) {
        var tr = document.createElement("tr");
        table.appendChild(tr);

        for (var col = 0; col < size; col++) {
            var td = document.createElement("td");
            td.style.width = tdSide + "px";
            td.style.height = td.style.width;
            td.style.fontSize = fontSize + "px";
            tr.appendChild(td);
        }
    }
    return table;
}

function CreateButton(name, func) {
    var button = document.createElement("button");
    button.innerHTML = name;
    button.id = "btn" + name;
    button.onclick = func;
    return button;
}
