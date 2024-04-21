from sentence_transformers import SentenceTransformer, util
model = SentenceTransformer("all-distilroberta-v1") 
# perhaps v12 could also be better
# TODO: maybe fine train for tabs?
precomputed = {}

def receive_groupings(newtab):
    if(newtab in precomputed):
        return precomputed[newtab]
    embedding = model.encode(sentences = newtab)
    precomputed[newtab] = embedding
    return embedding


