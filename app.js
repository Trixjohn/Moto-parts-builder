
const partForm = document.getElementById("partForm");
const partsList = document.getElementById("partsList");
const partCount = document.getElementById("partCount");
const categoryFilter = document.getElementById("categoryFilter");

const partName = document.getElementById("partName");
const brand = document.getElementById("brand");
const category = document.getElementById("category");
const price = document.getElementById("price");
const compatibility = document.getElementById("compatibility");

let parts = [];

try {
  const savedParts = JSON.parse(
    localStorage.getItem("motoParts") || "[]"
  );

  if (Array.isArray(savedParts)) {
    parts = savedParts.filter((part) =>
      part &&
      Number.isInteger(part.id) &&
      typeof part.name === "string" &&
      typeof part.brand === "string" &&
      typeof part.category === "string" &&
      Number.isFinite(part.price)
    );
  }
} catch (error) {
  console.error("Could not load saved parts:", error);
}

function saveParts() {
  try {
    localStorage.setItem("motoParts", JSON.stringify(parts));
  } catch (error) {
    alert("Could not save parts in this browser.");
    console.error(error);
  }
}

function renderParts() {
  const selectedCategory = categoryFilter.value;

  const filteredParts = selectedCategory === "All"
    ? parts
    : parts.filter((part) => part.category === selectedCategory);

  partsList.replaceChildren();

  partCount.textContent =
    `${filteredParts.length} of ${parts.length} parts displayed`;

  if (filteredParts.length === 0) {
    const message = document.createElement("p");
    message.className = "empty-message";
    message.textContent = parts.length === 0
      ? "No parts yet. Add your first motorcycle part!"
      : "No parts found in this category.";

    partsList.appendChild(message);
    return;
  }

  filteredParts.forEach((part) => {
    const card = document.createElement("article");
    card.className = "part-card";

    const title = document.createElement("h3");
    title.textContent = part.name;

    const brandText = document.createElement("p");
    brandText.textContent = `Brand: ${part.brand}`;

    const categoryText = document.createElement("span");
    categoryText.className = "part-category";
    categoryText.textContent = part.category;

    const priceText = document.createElement("p");
    priceText.className = "part-price";
    priceText.textContent = `₱${part.price.toLocaleString("en-PH", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    })}`;

    const compatibilityText = document.createElement("p");
    compatibilityText.textContent =
      `Compatibility: ${part.compatibility || "Not specified"}`;

    const deleteButton = document.createElement("button");
    deleteButton.type = "button";
    deleteButton.className = "delete-button";
    deleteButton.textContent = "Delete Part";
    deleteButton.addEventListener("click", () => {
      deletePart(part.id);
    });

    card.append(
      title,
      brandText,
      categoryText,
      priceText,
      compatibilityText,
      deleteButton
    );

    partsList.appendChild(card);
  });
}

function deletePart(id) {
  const confirmed = confirm("Are you sure you want to delete this part?");

  if (!confirmed) {
    return;
  }

  parts = parts.filter((part) => part.id !== id);

  saveParts();
  renderParts();
}

partForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const newPart = {
    id: Date.now(),
    name: partName.value.trim(),
    brand: brand.value.trim(),
    category: category.value,
    price: Number(price.value),
    compatibility: compatibility.value.trim()
  };

  if (
    !newPart.name ||
    !newPart.brand ||
    !newPart.category ||
    price.value.trim() === "" ||
    !Number.isFinite(newPart.price) ||
    newPart.price < 0
  ) {
    alert("Please enter valid information for all required fields.");
    return;
  }

  parts.push(newPart);

  saveParts();
  categoryFilter.value = "All";
  renderParts();

  partForm.reset();
  partName.focus();
});

categoryFilter.addEventListener("change", renderParts);

renderParts();
