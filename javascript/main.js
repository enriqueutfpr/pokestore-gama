const maxElementsPage = 15;
const randomPokemonQtt = 105;

let allPokemon = [];
let selectedPokemons = [];

async function getdata(number,name) {

    let url = ""

    if(number!=undefined && name==undefined)
    {
        url = `https://pokeapi.co/api/v2/pokemon/${number}`;
    } else if (number==undefined && name!=undefined)
    {
        url = `https://pokeapi.co/api/v2/pokemon/${name}`;
    }

    
    let res = (await fetch(url)).json().then(data => {
        let dataArray = Object.entries(data);
        let name;
        let type1;
        let type2;

        dataArray.map(element=>{

            switch(element[0]){
                case "name":
                    name = element[1];
                    break;
                case "types":
                    if(element[1].length == 1)
                    {
                        type1 = element[1][0].type.name; 
                    } else if (element[1].length > 1)
                    {
                        type1 = element[1][0].type.name;
                        type2 = element[1][1].type.name;
                    }
                    break;
            }
           
        });

        name = name.charAt(0).toUpperCase() + name.slice(1)

       storagePokemon(name,type1,type2,number);

    }).catch(error => {
            console.error(`Erro inesperado:${error}`)
        });
}


function addPokemon(name, number, type1, type2) {
    const price = Math.floor((Math.random() * 1000) + 1);

    const cardType1 = `<h6 class="background-type type-${type1}">${type1}</h6>`
    let cardType2;

    if(type2==undefined)
    {
        cardType2 = `<h6 style="margin-bottom:1.022rem"><br></h6>`
    }else
    {
        cardType2 = `<h6 class="background-type type-${type2}">${type2}</h6>`
    }
    


    let mainContent = document.getElementById("main-content");
    mainContent.innerHTML += `

    <div class="col-12 col-sm-12 col-md-4 small-screen-align mt-4">
        <div class="card h-100" >
                <div class="p-4">
                    <img class="card-img-top" src="https://pokeres.bastionbot.org/images/pokemon/${number}.png" style="border-bottom:1px solid #d9d9d9">
                </div>
                <div class="card-body text-center" id="pokemon${number}">

                    <h5 id="name${number}" style="overflow-x:hidden;">${name}</h5>

                    <div class="w-100 d-flex flex-column justify-content-center align-items-center mt-2">
                        <div d-flex flex-column w-100>
                            ${cardType1}
                            ${cardType2}
                        </div>
                    </div>

                    <div class="w-100 d-flex flex-row justify-content-center align-items-center mt-2"> 
                         <h7>Preço: </h7>
                         <h7 id="price${number}">R$${price}</h7>
                    </div>

                    <div class="w-100 d-flex flex-row justify-content-center align-items-center mt-2"> 
                        <h7>Quantidade: </h7>
                        <input type="text" class="form-control qtt-text h-50 ml-1" id="qtt${number}">
                    </div>

                    <div class="mt-5 w-100 d-flex justify-content-center ">
                        <button type="button" onclick="appendToCart(${number})" class=" w-100 choose-custom p-2" value="${number}">Selecionar</button>
                    </div>

                </div>
            </div>
    </div>`;

}


function createRandomPokemon(qtt)
{
    let pokenumber = [];
    for(let i=0;i<qtt;i++)
    {
        pokenumber[pokenumber.length] = Math.floor((Math.random() * 690))
        getdata(pokenumber[i]);
    }
}

function insertInPage(qtt,pageNumber)
{
    pageNumber == undefined?pageNumber=1:pageNumber;

    let pokemonObteined;
    for(let i=(pageNumber-1)*maxElementsPage;i<qtt+((pageNumber-1)*maxElementsPage);i++)
    {   
        pokemonObteined = window.localStorage.key(i);
        addPokemon(
            JSON.parse(window.localStorage.getItem(pokemonObteined)).name,
            JSON.parse(window.localStorage.getItem(pokemonObteined)).number,
            JSON.parse(window.localStorage.getItem(pokemonObteined)).type1,
            JSON.parse(window.localStorage.getItem(pokemonObteined)).type2
        )
    }
}

