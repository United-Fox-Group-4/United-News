const { User } = require('../models/index')
const { comparePass } = require('../helpers/bcrypt')
const { signToken } = require('../helpers/jwt')
const axios = require('axios')

class UserController {
    static register(req, res, next) {
        const newUser = {
            fullname: req.body.fullname,
            email: req.body.email,
            password: req.body.password
        }
        User.create(newUser)
            .then(result => {
                return res.status(201).json({
                    id: result.id,
                    fullname: result.fullname,
                    email: result.email
                })
            })
            .catch(err => {
                return next(err)
            })
    }

    static login(req, res, next) {
        const userBody = {
            email: req.body.email,
            password: req.body.password,
        };

        User.findOne({ where: { email: userBody.email } })
            .then((data) => {
                if (data && comparePass(userBody.password, data.password)) {
                    const access_token = signToken({ id: data.id, email: data.email });
                    res.status(201).json({ id: data.id, email: data.email, access_token });
                } else {
                    res.status(401).json({ message: "Invalid email or password" });
                }
            })
            .catch((err) => {
                next(err);
            });
    }

    static searchNews(req, res, next) {
        axios({
                method: 'get',
                url: `https://newsapi.org/v2/top-headlines?country=id&apiKey=c93fa6b8756c4cfabd0f46e1c0ae1154`,
                params: {
                    q: req.body.title
                }
            })
            .then(result => {
                let data = result.data.articles
                let hasil
                data.forEach(element => {
                    hasil = element
                });
                return res.status(200).json({ title: hasil.title, description: hasil.description, publishedAt: hasil.publishedAt.slice(0, 10), news_url: hasil.url })
            })
            .catch(err => {
                return next(err)
            });

        axios({
                method: 'get',
                url: `https://api.currentsapi.services/v1/latest-news?apiKey=OLdwdqxBJ-aozEWpU7AU9XzHTVkRkNW1dfJVrc_3x9v-Wzdh`,
                params: {
                    q: req.body.title
                }
            })
            .then(result => {
                let data = result.data.news
                let hasil
                data.forEach(element => {
                    hasil = element
                });
                return res.status(200).json({ title: hasil.title, description: hasil.description, publishedAt: hasil.published.slice(0, 10), news_url: hasil.url })
            })
            .catch(err => {
                return next(err)
            });

        axios({
                method: 'get',
                url: `https://newscatcher.p.rapidapi.com/v1/aggregation?agg_by=day&from=2020%252F06%252F05&q=Apple`,
                headers: 'x-rapidapi-key: 93c1e02146msh32c9822a8c8f63bp106012jsnfd87de2b8b79'
            })
            .then(result => {
                let data = result.data.news
                let hasil
                data.forEach(element => {
                    hasil = element
                });
                return res.status(200).json({ title: hasil.title, description: hasil.description, publishedAt: hasil.published.slice(0, 10), news_url: hasil.url })
            })
            .catch(err => {
                return next(err)
            });
    }
}

module.exports = UserController