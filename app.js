
const partForm = document.getElementById("partForm");
const partsList = document.getElementById("partsList");
const partCount = document.getElementById("partCount");

const parts = [
  {
    id: 1,
    name: "Performance Camshaft",
    brand: "Example Brand",
    category: "Engine",
    price: 2500,
    compatibility: "Verify engine compatibility before purchase."
  }
];

let nextId = 2;

function displayParts() {
  partsList.innerHTML = "";

  parts.forEach(function (part) {
    const card = document.createElement("article");
    card.className = "part-card";

    const name = document.createElement("h3");
    name.textContent = part.name;

    const brand = document.createElement("p");
    brand.textContent = "Brand: " + part.brand;

    const category = document.createElement("p");
    category.className = "part-category";
    category.textContent = part.category;

    const price = document.createElement("p");
    price.className = "part-price";
    price.textContent = "₱" + part.price.toLocaleString("en-PH", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });

    const compatibility = document.createElement("p");
    compatibility.textContent =
      part.compatibility || "No compatibility notes.";

    const deleteButton = document.createElement("button");
    deleteButton.textContent = "Delete Part";
    deleteButton.className = "delete-button";
    deleteButton.type = "button";

    deleteButton.addEventListener("click", function () {
      const confirmed = confirm(
        "Are you sure you want to delete " + part.name + "?"
      );

      if (!confirmed) {
        return;
      }

      const index = parts.findIndex(function (item) {
        return item.id === part.id;
      });

      if (index !== -1) {
        parts.splice(index, 1);
        displayParts();
      }
    });

    card.append(
      name,
      brand,
      category,
      price,
      compatibility,
      deleteButton
    );

    partsList.appendChild(card);
  });

  partCount.textContent =
    parts.length + (parts.length === 1
      ? " part in catalog"
      : " parts in catalog");
}

partForm.addEventListener("submit", function (event) {
  event.preventDefault();

  const name = document.getElementById("partName").value.trim();
  const brand = document.getElementById("brand").value.trim();
  const category = document.getElementById("category").value;
  const priceInput = document.getElementById("price").value;
  const price = Number(priceInput);
  const compatibility =
    document.getElementById("compatibility").value.trim();

  if (
    !name ||
    !brand ||
    !category ||
    priceInput.trim() === "" ||
    !Number.isFinite(price) ||
    price < 0
  ) {
    alert("Please enter valid part information.");
    return;
  }

  const newPart = {
    id: nextId,
    name: name,
    brand: brand,
    category: category,
    price: price,
    compatibility: compatibility
  };

  parts.push(newPart);
  nextId++;

  displayParts();
  partForm.reset();
});

displayParts();
