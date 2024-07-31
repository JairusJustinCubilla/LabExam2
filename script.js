// Replace 'YOUR_API_KEY' with your actual API key from News API
const apiKey = '8aa46693b9ed49f08d8ec37c16fec375';
const apiUrlBase = 'https://newsapi.org/v2/top-headlines?country=';

// Default country and category
const defaultCountry = 'us';
const defaultCategory = '';

document.addEventListener('DOMContentLoaded', function() {
    // Fetch news based on the default selected country and category
    fetchNews(defaultCountry, defaultCategory);

    // Add event listener for country selection change
    document.getElementById('country-select').addEventListener('change', function() {
        const selectedCountry = this.value;
        const selectedCategory = document.getElementById('category-select').value;
        fetchNews(selectedCountry, selectedCategory);
    });

    // Add event listener for category selection change
    document.getElementById('category-select').addEventListener('change', function() {
        const selectedCategory = this.value;
        const selectedCountry = document.getElementById('country-select').value;
        fetchNews(selectedCountry, selectedCategory);
    });
});

function fetchNews(countryCode, category) {
    let apiUrl = `${apiUrlBase}${countryCode}&apiKey=${apiKey}`;
    if (category) {
        apiUrl += `&category=${category}`;
    }
    console.log('Fetching news from:', apiUrl);

    fetch(apiUrl)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok ' + response.statusText);
            }
            return response.json();
        })
        .then(data => {
            // Check if data.articles is an array
            if (!Array.isArray(data.articles)) {
                throw new Error('API response does not contain articles array.');
            }

            // Display articles
            displayArticles(data.articles);
        })
        .catch(error => {
            console.error('Error fetching news:', error);
            displayNoArticlesMessage();
        });
}

function displayArticles(articles) {
    const newsContainer = document.getElementById('news');
    newsContainer.innerHTML = ''; // Clear any previous news
    const defaultImage = 'default_image.jpg'; // Path to default image

    if (articles.length === 0) {
        displayNoArticlesMessage();
        return;
    }

    // Set the featured article (the first article)
    displayFeaturedArticle(articles[0]);

    // Remove the featured article from the array
    const regularArticles = articles.slice(1);

    // Display regular articles
    regularArticles.forEach(article => {
        const newsCol = document.createElement('div');
        newsCol.className = 'col-md-12 mb-4';

        const newsCard = document.createElement('div');
        newsCard.className = 'card';

        // Add image
        const newsImg = document.createElement('img');
        newsImg.className = 'card-img-top';
        newsImg.src = article.urlToImage || defaultImage;
        newsImg.alt = article.title || 'No image available';
        newsCard.appendChild(newsImg);

        const cardBody = document.createElement('div');
        cardBody.className = 'card-body';

        const newsTitle = document.createElement('h5');
        newsTitle.className = 'card-title';
        newsTitle.textContent = article.title || 'No Title Available';
        cardBody.appendChild(newsTitle);

        const newsDescription = document.createElement('p');
        newsDescription.className = 'card-text';
        newsDescription.textContent = article.description || '';
        cardBody.appendChild(newsDescription);

        const newsLink = document.createElement('a');
        newsLink.className = 'btn btn-primary';
        newsLink.href = article.url || '#';
        newsLink.textContent = 'Read More';
        newsLink.target = '_blank';
        cardBody.appendChild(newsLink);

        newsCard.appendChild(cardBody);
        newsCol.appendChild(newsCard);
        newsContainer.appendChild(newsCol);
    });
}

function displayFeaturedArticle(article) {
    const defaultImage = 'default_image.jpg'; // Path to default image
    document.getElementById('featured-img').src = article.urlToImage || defaultImage;
    document.getElementById('featured-title').textContent = article.title || 'No Title Available';
    document.getElementById('featured-description').textContent = article.description || '';
    document.getElementById('featured-link').href = article.url || '#';
    document.getElementById('featured-link').textContent = 'Read More';
}

function displayNoArticlesMessage() {
    const newsContainer = document.getElementById('news');
    newsContainer.innerHTML = '<p class="text-center">No news articles available.</p>';
}
