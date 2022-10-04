const formJS = document.querySelectorAll("form")[0];
//jQUERY === $
//const formJquery = jQuery("form").eq(0);
const formJquery = $("form").eq(0); //element Q
const inputJQ = $(".top-banner input").eq(0);
const msgJQ = $(".top-banner span").eq(0);
const listJQ = $(".cities").eq(0);

//console.log(formJS);
//console.log(formJquery);
//console.log(inputJQ);

// get(index) ==> toArray(get()) , eq(index) 

//load VS DOMContentLoaded
//DOMContentLoaded ==> means page rendered, DOM is ready
//window load ==> (all content (e.g. images, styles etc) also loaded)

//window.onload = () =>{} ===> JS
// addEventListener ===> on

$(window).on("load", ()=>{
    console.log("window.load");
});

// document.addEventListener("DOMContentLoaded", ()=>{}) ==> JS

// $(document).on("DOMContentLoaded", ()=>{
//     console.log("DOMContentLoaded");
// });

$(document).ready(()=>{
    console.log("DOMContentLoaded");
    localStorage.setItem("apiKey", EncryptStringAES("622f57458213d03f8b54d82a00fbcaa5"))
});

// formJquery.on("submit", (e)=>{
//     e.preventDefault();
//     getWeatherDataFromApi();
// });

formJquery.submit((e)=>{
    e.preventDefault();
    getWeatherDataFromApi();
});


const getWeatherDataFromApi = async() =>{
    // console.log("AJAX Func. is called");
    const apiKey = DecryptStringAES(localStorage.getItem("apiKey"));
    const cityName = inputJQ.val();
    console.log(cityName);

    const units = "metric";
    const lang = "tr";
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${apiKey}&units=${units}&lang=${lang}`;

    $.ajax({
        type : "GET",
        url : url,
        dataType : "json",
        success : (response) => {
            //main body func.
            console.log(response);

            const{main, sys, name, weather} = response;
            const iconUrlAWS = `https://s3-us-west-2.amazonaws.com/s.cdpn.io/162656/${weather[0].icon}.svg`;
            //alternative iconUrl
            const iconUrl = `https://openweathermap.org/img/wn/${weather[0].icon}@2x.png`;




            //weather card control
            const cityCardList = listJQ.find(".city");//jquery de query selector karşılığı
            const cityCardListArray = cityCardList.get();// array a çevirdim
            // console.log(cityCardList);
            if(cityCardListArray.length > 0){
               const filteredArray = cityCardListArray.
               filter(
                li => $(li).find("span").text() == name
                );//find kullanmak için $() kullandım.
                if(filteredArray.length > 0){
                    msgJQ.text(`You already know the weather for ${name}, Please search for another city `);
                    setTimeout(function(){
                        msgJQ.text("");
                    }, 3000);
                    
                    //styling
                    msgJQ.css({"color":"red", "text-decoration":"underline"});
                    formJquery.trigger("reset");
                    return;
                }
            }



            //js==> document.createElement("li")
            const createdLi = $("<li></li>");
            createdLi.addClass("city"); //js>>>innerHtml
            createdLi.html(`<h2 class="city-name" data-name="${name}, ${sys.country}">
            <span>${name}</span>
            <sup>${sys.country}</sup>
            </h2>
            <div class="city-temp">${Math.round(main.temp)}<sup>°C</sup></div>
            <figure>
            <img class="city-icon" src="${iconUrl}">
            <figcaption>${weather[0].description}</figcaption>
            </figure>`);
            listJQ.prepend(createdLi);  // başa eklemek için
            //formJS.reset();

            //?jquery samples
            //js forEach kullanıyorduk
            // $(".city img").click((e)=>{
                //getAttribute, setAttribute ==> attr
                // window.location.href = $(e.target).attr("src");
                // $(e.target).attr("src", iconUrlAWS);
            // });

                //?animation
            // $(".city").click((e)=>{
            //     $(e.target).animate({left: '250px' });
            // });

            //?jquery chining
            $(".city img").click((e)=>{
                $(e.target).slideUp(2000).slideDown(2000);
            });

            //? hide() ve show()
            // $(".city img").click((e)=>{
            //     $(e.target).hide();
            // });
            //!hatayı bul
            // $(".city ").click((e)=>{
            //     $(e.target.parentElement).find("img").show();
            // });

            formJquery.trigger("reset"); //trigerler prosedür veya func olarak kullanabiliyoruz..



        }, //işlemleri succeste yapıyoruz
        beforeSend : (request) => {
            //encription
            //request.header("...", "...");
            //token 
            console.log("before ajax send");
        }, //requeste birşey ekleyip post ediceksek
        comlete : () =>{
            console.log("after ajax send");
        },
        error : (XMLHttpRequest) =>{
            //logging
            //posterrorlog(p1, p2, p3, p4);
            

            console.log(XMLHttpRequest);
            msgJQ.text(`${XMLHttpRequest.status}${XMLHttpRequest.statusText}`);
            msgJQ.css({"color":"red", "text-decoration":"underline"});
            setTimeout(function(){
                msgJQ.text("");
            }, 3000);
            formJquery.trigger("reset");         
        }
    });





}

// XMLHTTPREQUEST(xhr) vs. fetch() vs. axios vs. $.ajax








