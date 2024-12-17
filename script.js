class View {
  constructor() {
    this.app = document.getElementById("app");

    this.searchLine = this.createElement("div", "search-line");
    this.searchInput = this.createElement("input", "search-input");
    this.searchCounter = this.createElement("span", "counter");
    this.searchContainer = this.createElement("div");
    this.main = this.createElement("div", "main");
    this.repoMenu = this.createElement("div", "repo-menu");
    this.repoList = this.createElement("ul", "repo-list");
    this.addedRepos = this.createElement("div", "added-repos");

    this.searchLine.append(this.searchInput);
    this.searchLine.append(this.searchCounter);
    this.repoMenu.append(this.repoList);
    this.main.append(this.repoMenu);

    this.app.append(this.searchLine);
    this.app.append(this.main);
    this.app.append(this.addedRepos);
  }
  createElement(elementTag, elementClass) {
    const element = document.createElement(elementTag);
    if (elementClass) {
      element.classList.add(elementClass);
    }
    return element;
  }
  createRepository(repoData) {
    const repoElement = this.createElement("li", "repo");
    repoElement.innerHTML = `<span class = "repo-name">${repoData.name}</span>`;
    repoElement.addEventListener("click", () => this.addRepository(repoData));
    this.repoList.append(repoElement);
  }

  clearRepositories() {
    this.repoList.innerHTML = "";
  }

  addRepository(repoData) {
    const repoElement = this.createElement("div", "added-repo");

    repoElement.innerHTML = `
      <small>Name: ${repoData.name}</small><br>
      <small>Owner: ${repoData.owner.login || "No Owner"}</small><br>
      <small>Stars: ${repoData.stargazers_count}</small>
    `;

    const removeButton = this.createElement("button", "remove-button"); // Символ крестика
    removeButton.addEventListener("click", () =>
      this.removeRepository(repoElement)
    );

    repoElement.append(removeButton);
    this.addedRepos.append(repoElement);

    this.clearInput();
  }

  removeRepository(repoElement) {
    repoElement.remove();
  }
  clearInput() {
    this.searchInput.value = ""; // Очищаем поле ввода
  }
}

const REPO_PER_PAGE = 5;

class Search {
  constructor(view) {
    this.view = view;
    this.view.searchInput.addEventListener(
      "keyup",
      this.debounce(this.searchRepositories.bind(this), 500)
    );
  }

  async searchRepositories() {
    const searchValue = this.view.searchInput.value.trim();
    this.view.clearRepositories();
    return await fetch(
      `https://api.github.com/search/repositories?q=${encodeURIComponent(
        searchValue
      )}&per_page=${REPO_PER_PAGE}`
    ).then((res) => {
      if (res.ok) {
        res.json().then((res) => {
          res.items.forEach((repo) => this.view.createRepository(repo));
        });
      } else {
      }
    });
  }
  debounce(fn, delay) {
    let timeout;
    return function (...args) {
      clearTimeout(timeout);
      timeout = setTimeout(() => fn.apply(this, args), delay);
    };
  }
}

new Search(new View());
