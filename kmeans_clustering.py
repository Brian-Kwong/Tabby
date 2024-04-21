# Step 1: Load the data
import pandas as pd
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.cluster import KMeans
from sklearn.metrics import silhouette_score
import numpy as np

import timeit
start = timeit.default_timer()
 
df = pd.read_csv("tabsinfo.csv")

# Step 2: Explore the data
df.info()

# Step 3: Data preprocessing
documents = df['overview'].values.astype("U")

vectorizer = TfidfVectorizer(stop_words='english')
features = vectorizer.fit_transform(documents)

# Determine the optimal number of clusters
max_clusters = len(df) // 2  # Adjust this as needed
silhouette_scores = []

for k in range(2, max_clusters + 1):
    model = KMeans(n_clusters=k, init='k-means++', max_iter=100, n_init=1)
    labels = model.fit_predict(features)
    silhouette_avg = silhouette_score(features, labels)
    silhouette_scores.append(silhouette_avg)

# Find the optimal number of clusters based on silhouette score
optimal_k = np.argmax(silhouette_scores) + 2  # Add 2 because we start from k=2
print("Optimal number of clusters:", optimal_k)

# Perform clustering with optimal number of clusters
model = KMeans(n_clusters=optimal_k, init='k-means++', max_iter=100, n_init=1)
model.fit(features)

df['cluster'] = model.labels_

# Store clustered words with corresponding titles
clustered_data = {}

for cluster in range(optimal_k):
    titles = df[df['cluster'] == cluster]['title'].tolist()
    clusters = df[df['cluster'] == cluster]['overview'].tolist()
    clustered_data[cluster] = {'titles': titles, 'overview': clusters}

# Output the result to a text file
# for cluster, data in clustered_data.items():
#     with open(f'cluster{cluster}.csv', 'w', encoding='utf-8') as f:
#         df_cluster = pd.DataFrame(data)
#         f.write(df_cluster.to_csv(index_label='id'))

print("Cluster centroids: \n")
order_centroids = model.cluster_centers_.argsort()[:, ::-1]
terms = vectorizer.get_feature_names_out()

for i in range(optimal_k):
    print("Cluster %d:" % i)
    print("Titles:")
    for title in clustered_data[i]['titles']:
        print(title)
    print("Top terms:")
    for j in order_centroids[i, :8]:  # print out 5 feature terms of each cluster
        print(' %s' % terms[j])
    print('------------')


stop = timeit.default_timer()
print('Time: ', stop - start) 