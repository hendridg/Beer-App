// variables
const urlBase = "https://api.punkapi.com/v2/beers?page="
const filterABV = document.getElementById("filterABV")
const filterIBU = document.getElementById("filterIBU")
const pageText = document.getElementById("pageNumber")
const prevPage = document.getElementById("prevPage")
const nextPage = document.getElementById("nextPage")
let optionsIBU = "",
  optionsABV = "",
  page = 1

// Create an async function called "getBeers" that uses fetch to get our beer data from the urlBase.
// Render each beer name inside the div with the class of beers that currently exists in the HTML file.

///filters

filterIBU.addEventListener("change", (e) => {
  const value = e.target.value
  console.log(value)
  switch (value) {
    case "all":
      optionsIBU = ""
      break
    case "weak":
      optionsIBU = "&ibu_lt=35"
      break
    case "medium":
      optionsIBU = "&ibu_gt=34&ibu_lt=75"
      break
    case "strong":
      optionsIBU = "&ibu_gt=74"
      break
  }
  page = 1
  getBeers()
})

filterABV.addEventListener("change", (e) => {
  const value = e.target.value

  switch (value) {
    case "all":
      optionsABV = ""
      break
    case "weak":
      optionsABV = "&abv_lt=4.6"
      break
    case "medium":
      optionsABV = "&abv_gt=4.5&abv_lt=7.6"
      break
    case "strong":
      optionsABV = "&abv_gt=7.5"
      break
  }
  page = 1
  getBeers()
})

async function getBeers() {
  const url = urlBase + page + optionsABV + optionsIBU
  //fetch
  const beerPromise = await fetch(url)
  let html = ""

  //en caso que la imagen no este en base de datos cargamos una imagen generica
  const botellaGenerica =
    "https://cdn.pixabay.com/photo/2014/12/22/00/04/bottle-576717_960_720.png"

  //Agregar el resto de los datos en el HTML template

  if (beerPromise.ok) {
    const beers = await beerPromise.json()
    pageText.innerHTML = page

    if (page === 1) {
      prevPage.disabled = true
    } else {
      prevPage.disabled = false
    }

    if (beers.length < 25) {
      nextPage.disabled = true
    } else {
      nextPage.disabled = false
    }
    console.log(beers[0])
    const beersDiv = document.querySelector(".beers")

    beers.forEach((beer) => {
      html += `
            <div class='beer-wrapper card'>
                <div class='beer'>
                    <img class='beer__img' src="${
                      beer.image_url ? beer.image_url : botellaGenerica
                    }">
                    <h3>${beer.name}</h3>
                    <span class='beer__info'>
                        <span>ABV: ${beer.abv}%</span>
                        <span>IBU: ${beer.ibu}</span>
                    </span>
                </div>
                <div class='beer__content'>
                    <div class='beer__name'>${beer.name}</div>
                    <div class='beer__tagline'>${beer.tagline}</div>
                    <div class='beer__description'>${beer.description}</div>
                    <div class='beer__food-pairing'>
                        Pair with: ${beer.food_pairing.join(", ")}
                    </div>
                </div>
            </div>
            `
    })
    //${beer.food_pairing.join(', ')} el .join es para estar en el array
    beersDiv.innerHTML = html
  } else {
    console.log(beerPromise.status)
  }
}

//paginacion

prevPage.addEventListener("click", () => {
  page--
  getBeers()
})

nextPage.addEventListener("click", () => {
  page++
  getBeers()
})

getBeers()
