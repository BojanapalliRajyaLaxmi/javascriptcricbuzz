document.addEventListener("DOMContentLoaded", function () {
  let container = document.createElement("div");
  container.id = "container";
  document.body.appendChild(container);

  let upperbg = document.createElement("div");
  upperbg.id = "upperbg";
  container.appendChild(upperbg);

  let logo = document.createElement("img");
  logo.id = "navimg";
  logo.src = './image.png';
  logo.alt = "Logo";
  upperbg.appendChild(logo);

  let subContainer = document.createElement("div");
  subContainer.id = "subContainer";
  subContainer.innerHTML="Matches";
  container.appendChild(subContainer);

  let matchesWrapper = document.createElement("div");
  matchesWrapper.id = "matchesWrapper";
  subContainer.appendChild(matchesWrapper);

  let storiesWrapper = document.createElement("div");
  storiesWrapper.id = "storiesWrapper";
  subContainer.appendChild(storiesWrapper);

  let footer = document.createElement("div");
  footer.id = "footer";
  container.appendChild(footer);

  let navigation = document.createElement("div");
  navigation.className = "navigation";
  footer.appendChild(navigation);

  let ul = document.createElement("ul");
  navigation.appendChild(ul);

  const navItems = [
    { name: "Home", icon: "fa-solid fa-house", link: "./index.html" },
    { name: "Matches", icon: "fa-solid fa-baseball-bat-ball", link: "./match.html" },
    { name: "Videos", icon: "fa-solid fa-circle-play", link: "./video.html" },
    { name: "News", icon: "fa-solid fa-newspaper", link: "./news.html" },
    { name: "More", icon: "fa-solid fa-ellipsis-vertical", link: "./more.html" },
  ];
  navItems.forEach((item) => {
    let li = document.createElement("li");
    li.className = "list";

    let a = document.createElement("a");
    a.href = item.link;

    let iconSpan = document.createElement("span");
    iconSpan.className = "icon";
    iconSpan.innerHTML = `<i class="${item.icon}"></i>`;

    let textSpan = document.createElement("span");
    textSpan.className = "text";
    textSpan.textContent = item.name;

    a.appendChild(iconSpan);
    a.appendChild(textSpan);
    li.appendChild(a);
    ul.appendChild(li);
  });

  let storiesHead = document.createElement("p");
  storiesHead.innerHTML = "Top Stories";
  storiesWrapper.appendChild(storiesHead);

  async function fetchImage(imageId) {
    const url = `https://cricbuzz-cricket.p.rapidapi.com/img/v1/i1/c${imageId}/i.jpg`;
    const options = {
      method: 'GET',
      headers: {
        'x-rapidapi-key': '441edb6b75mshd2f9035327dd8b0p1e6bf0jsnd5d822dfa551',
        'x-rapidapi-host': 'cricbuzz-cricket.p.rapidapi.com'
      }
    };
    
  
    try {
      const response = await fetch(url, options);
      console.log('Fetch response status:', response.status);
  
      if (!response.ok) {
        console.error(`Failed to fetch image. Status: ${response.status}, StatusText: ${response.statusText}`);
        throw new Error(`HTTP error! status: ${response.status}`);
      }
  
      const blob = await response.blob();
      return URL.createObjectURL(blob);
    } catch (error) {
      console.error(`Error fetching image for imageId ${imageId}:`, error);
      return "https://via.placeholder.com/150"; // Fallback image
    }
  }
  async function Home() {
    try {
      const response = await fetch('./matches.json');
      const data = await response.json();
      localStorage.setItem("home",JSON.stringify(data.matches.list))
      // console.log(data.matches.list);
    } catch (error) {
      console.error("Error fetching data from JSON file:", error);
    }
  }
  Home();
  async function fetchMatchData() {
    let storedMatches = JSON.parse(localStorage.getItem("home"));
    if (!storedMatches) {
      console.error("No match data found in local storage.");
      return;
    }
  
    const matchesWrapper = document.getElementById('matchesWrapper'); // Ensure you have a container in your HTML
    for (const matchGroup of storedMatches["typeMatches"]) {
      for (const series of matchGroup["seriesMatches"]) {
        const seriesDetails = series["seriesAdWrapper"];
        if (seriesDetails) {
          for (const match of seriesDetails["matches"]) {
            const matchDetails = match["matchInfo"];
            const matchScore = match["matchScore"];
  
            if (matchDetails) {
              let matchCard = document.createElement("div");
              matchCard.className = "match-card";
  
              const matchDesc = matchDetails["matchDesc"] || "N/A";
              const seriesName = seriesDetails["seriesName"] || "N/A";
              const team1 = matchDetails["team1"]?.["teamName"] || "N/A";
              const team1ImageId = matchDetails["team1"]?.["imageId"] || "";
              const team1Score = matchScore ? formatScore(matchScore["team1Score"]) : "N/A";
              const team2 = matchDetails["team2"]?.["teamName"] || "N/A";
              const team2ImageId = matchDetails["team2"]?.["imageId"] || "";
              const team2Score = matchScore ? formatScore(matchScore["team2Score"]) : "N/A";
              const matchStatus = matchDetails["status"] || "N/A";
  
              const [team1ImageUrl, team2ImageUrl] = await Promise.all([
                team1ImageId ? fetchImage(team1ImageId) : "",
                team2ImageId ? fetchImage(team2ImageId) : ""
              ]);
  
              matchCard.innerHTML = `
                <div class="card">
                  <div class="match-card-header">
                      <p class="series-name">${seriesName}</p>
                      <p class="match-desc">${matchDesc}</p>
                  </div>
                  <div class="teams-info">
                      <div class="team">
                          <img src="${team1ImageUrl}" class="team-image" >
                          <p class="team-name">${team1}</p>
                          <p class="team-score">${team1Score}</p>
                      </div>
                      <div class="team">
                          <img src="${team2ImageUrl}" class="team-image" >
                          <p class="team-name">${team2}</p>
                          <p class="team-score">${team2Score}</p>
                      </div>
                  </div>
                  <div class="match-status">
                      <p>${matchStatus}</p>
                  </div>
                </div>`;
  
              matchesWrapper.appendChild(matchCard);
            }
          }
        }
      }
    }
  }
  
  

  async function fetchImage(imageId) {
    const url = `https://cricbuzz-cricket.p.rapidapi.com/img/v1/i1/c${imageId}/i.jpg`;
    const options = {
      method: 'GET',
      headers: {
        'x-rapidapi-key': '441edb6b75mshd2f9035327dd8b0p1e6bf0jsnd5d822dfa551',
        'x-rapidapi-host': 'cricbuzz-cricket.p.rapidapi.com'
      }
    };
  
    try {
      const response = await fetch(url, options);
      const blob = await response.blob();
      return URL.createObjectURL(blob);
    } catch (error) {
      console.error(`Error fetching image for imageId ${imageId}:`, error);
      return null;
    }
  }
  
  
  async function fetchAndRenderHomeStories() {
    let homeData = JSON.parse(localStorage.getItem("newsall"));
    let homeList = homeData["storyList"];
  
    for (const home of homeList) {
      if (home["story"] && home["story"]["hline"]) {
        let homeWrapper = document.createElement("div");
        homeWrapper.id = "homeWrapper";
  
        let homeTitle = document.createElement("p");
        homeTitle.id = "homeTitle";
        homeTitle.innerHTML = home["story"]["hline"];
  
        let homeImage = document.createElement("img");
        const imageUrl = await fetchImage(home["story"]["imageId"]);
        if (imageUrl) {
          homeImage.src = imageUrl;
          homeImage.id = "homeImage";
        }
  
        let homeDescription = document.createElement("p");
        homeDescription.id = "homeDescription";
        homeDescription.innerHTML = home["story"]["intro"];
  
        homeWrapper.appendChild(homeImage);
        homeWrapper.appendChild(homeTitle);
        homeWrapper.appendChild(homeDescription);
  
        storiesWrapper.appendChild(homeWrapper);
      }
    }
  }
  

  function formatScore(score) {
    if (score && typeof score === 'object') {
      const innings1 = score["inngs1"]?.runs || 0;
      const innings2 = score["inngs2"]?.runs || 0;
      return `${innings1} & ${innings2}`;
    }
    return score || "N/A";
  }

  fetchMatchData();
  fetchAndRenderHomeStories();
});


