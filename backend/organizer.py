from sentence_transformers import SentenceTransformer, util
model = SentenceTransformer("all-distilroberta-v1") 
# perhaps v12 could also be better
# TODO: maybe fine train for tabs?

def receive_groupings(newtab):
    embedding = model.encode(sentences = newtab)
    return embedding


