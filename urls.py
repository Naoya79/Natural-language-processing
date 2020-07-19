from controllers import api
from controllers import Index, Segmenter, Similarity_calculator, Parser, Extract_evaluation

api.add_route("/", Index)
api.add_route("/segmenter", Segmenter)
api.add_route("/similarity_calculator", Similarity_calculator)
api.add_route("/parser", Parser)
api.add_route("/extract_evaluation", Extract_evaluation)
