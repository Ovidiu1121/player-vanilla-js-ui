export function createHome() {

    let container = document.querySelector(".container");


    container.innerHTML = `
    
    	<h1>Players</h1>

    <button class="button">Add player</button>

	<table class="table">
		<thead>
			<tr class="table-header">
				<th>Id</th>
				<th>Name</th>
				<th>Number</th>
				<th>Value</th>
			</tr>
		</thead>
		<tbody>
		</tbody>
	</table>
    `

    api("https://localhost:7035/api/v1/Player/all").then(response => {
        return response.json();
    }).then(data => {
        console.log(data);
        attachPlayers(data.playerList);
    }).catch(error => {
        console.error('Error fetching data:', error);
    });


    let button = document.querySelector(".button");

    button.addEventListener("click", (eve) => {
        CreateAddPlayerPage();
    });

}

export function CreateAddPlayerPage() {

    let container = document.querySelector(".container");


    container.innerHTML = `
    
      <h1>New Player</h1>
    <form>
        <p class="name-container">
            <label for="name">Name</label>
            <input name="name" type="text" id="name">
            <a class="nameErr">Name required!</a>
        </p>
        <p class="number-container">
            <label for="number">Number</label>
            <input name="number" type="text" id="number">
            <a class="numberErr">Number required!</a>
        </p>
        <p class="value-container">
            <label for="value">Value</label>
            <input name="value" type="text" id="value">
            <a class="valueErr">Value required!</a>
        </p>
        <div class="createPlayer">
         <a href="#">Create New Player</a>
        </div>
        <div class="cancel">
         <a href="#">Cancel</a>
        </div>
    </form>

    `

    let button = document.querySelector(".cancel");
    let test = document.querySelector(".createPlayer");

    button.addEventListener("click", (eve) => {
        createHome();
    })

    test.addEventListener("click", (eve) => {
        createPlayer();
    })

}

function createRow(player) {

    let tr = document.createElement("tr");

    tr.innerHTML = `
				<td>${player.id}</td>
				<td>${player.name}</td>
				<td>${player.number}</td>
				<td>${player.value}</td>
    `

    return tr;
}

function api(path, method = "GET", body = null) {

    const url = path;
    const options = {
        method,
        headers: {
            'Content-Type': 'application/json; charset=utf-8',
            'X-Requested-With': 'XMLHttpRequest',
        }
    }
    if (body != null) {
        options.body = JSON.stringify(body);
    }

    return fetch(url, options);
}

function attachPlayers(players) {

    let lista = document.querySelector("thead");

    players.forEach(pl => {

        let tr = createRow(pl);
        lista.appendChild(tr);

    });

    return lista;

}

function createPlayer() {

    const isNumber = (str) => {
        return /^[+-]?\d+(\.\d+)?$/.test(str);
    };

    let name = document.getElementById("name").value;
    let number = document.getElementById("number").value;
    let valueInput = document.getElementById("value").value;

    let nameError = document.querySelector(".nameErr");
    let numberError = document.querySelector(".numberErr");
    let valueError = document.querySelector(".valueErr");

    let errors = [];

    if (name == '') {

        errors.push("Name");

    } else if (nameError.classList.contains("beDisplayed") && name !== '') {

        errors.pop("Name");
        nameError.classList.remove("beDisplayed");
    }

    if (number == '') {

        errors.push("Number");

    } else if (numberError.classList.contains("beDisplayed") && number !== '') {

        errors.pop("Number");
        numberError.classList.remove("beDisplayed");
    }

    if (valueInput == '') {

        errors.push("Value");

    } else if (valueError.classList.contains("beDisplayed") && valueInput !== '') {

        errors.pop("Value");
        valueError.classList.remove("beDisplayed");

    }

    if (!isNumber(valueInput) && valueInput != '') {

        errors.push("Value2");
    }
    else if (isNumber(valueInput)) {

        errors.pop("Value2");

    } else if (valueError.classList.contains("beDisplayed") && valueInput !== '') {

        errors.pop("Value2");
        valueError.classList.remove("beDisplayed");
    }

    if (!isNumber(number) && number != '') {

        errors.push("Number2");
    }
    else if (isNumber(number)) {

        errors.pop("Number2");

    } else if (numberError.classList.contains("beDisplayed") && number !== '') {

        errors.pop("Number2");
        numberError.classList.remove("beDisplayed");
    }

    if (errors.length == 0) {

        let player = {
            name: name,
            number: number,
            value: valueInput
        }

        api("https://localhost:7035/api/v1/Player/create", "POST", player)
            .then(response => {
                return response.json();
            })
            .then(data => {
                console.log(data);
                createHome();
            })
            .catch(error => {
                console.error('Error fetching data:', error);
            });
    } else {

        errors.forEach(err => {

            if (err.includes("Name")) {

                nameError.classList.add("beDisplayed");
            }

            if (err.includes("Number")) {

                numberError.classList.add("beDisplayed");
            }

            if (err.includes("Value")) {

                valueError.classList.add("beDisplayed");
            }

            if (err.includes("Value2")) {
                valueError.classList.add("beDisplayed")
                valueError.textContent = "Only numbers";
            }

            if (err.includes("Number2")) {
                numberError.classList.add("beDisplayed")
                numberError.textContent = "Only numbers";
            }

        })

    }

}