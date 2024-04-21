from sentence_transformers import SentenceTransformer, util
model = SentenceTransformer("all-distilroberta-v1") 
precomputed = {}

def receive_groupings(newtab):
    if(newtab in precomputed):
        return precomputed[newtab]
    embedding = model.encode(sentences = newtab)
    precomputed[newtab] = embedding
    return embedding


