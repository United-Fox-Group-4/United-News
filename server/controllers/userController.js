const { User, NewsCollection } = require('../models/index')
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

    static async headline(req, res, next) {
        try {
            const results = []

            // NEWS API
            const data1 = await axios({
                method: "get",
                url: "https://newsapi.org/v2/top-headlines?country=id",
                headers: {Authorization: process.env.NEWS_API}
            })
            results.push({
                title: data1.data.articles[0].title,
                description: data1.data.articles[0].description,
                publishedAt: data1.data.articles[0].publishedAt.slice(0, 10),
                news_url: data1.data.articles[0].url
            })

            //currents api
            const data2 = await axios({
                method: "get",
                url: `https://api.currentsapi.services/v1/latest-news?apiKey=${process.env.CURRENTS_API}`
            })
            results.push({
                title: data2.data.news[0].title,
                description: data2.data.news[0].description,
                publishedAt: data2.data.news[0].published.slice(0, 10),
                news_url: data2.data.news[0].url
            })

            const data3 = await axios({
                    method: "get",
                    url: "https://newscatcher.p.rapidapi.com/v1/latest_headlines?lang=en&media=True",
                    headers: {
                        "x-rapidapi-host": "newscatcher.p.rapidapi.com",
                        "x-rapidapi-key": process.env.NEWS_CATCHER,
                        "useQueryString": true
                    }
                })
            results.push({
                title: data3.data.articles[0].title,
                description: data3.data.articles[0].summary,
                publishedAt: data3.data.articles[0].published_date.slice(0, 10),
                news_url: data3.data.articles[0].url
            })
            res.status(200).json(results)
        } catch(err) {
            next(err)
        }
    }

    static addNewsCollection(req, res, next) {
        const newsData = {
			title: req.body.title,
			description: req.body.description,
			publishedAt: req.body.publishedAt,
            news_url: req.body.news_url,
            tag: req.body.tag,
			UserId: req.userData.id,
		};

		NewsCollection.create(newsData)
			.then((data) => {
				res.status(201).json(data);
			})
			.catch((err) => {
				next(err);
			});
    }

    static getAllCollection(req, res, next) {
        NewsCollection.findAll({ where: { UserId: req.userData.id } })
			.then((data) => {
				res.status(200).json(data);
			})
			.catch((err) => {
				next(err);
			});
    }

    static getCollectionById(req, res, next) {
        NewsCollection.findOne({ where: { id: req.params.id } })
			.then((data) => {
				res.status(200).json(data);
			})
			.catch((err) => {
				next(err);
			});
    }

    static getCollectionByTag(req, res, next) {
        NewsCollection.findAll({ where: { tag: req.params.tag, UserId: req.userData.id} })
			.then((data) => {
				res.status(200).json(data);
			})
			.catch((err) => {
				next(err);
			});
    }

    static async changeTag(req, res, next) {
        try {
			const editBody = {
				tag: req.body.tag,
			};

			const isUpdateSuccess = await NewsCollection.update(editBody, {
				where: { id: +req.params.id },
			});

			if (!isUpdateSuccess[0]) {
				next({ name: "NotFound" });
			} else {
				res.status(200).json(await NewsCollection.findByPk(+req.params.id));
			}
		} catch (err) {
			next(err);
		}
    }

    static deleteNews(req, res, next) {
		NewsCollection.destroy({
			where: { id: +req.params.id },
		})
			.then((data) => {
				if (data) {
					res.status(200).json({ message: "News remove from collection" });
				} else {
					next({ name: "NotFound" });
				}
			})
			.catch((err) => {
				next(err);
			});
	}
}

module.exports = UserController