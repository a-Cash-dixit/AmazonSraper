const axios = require("axios");
const jsdom = require("jsdom");
const { JSDOM } = jsdom;
const getProductUrl=(product_id)=>`https://www.amazon.com/gp/product/ajax/ref=dp_aod_ALL_mbc?asin=${product_id}&m=&qid=1664355552&smid=&sourcecustomerorglistid=&sourcecustomerorglistitemid=&sr=8-2&pc=dp&experienceId=aodAjaxMain`;
async function getPrices(product_id) {
    const productUrl = getProductUrl(product_id);
    const  {data}  = await axios.get(productUrl,{
        Headers:{
            pragma: "no-cache",
            accept: "text/html",
            "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/105.0.0.0 Safari/537.36",
            host: "www.amazon.com"
        }
    });
    const dom = new JSDOM(data);
    const $=(selector)=>dom.window.document.querySelector(selector);
    const pinnedelement=$("#pinned-de-id");
    const title=$("#aod-asin-title-text").textContent.trim();
    const listelement=$("#aod-offer-list");
    const offerelements=listelement.querySelectorAll(".aod-information-block");
    let offers=[];
    const getOffer=(element)=>{
        if(element.querySelector(".a-price .a-offscreen")==null){
            return ;
        }
        const price=element.querySelector(".a-price .a-offscreen").textContent;
        const shipsFrom=element.querySelector("#aod-offer-shipsFrom .a-col-right .a-size-small").textContent;
        const soldBy=element.querySelector("#aod-offer-soldBy .a-col-right .a-size-small").textContent;
        return {
            price,
            shipsFrom,
            soldBy
        };
    }
    offerelements.forEach((element) => {
        offers.push(getOffer(element));
    });
    const result={
        title:title,
        pinned:getOffer(pinnedelement),
        offers:offers
    }
    console.log(result);
}
getPrices("B0743VZKYV");
//getPrices("B07DBL9TM7");
//getPrices("B07MJKKS5T");
//getPrices("B0002E4Z8M");
//getPrices("B08G7RG9ML");
