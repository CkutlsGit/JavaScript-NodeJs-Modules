require('dotenv').config()

const express = require('express')
const app = express()
// const articles = [{title: 'example'}]
const Article = require('./db').Article
const bodyParser = require('body-parser')
const Readability = require('node-readability')


app.set('port', process.env.PORT || 3001)

app.use(bodyParser.json())
app.use(bodyParser.urlencoded( { extended: true } ))

app.get('/articles', (req, res, next) => {
    Article.all((err, articles) => {
        if(err) return next(err)
        
        res.format({
            html: () => {
                res.render('articles.ejs', {articles: articles})
            },
            json: () => {
                res.send(articles)
            }
        })
    })
})

app.post('/articles', (req, res, next) => {
    const url = req.body.url
    Readability.read(url, (err, result) => {
        if(err || !result) res.status(500).send('Error')
        Article.create(
            {title: result.title, content: result.content},
            (err, article) => {
                if(err) return next(err)
                res.send('ok')
            }
        )
    })
})

 

app.delete('/articles/:id', (req, res, next) => {
    const id = req.params.id
    Article.delete(id, (err) => {
        if(err) return next(err)
        res.send({ message: 'Deleted' })
    })
})

app.listen(app.get('port'), () => {
    console.log('http://localhost:%s', app.get('port'))
})

module.exports = app