function storagePokemon(name,type1,type2,number){

    let pokemon = {
        'name':name,
        'type1':type1,
        'type2':type2,
        'number':number
    }

    window.localStorage.setItem(`pokemon${number}`, JSON.stringify(pokemon));
}

function getAllPokemon()
{
    for(let pos = 0; pos < randomPokemonQtt;pos++)
    {
        allPokemon.push(JSON.parse(window.localStorage.getItem(window.localStorage.key(pos))));
    }
}


function clearAllDb()
{
    window.localStorage.clear();
}

function setActive(element)
{
    let currentActive = document.getElementsByClassName("active");
    currentActive[0].classList.remove("active");
    element.classList.add("active"); 
    actualizePage(element.textContent);
}

function clearPage()
{
    let mainContent = document.getElementById("main-content");
    mainContent.innerHTML = '';
}


function actualizePage(pageNumber)
{
    let elements=[];
    for(let pos = 0; pos < randomPokemonQtt; pos++)
    {
        elements.push(window.localStorage.key(pos));
    }
    clearPage();
    insertInPage(maxElementsPage,pageNumber);
}


function search()
{
    let pokename = "";
    let type1 = 'null';
    let type2 = 'null';
    
    if(screen.width<=768)
    {
        pokename = document.getElementById('pokename2').value;
        type1 = document.getElementById('input-type3').value;
        type2 = document.getElementById('input-type4').value;

    } else if(screen.width>768)
    {
        pokename = document.getElementById('pokename').value;
        type1 = document.getElementById('input-type1').value;
        type2 = document.getElementById('input-type2').value;
    }


    if(pokename != "" && type1=='null' && type2=='null')
    {
        for(let pos = 0; pos < randomPokemonQtt;pos++)
        {
            if(allPokemon[pos]!= null)
            {

                if(allPokemon[pos].name == pokename)
                {
                    selectedPokemons.push(allPokemon[pos]);
                }
            }
        }
    } else if ((pokename == "") && (type1!='null') && (type2=='null'))

    {
        for(let pos = 0; pos < randomPokemonQtt;pos++)
        {
            if(allPokemon[pos]!= null)
            {

                if(allPokemon[pos].type1 == type1 || allPokemon[pos].type2 == type1)
                {
                    selectedPokemons.push(allPokemon[pos]);
                }
            }
        }
    } else if ((pokename == "") && (type1!='null') && (type2!='null'))
    
    {
        for(let pos = 0; pos < randomPokemonQtt;pos++)
        {
            if(allPokemon[pos]!= null)
            {

                if((allPokemon[pos].type1 == type1 || allPokemon[pos].type1 == type2) && (allPokemon[pos].type2 == type2 || allPokemon[pos].type2==type1))
                {
                    selectedPokemons.push(allPokemon[pos]);
                }
            }   
        }
    }


    clearPage();
    for(let pos = 0; pos < selectedPokemons.length;pos++)
    {
        addPokemon(
            selectedPokemons[pos].name,
            selectedPokemons[pos].number,
            selectedPokemons[pos].type1,
            selectedPokemons[pos].type2
        )
    }

    selectedPokemons= [];
}

function appendToCart(number)
{

    let price = document.getElementById(`price${number}`).textContent;
    price = price.slice(2,price.length);
    let qtt = document.getElementById(`qtt${number}`).value
    qtt == ""?qtt=1:qtt;
    let name = document.getElementById(`name${number}`).textContent;

    let cart = document.getElementById('cartTable');
    cart.innerHTML += `

    <tr id="cartRow${number}">
        <th scope="row">
            <button type="button" class="btn btn-secondary px-1 py-0 mx-0 choose-custom" onclick="removeRow(cartRow${number})">X</button>
        </th>
        <th>
            ${name}
        </th>
        <td>${price},00</td>
        <td>${qtt}</td>
    </tr>
    `;
}

function removeRow(element)
{
    element.remove();
}

function main()
{ 
    createRandomPokemon(randomPokemonQtt);
    insertInPage(maxElementsPage);
    getAllPokemon();
    clearAllDb();
}



main();

