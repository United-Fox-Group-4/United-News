const { User } = require('../models/index')
const { comparePass } = require('../helpers/bcrypt')
const { signToken } = require('../helpers/jwt')
const axios = require("axios");

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
}

module.exports = UserController