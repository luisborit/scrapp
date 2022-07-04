const cheerio = require('cheerio')
const fetch = require('node-fetch')
const express = require('express')

const app = express()
app.use('/favicon.png', express.static('favicon.png'));

app.set('view engine', 'ejs');
const comercio = async () => {
    const pageResponse = await fetch('https://elcomercio.pe/ultimas-noticias/')
    let $ = cheerio.load(await pageResponse.text())
    const postArray = []
    $('.paginated-list--infinite')
    .find('div > div > div > .story-item__information-box')
    .each((index, element)=>{
        const title =  $(element).find("h2").text()
        const link = $(element).find("h2 > a").attr('href');
        postArray.push([title, `https://elcomercio.pe${link}`])
    })
    return postArray
}

const gestion = async () => {
    const pageResponse = await fetch('https://gestion.pe/ultimas-noticias/')
    let $ = cheerio.load(await pageResponse.text())
    const postArray = []
    $('.paginated-list--infinite')
    .find('div > div > div > .story-item__information-box')
    .each((index, element)=>{
        const title =  $(element).find("h2").text()
        const postBody = $(element).find("p").text();
        const link = $(element).find("h2 > a").attr('href');
        postArray.push([title, postBody, `https://gestion.pe${link}`])
    })
     return postArray
}

const republica = async () => {
    const pageResponse = await fetch('https://larepublica.pe/ultimas-noticias/')
    let $ = cheerio.load(await pageResponse.text())
    const postArray = []
    $('#internacontent > div > main > div > div > div > section')
    .find('.PostSection > div')
    .each((index, element)=>{
        console.log(element)
        const title =  $(element).find("ul > li > h2").text()
        const postBody = $(element).find("p").text();
        const link = $(element).find("h2 > a").attr('href');
        postArray.push([title, postBody, `https://larepublica.pe/ultimas-noticias${link}`])
    })
     return postArray
}

app.get('/', async (req, res) => {
    res.render('main',{
        'comercio': await comercio(),
        'gestion':await gestion(),
        'republica':await republica()
    })
})

app.listen(process.env.PORT || 5000,()=>{
    console.log('Running on 8080')
})