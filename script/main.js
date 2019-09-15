
// get data from api 
const API = {
    getTypes: () => {
        return fetch("http://localhost:8088/types")
            .then(response => response.json())
    },
    
    getFlavors: () => {
        return fetch("http://localhost:8088/flavors")
            .then(response => response.json())
    },
    
    getGlazes: () => {
        return fetch("http://localhost:8088/glazes")
            .then(response => response.json())
    },
    
    getToppings: () => {
        return fetch("http://localhost:8088/toppings")
            .then(response => response.json())
    },

    getDonuts: () => {
        return fetch("http://localhost:8088/donuts")
            .then(response => response.json())
    },

    createDonut: (tacoDonut) => {
        return fetch("http://localhost:8088/donuts", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(tacoDonut)
        }).then(response => response.json())
    },

    deleteDonut: (id) => {
        return fetch(`http://localhost:8088/donuts/${id}`, {
            method: "DELETE"
            }).then(response => response.json())
    },

    editDonut: (id) => {
        const donutUpdateObject = {
            name: document.querySelector("#donutName").value
        }
        return fetch(`http://localhost:8088/donuts/${id}`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(donutUpdateObject)
        }).then(response => response.json())
    },
    getSingle: (donutId) => {
       return fetch(`http://localhost:8088/donuts/${donutId}`)
            .then(response => response.json())
    }

}

//show data in dropdown list

const Dropdown = {
    makeTypesDropDown: () => {
        API.getTypes().then(allTypes => {
            const typeDropdown = document.querySelector("#type-dropdown")
            allTypes.forEach(type => {
                typeDropdown.innerHTML += `<option id="type-${type.id}">${type.name}</option>`
            });
        })
    },

    makeFlavorsDropDown: () => {
        API.getFlavors().then(allFlavors => {
            const flavorDropdown = document.querySelector("#flavor-dropdown")
            allFlavors.forEach(flavor => {
                flavorDropdown.innerHTML += `<option id="flavor-${flavor.id}">${flavor.name}</option>`
            })
        })
    },

    makeGlazesDropDown: () => {
        API.getGlazes().then(allGlazes => {
            const glazeDropdown = document.querySelector("#glaze-dropdown")
            allGlazes.forEach(glaze => {
                glazeDropdown.innerHTML += `<option id="glaze-${glaze.id}">${glaze.name}</option>`
            })
        })
    },

    makeToppingsDropDown: () => {
        API.getToppings().then(allToppings => {
            const toppingDropdown = document.querySelector("#topping-dropdown")
            allToppings.forEach(topping => {
                toppingDropdown.innerHTML += `<option id="topping-${topping.id}">${topping.name}</option>`
            })
        })
    }

}
/* Invoke Dropdown function */
Dropdown.makeTypesDropDown();
Dropdown.makeFlavorsDropDown();
Dropdown.makeGlazesDropDown();
Dropdown.makeToppingsDropDown();
/* Show the results on page load */
API.getDonuts().then((allDonuts) => {
    allDonuts.forEach(donut => {
    addDonutToDOM(donut)
    })
})

// Function that builds the donut
const createNewDonut = (name, type, flavor, glaze, topping) => {
    const newDonut = {
        name: name,
        type: type,
        flavor: flavor,
        glaze: glaze,
        topping: topping
    }
    return newDonut
}

//event listener for creating new donut button

document.querySelector("#donut-btn").addEventListener("click", () => {
//1. needs to get the values from the inputs
    const name = document.querySelector("#name-input").value
    const type = document.querySelector("#type-dropdown").value
    const flavor = document.querySelector("#flavor-dropdown").value
    const glaze = document.querySelector("#glaze-dropdown").value
    const toppings = document.querySelector("#topping-dropdown").value

//2. needs to build a object
const newDonutObj = createNewDonut(name, type, flavor, glaze, toppings)


//3. maybe clear inputs?
document.querySelector("#name-input").value = "";

//4. clear donut-container before adding new donut
document.querySelector("#donut-results").innerHTML = "";

//5. I need to save donut to the json
 API.createDonut(newDonutObj).then(() => {

//6. get all the donuts again
API.getDonuts().then((allDonuts) => {
    allDonuts.forEach(donut => {
//7. needs to send donut to DOM
        addDonutToDOM(donut)
    })
})
})

})

/*
    Responsible for putting our donuts on the DOM
*/

const addDonutToDOM = (donutObj) => {
    document.querySelector("#donut-results").innerHTML += donutHTML(donutObj)
}

/*
    It represents what a donut should look like in HTML
*/

const donutHTML = (donut) => {
    return `
    <div class="donut">
        <h3>${donut.name}</h3>
        <h4>Donut Type:</h4>
        <p>${donut.type}</p>
        <h4>Donut Flavor:</h4>
        <p>${donut.flavor}</p>
        <h4>Donut Glaze:</h4>
        <p>${donut.glaze}</p>
        <h4>Donut Topping:</h4>
        <p>${donut.topping}</p>
        <button type="button" id="deleteDonut--${donut.id}">
            Delete Donut
        </button>
        <button type="button" id="editDonut--${donut.id}">
            Edit Donut
        </button>
    </div>
    `
}

/*
Listen for delete buttons and then get the id value of the donut from the button id.
*/
const resultsContainer = document.querySelector("#donut-results").addEventListener("click", (event) => {
    if (event.target.id.startsWith("deleteDonut--")) {
        // Extract donut id from the button's id attribute
        console.log(event, event.target.id.split("--")[1])
        document.querySelector("#donut-results").innerHTML = "";
        API.deleteDonut(event.target.id.split("--")[1])
            .then(response => {
                // 4. clear donut-container before adding new donut
                // 6. get all the donuts again
                API.getDonuts().then((allDonuts) => {
                    allDonuts.forEach(donut => {
                        // 7. needs to send donut to DOM
                        addDonutToDOM(donut)
                    })
                })
            })
    }
    else if (event.target.id.startsWith("editDonut")) {
        editForm(event.target.id.split("--")[1])
    }
})

const editForm = (donutId) => {
    const hiddenDonutId = document.querySelector("#donutId")
    const editDonutName = document.querySelector("#donutName")

    API.getSingle(donutId)
    .then(response => {
        hiddenDonutId.value = donutId;
        editDonutName.value = response.name;
    })
}







