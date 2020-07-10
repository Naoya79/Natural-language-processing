from controllers import api
from controllers import Index, Segmenter, Similarity_calculator, Parser

api.add_route("/", Index)
api.add_route("/segmenter", Segmenter)
api.add_route("/similarity_calculator", Similarity_calculator)
api.add_route("/parser", Parser)
