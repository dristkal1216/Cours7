const App = (() => {
  class App {
    static showSuccess(message) {
      const modal = document.getElementById("modal-message");
      const modalContent = modal?.querySelector(".modal-message-content");
      const modalContentTitle = modalContent?.querySelector("h2");
      const modalContentMessage = modalContent?.querySelector("p");
      if (modalContentTitle) modalContentTitle.innerText = "Succès!";
      if (modalContentMessage) {
        modalContentMessage.innerText = message;
        modalContentMessage.style = "color:darkgreen";
      }
      this.toggleModal(modal);
    }
    static showError(message) {
      const modal = document.getElementById("modal-message");
      const modalContent = modal?.querySelector(".modal-message-content");
      const modalContentTitle = modalContent?.querySelector("h2");
      const modalContentMessage = modalContent?.querySelector("p");
      if (modalContentTitle) modalContentTitle.innerText = "Erreur!";
      if (modalContentMessage) {
        modalContentMessage.innerText = message;
        modalContentMessage.style = "color:darkred";
      }
      this.toggleModal(modal);
    }

    /**
     *
     * @param {string} route
     */
    static handleRequest(route, pushState = true) {
      console.log("route:", route);

      fetch(route)
        .then((response) => {
          if (!response.ok)
            throw new Error(`Une erreur s'est produite: ${response.status}`);
          return route.includes("/item") ? response.json() : response.text();
        })
        .then((data) => {
          if (route.includes("item")) {
            console.log("Data received:", data);
            // Now data is a valid array from our JSON response.
            let html = "";
            data.forEach((item) => {
              console.log(item);
              html += `<div class="item">
                <h3>${item.name}</h3>
                <p>${item.description}</p>
                <p>Type: ${item.type} - Rarity: ${item.rarity}</p>
                <ul>`;
              for (const [key, value] of Object.entries(item.attributes)) {
                html += `<li>${key}: ${value}</li>`;
              }
              html += `</ul>
              </div>`;
            });
            console.log(html);
            document.getElementById("main-container").innerHTML = html;
          } else if (route === "/") {
            const mainContainerMatch = data.match(
              /<main[^>]*>([\s\S]*?)<\/main>/
            );
            if (mainContainerMatch && mainContainerMatch[1]) {
              document.getElementById("main-container").innerHTML =
                mainContainerMatch[1];
            } else {
              document.getElementById("main-container").innerHTML = data;
            }
          } else {
            document.getElementById("main-container").innerHTML = data;
          }
        })
        .catch((error) => {
          App.showError(error.message);
        });

      App.adjustMainContainer();
    }

    static toggleModal = (modal) => {
      modal?.classList?.toggle("show");
    };

    // static showForbidden(page){
    //     const mainContainer = document.getElementById("main-container");
    //     mainContainer.innerHTML = `<h2>${page}</h2><p>Vous devez être enregistré et loggé pour accéder à ce contenu</p>`;
    // }
    static setEventListeners() {
      console.log("Initialisation des EventListeners...");
      // Modal
      const modal = document.getElementById("modal-message");
      const boutonFermer = document.querySelector(".fermer");
      boutonFermer.addEventListener("click", () => {
        this.toggleModal(modal);
      });
      window.addEventListener(
        "click",
        (e) => e.target === modal && this.toggleModal(modal)
      );
      // Navigation mobile
      const toggleButton = document.getElementById("nav-toggle");
      const nav = document.getElementById("site-top-nav");
      toggleButton.addEventListener("click", function () {
        nav.classList.toggle("show");
        toggleButton.classList.toggle("reverse");
        App.adjustMainContainer();
      });
      // Navigation générale
      document.querySelectorAll("#site-top-nav > ul > li").forEach((elem) => {
        elem.addEventListener("click", () => {
          console.log(elem.dataset.url);
          App.handleRequest(elem.dataset.url);
        });
      });
      window.addEventListener("popstate", (event) => {
        // console.log('Popstate!');
        // console.log('URL:', document.location.href);
        // console.log('Event State object:', event.state);
        // console.log('History State object:', history.state);
        // console.log('Location:', document.location);
        // App.handleRequest(location.hash, false);
      });
    }
    static init() {
      console.log("Initialisation de l'App...");
      // const route = location.hash ? location.hash : "/home/index";
      // App.handleRequest(route);
      App.setEventListeners();
      App.adjustMainContainer();
    }
    static adjustMainContainer() {
      const header = document.getElementById("site-header");
      const mainContainer = document.getElementById("main-container");
      const headerHeight = header.offsetHeight;
      mainContainer.style.marginTop = headerHeight + 16 + "px";
    }
  }
  document.addEventListener("DOMContentLoaded", App.init);
  window.addEventListener("resize", App.adjustMainContainer);
  return App;
})();
