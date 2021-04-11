require("chromedriver");
const fs = require("fs");
let wd = require("selenium-webdriver");
let chrome = require("selenium-webdriver/chrome");
let browser = new wd.Builder().forBrowser('chrome').build();
let moviesData = [];

async function getDataOfMovies(url,i,totalLength,name){
    let browser = new wd.Builder().forBrowser('chrome').setChromeOptions(new chrome.Options().headless()).build();

    await browser.get(url);
    
    await browser.wait(wd.until.elementLocated(wd.By.css("table")));
    let tables = await browser.findElements(wd.By.css("table"));
    let rows = await tables[0].findElements(wd.By.css("tbody tr"));
    // console.log(name);
    for(row in rows){
        if(row == 16){
            break;
        }
        let columns = await rows[row].findElements(wd.By.css("td"));
        moviesData[0] = row;
        for(let i = 1;i<columns.length-2;i++){
            moviesData[i] = await columns[i].getAttribute("innerText");         
        }
        
        await console.log(moviesData);
        fs.writeFileSync("list.json",JSON.stringify(moviesData));
    }
    
}

async function main(){
    await browser.get("https://www.imdb.com/");
    await browser.wait(wd.until.elementLocated(wd.By.css(".ipc-icon.ipc-icon--menu.ipc-button__icon.ipc-button__icon--pre")));
    let menuButton = await browser.findElement(wd.By.css(".ipc-icon.ipc-icon--menu.ipc-button__icon.ipc-button__icon--pre"));
    await menuButton.click();

    await browser.wait(wd.until.elementLocated(wd.By.css(".ipc-list__item.nav-link.NavLink-sc-19k0khm-0.dvLykY.ipc-list__item--indent-one")));
    let links = await browser.findElements(wd.By.css(".ipc-list__item.nav-link.NavLink-sc-19k0khm-0.dvLykY.ipc-list__item--indent-one"));

    let data = [];
    let dataName = [];
    for(let i=0;i<links.length;i++){
        data[i] = await links[i].getAttribute("href"); 
        dataName[i] = await links[i].getAttribute("innerText");
    }

    // console.log(data);
    for(i in data){
        // || i == 15 || i == 16
        if(i == 2 || i == 3 || i == 15){
            await console.log(dataName[i]);
            await getDataOfMovies(data[i],i,data.length,dataName[i]);
        }else{
            continue;
        }
    }
    // fs.writeFileSync("list.json",JSON.stringify(moviesData));
    await browser.close();
}

main();

