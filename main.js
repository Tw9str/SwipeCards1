"use strict";

async function fetchCardData() {
  try {
    const response = await fetch("https://example.com/api/cards");
    if (!response.ok) {
      throw new Error("Failed to fetch card data");
    }
    const cardData = await response.json();
    return cardData;
  } catch (error) {
    console.error("Error fetching card data:", error);
    return null;
  }
}

var tinderContainer = document.querySelector(".tinder");
var allCards = document.querySelectorAll(".tinder--card");
var nope = document.getElementById("nope");
var love = document.getElementById("love");
const contactForm = document.querySelector(".contact-form");

function areCardsLeft() {
  const remainingCards = document.querySelectorAll(
    ".tinder--card:not(.removed)"
  );
  return remainingCards.length > 0;
}

function initCards(card, index) {
  var newCards = document.querySelectorAll(".tinder--card:not(.removed)");

  newCards.forEach(function (card, index) {
    card.style.zIndex = allCards.length - index;
    card.style.transform =
      "scale(" + (20 - index) / 20 + ") translateY(-" + 30 * index + "px)";
    card.style.opacity = (10 - index) / 10;
  });

  tinderContainer.classList.add("loaded");
}

initCards();

allCards.forEach(function (el) {
  var hammertime = new Hammer(el);

  hammertime.on("pan", function (event) {
    el.classList.add("moving");
  });

  hammertime.on("pan", function (event) {
    if (event.deltaX === 0) return;
    if (event.center.x === 0 && event.center.y === 0) return;

    tinderContainer.classList.toggle("tinder_love", event.deltaX > 0);
    tinderContainer.classList.toggle("tinder_nope", event.deltaX < 0);

    var xMulti = event.deltaX * 0.03;
    var yMulti = event.deltaY / 80;
    var rotate = xMulti * yMulti;

    event.target.style.transform =
      "translate(" +
      event.deltaX +
      "px, " +
      event.deltaY +
      "px) rotate(" +
      rotate +
      "deg)";
  });

  hammertime.on("panend", function (event) {
    el.classList.remove("moving");
    tinderContainer.classList.remove("tinder_love");
    tinderContainer.classList.remove("tinder_nope");

    var moveOutWidth = document.body.clientWidth;
    var keep = Math.abs(event.deltaX) < 80 || Math.abs(event.velocityX) < 0.5;

    event.target.classList.toggle("removed", !keep);

    if (!areCardsLeft()) {
      contactForm.classList.add("active");
      love.style.display = "none";
      nope.style.display = "none";
    }

    if (keep) {
      event.target.style.transform = "";
    } else {
      var endX = Math.max(
        Math.abs(event.velocityX) * moveOutWidth,
        moveOutWidth
      );
      var toX = event.deltaX > 0 ? endX : -endX;
      var endY = Math.abs(event.velocityY) * moveOutWidth;
      var toY = event.deltaY > 0 ? endY : -endY;
      var xMulti = event.deltaX * 0.03;
      var yMulti = event.deltaY / 80;
      var rotate = xMulti * yMulti;

      event.target.style.transform =
        "translate(" +
        toX +
        "px, " +
        (toY + event.deltaY) +
        "px) rotate(" +
        rotate +
        "deg)";
      initCards();
    }
  });
});

function createButtonListener(love) {
  return function (event) {
    var cards = document.querySelectorAll(".tinder--card:not(.removed)");
    var moveOutWidth = document.body.clientWidth * 1.5;

    var card = cards[0];

    if (card) {
      card.classList.add("removed");

      if (love) {
        card.style.transform =
          "translate(" + moveOutWidth + "px, -100px) rotate(-30deg)";
        tinderContainer.classList.add("tinder_love");
      } else {
        card.style.transform =
          "translate(-" + moveOutWidth + "px, -100px) rotate(30deg)";
        tinderContainer.classList.add("tinder_nope");
      }

      initCards();
    }

    if (!areCardsLeft()) {
      // No cards left, trigger your code here
      contactForm.classList.add("active");
      document.getElementById("love").style.display = "none";
      document.getElementById("nope").style.display = "none";
    }

    // Add a delay of 1 second (1000 milliseconds) before removing the classes
    setTimeout(function () {
      tinderContainer.classList.remove("tinder_love", "tinder_nope");
    }, 300);

    event.preventDefault();
  };
}

var nopeListener = createButtonListener(false);
var loveListener = createButtonListener(true);

nope.addEventListener("click", nopeListener);
love.addEventListener("click", loveListener);
