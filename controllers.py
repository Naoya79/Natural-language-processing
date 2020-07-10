import responder

import models

api = responder.API()

class Index():
    async def on_get(self, req, resp):
        resp.content = api.template('index.html')


class Segmenter():
    async def on_get(self, req, resp):
        resp.content = api.template('segmenter.html')

    async def on_post(self, req, resp):
        data = await req.media()
        jsonData = models.segmenter(data)
        resp.media = jsonData


class Similarity_calculator():
    async def on_get(self, req, resp):
        resp.content = api.template('similarity_calculator.html')

    async def on_post(self, req, resp):
        data = await req.media()
        jsonData = models.similarity_calculator(data)
        resp.media = jsonData


class Parser():
    async def on_get(self, req, resp):
        resp.content = api.template('parser.html')

    async def on_post(self, req, resp):
        data = await req.media()
        jsonData = models.parser(data)
        resp.media = jsonData
