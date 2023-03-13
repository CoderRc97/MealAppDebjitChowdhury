// Making a favourite item list in the local storage if not exist
if (localStorage.getItem("favouriteList") == null) {
    localStorage.setItem("favouriteList", JSON.stringify([]));
}
//fetching data from API function
async function fetchMeals(url,value) {
    const response=await fetch(`${url+value}`);
    const meals=await response.json();
    return meals;
}
//Showing the retrieved data from API
function getMealList(){
    let input=document.getElementById("my-search").value;
    console.log(input);
    let arr=JSON.parse(localStorage.getItem("favouriteList"));
    let url="https://www.themealdb.com/api/json/v1/1/search.php?s=";
    let html="";
    let list=fetchMeals(url,input);
    
    list.then(data=>{
        console.log(data.meals)
        if(data.meals){
            data.meals.forEach(element => {
                let fav=false;
                for (let index = 0; index < arr.length; index++) {
                    if(arr[index]==element.idMeal){
                        fav=true;
                    }
                }
                if(fav)
                {
                    html+=`
                     <div class="card mb-5 bg-success p-3" style="width: 18rem;">
                    <img src="${element.strMealThumb}" class="card-img-top" alt="...">
                    <div class="card-body">
                      <h5 class="card-title mb-5 text-center">${element.strMeal}</h5>
                      <div class="d-flex justify-content-around">
                        <a href="#" class="btn btn-primary" id="more-details" onclick="getMealDetails(${element.idMeal})">Meal Details</a>
                        <button class="btn btn-outline-light active" style="border-radius:50%" onclick="addRemoveToFavList(${element.idMeal})"><i class="fa-solid fa-heart"></i></button>
                      </div>
                  </div>
                  </div>
                    `;
                }else{
                    html+=`
                    <div class="card bg-danger mb-5 p-3" style="width: 18rem;">
                    <img src="${element.strMealThumb}" class="card-img-top" alt="...">
                    <div class="card-body">
                      <h5 class="card-title mb-5 text-center">${element.strMeal}</h5>
                      <div class="d-flex justify-content-around">
                        <a href="#" class="btn btn-primary" onclick="getMealDetails(${element.idMeal})">Meal Details</a>
                        <button  class="btn btn-outline-light" style="border-radius:50%" onclick="addRemoveToFavList(${element.idMeal})"><i class="fa-solid fa-heart"></i></button>
                      </div>
                  </div>
                  </div>
                    `;
                }
            });
        }
        else{
            html+=`
            <div class="meal-not-found">
              <h1>Meal Not Found</h1>
            </div>
            `;
        }
        document.getElementById('search-list').innerHTML=html;
    });
}

//Showing the result of meal details retrieved from API
async function getMealDetails(id){
    let url="https://www.themealdb.com/api/json/v1/1/lookup.php?i=";
    let html="";
    

    await fetchMeals(url,id).then(data=>{
        html += `
        <div class="meal-details d-flex justify-content-center flex-column align-items-center p-4">
        <img src="${data.meals[0].strMealThumb}" class="mb-3 mt-3" alt="...">
        
        <div class="meal-name mb-1">
          <h3>${data.meals[0].strMeal}</h3> 
        </div>
        <div class="meal-category mb-1">
          <p>Category: ${data.meals[0].strCategory}</p>
        </div>
        <div class="meal-origin mb-3">
          <p>Area:${data.meals[0].strArea}</p>
        </div>
        <div class="meal-instruction d-flex justify-content-center align-items-center flex-column">
          <h3 class="mb-3">Instructions:</h3>
          <p>${data.meals[0].strInstructions}</p>
        </div>
    </div>
        `;
    });
    document.getElementById("details").innerHTML=html;
    
   
}
//Showing the favourite items added by the user in their favourite list
async function showFavMealList() {
    let arr=JSON.parse(localStorage.getItem("favouriteList"));
    let url="https://www.themealdb.com/api/json/v1/1/lookup.php?i=";
    let html="";
    
    if (arr.length==0) {
        html += `
            <div class="page-wrap d-flex flex-row align-items-center">
                <div class="container">
                    <div class="row justify-content-center">
                        <div class="col-md-12 text-center">
                            
                            <div class="mb-4 lead">
                                Please add your Favourite Meal
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            `;
    } else {
        for (let index = 0; index < arr.length; index++) {
            await fetchMeals(url,arr[index]).then(data=>{
                html += `
                
                <div class="card bg-success mb-3 p-3" style="width: 19rem;">
                    <img src="${data.meals[0].strMealThumb}" class="card-img-top" alt="...">
                    <div class="card-body">
                        <h5 class="card-title mb-5 text-center">${data.meals[0].strMeal}</h5>
                        <div class="d-flex justify-content-around mt-5">
                            <button type="button" class="btn btn-outline-light" onclick="getMealDetails(${data.meals[0].idMeal})">More Details</button>
                            <button id="main${data.meals[0].idMeal}" class="btn btn-outline-light active" onclick="addRemoveToFavList(${data.meals[0].idMeal})" style="border-radius:50%"><i class="fa-solid fa-heart"></i></button>
                        </div>
                    </div>
                </div>
                `;
            });   
        }
    }
    document.getElementById("favourites").innerHTML=html;
}
//Adding or removing items from favourite list
function addRemoveToFavList(id) {
    let arr=JSON.parse(localStorage.getItem("favouriteList"));
    let contain=false;
    for (let index = 0; index < arr.length; index++) {
        if (id==arr[index]) {
            contain=true;
        }
    }
    if (contain) {
        let number = arr.indexOf(id);
        arr.splice(number, 1);
       
    } else {
        arr.push(id);
       
    }
    localStorage.setItem("favouriteList",JSON.stringify(arr));
    getMealList();
    showFavMealList();
}
