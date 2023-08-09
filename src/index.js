// write your code here!
//Constants
const url = " http://localhost:3000/ducks"
const duckNav = document.querySelector("#duck-nav")
const duckDisplayName = document.querySelector("#duck-display-name")
const duckDisplayImage = document.querySelector("#duck-display-image")
const duckDisplayBtn = document.querySelector("#duck-display-likes")
const newDuckForm = document.querySelector("#new-duck-form")
let curDuck = {}

//Functions
function renderDuck(duckObj){
    const image = document.createElement("img")
        
    image.src = duckObj.img_url
    duckNav.append(image)

    image.addEventListener("click", e => {
        duckDisplayName.textContent = duckObj.name
        duckDisplayImage.src = duckObj.img_url
        duckDisplayBtn.textContent = `${duckObj.likes} likes`
        curDuck = duckObj
    })
}

//Initial fetch GET and populate page
fetch(`${url}`)
.then(res => res.json())
.then(data => {
    //renders first duck in duck-display
    duckDisplayName.textContent = data[0].name
    duckDisplayImage.src = data[0].img_url
    duckDisplayBtn.textContent = `${data[0].likes} likes`
    curDuck = data[0]

    //Populates nav bar with ducks
    data.forEach(duckObj => renderDuck(duckObj))
})
.catch(err => alert("There was an error loading the page! Please try again later"))


//Update likes when clicked
duckDisplayBtn.addEventListener("click", (e) => {
    let currentLikesString = duckDisplayBtn.textContent
    let likesString = currentLikesString.replace(" likes", "")
    let likesNumber = Number(likesString)
    let newLikes = likesNumber + 1
    

    fetch(`${url}/${curDuck.id}`, {
        method: "PATCH",
        headers: {
            "content-type" : "application/json",
            "accept" : "application/json"
        },
        body: JSON.stringify({likes: newLikes})
    })
    .then(res => res.json())
    .then(data => {
        duckDisplayBtn.textContent = `${data.likes} likes`
        curDuck.likes = data.likes
    })
    .catch(err => alert("There was an error with your like!"))

})


//Add new duck with form sumbit
newDuckForm.addEventListener("submit", e => {
    e.preventDefault()

    const newDuck = {
        name: e.target["duck-name-input"].value,
        img_url: e.target["duck-image-input"].value,
        likes: 0
    }

    fetch(`${url}`, {
        method: "POST",
        headers: {
            "content-type" : "application/json",
            "accept" : "application/json"
        },
        body: JSON.stringify(newDuck)
    })
    .then(res => res.json())
    .then(data => renderDuck(data))
    .catch(err => alert("There was an error saving your new duck! Please try again later."))
})