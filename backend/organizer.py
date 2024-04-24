from sentence_transformers import SentenceTransformer, util
from sklearn.cluster import AgglomerativeClustering
import numpy as np
model = SentenceTransformer("all-MiniLM-L12-v2") 

precomputed = {}
def receive_embeddings(newtab):
    ans = list(range(len(newtab)))
    uncalculated = []
    uncalculatedtabs = []
    for idx in ans:
        if(newtab[idx] in precomputed):
            ans[idx] = precomputed[newtab[idx]]
        else:
            uncalculated.append(idx)
            uncalculatedtabs.append(newtab[idx])
    embedding = model.encode(sentences = uncalculatedtabs)
    for idx in range(len(uncalculated)):
        ridx = uncalculated[idx]
        ans[ridx] = embedding[idx]
        precomputed[newtab[ridx]] = ans[ridx]
    return ans

def receive_groupings(embeddings, vagueness=1.40):
    if(len(embeddings) == 1):
        return np.array([0])
    clustering_model = AgglomerativeClustering(n_clusters=None, distance_threshold=vagueness)
    clustering_model.fit(embeddings)
    return clustering_model.labels_