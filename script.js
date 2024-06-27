function moreText() {
  const element = document.getElementById("toggle-p");
  element.classList.toggle("more-p");
}

const pinDetails = document.getElementById("pindetails");

pinDetails.addEventListener("click", (event) => {
  if (event.target.classList.contains("btn-details")) {
    const cardId = event.target.dataset.cardId;
    toggleCardBody(cardId);
  }
});

const getArea = async (PIN) => {
  try {
    const baseUrl = "https://api.postalpincode.in/";
    let url = baseUrl;

    if (!isNaN(parseFloat(PIN))) {
      url += `pincode/${PIN}`;
    } else {
      url += `postoffice/${PIN}`;
    }
    const response = await fetch(url);

    const data = await response.json();

    const filteredData = data[0].PostOffice.filter((item) => {
      return (
        item.Name.toLowerCase() === PIN.toLowerCase() || item.Pincode === PIN
      );
    });
    return filteredData;
  } catch (error) {
    return null;
  }
};

const toggleCardBody = (cardId) => {
  const cardBody = document.getElementById(`card-body-${cardId}`);
  const cardButtonText = document
    .getElementById(`main-card-${cardId}`)
    .getElementsByTagName("a")[0];

  if (cardBody) {
    cardBody.hidden = !cardBody.hidden;
  }
  if (cardBody.hidden == true) {
    cardButtonText.textContent = "Find Details";
  } else {
    cardButtonText.textContent = "Hide Details";
  }
};

const mainFunc = async (PIN) => {
  console.time("Fetching");
  try {
    const area = await getArea(PIN);
    if (area[0].Status == "404" || area[0].Status == "Error") {
      document.getElementById("alert").hidden = false;
      pinDetails.innerHTML = "";
    } else {
      let ihtml = "";

      for (let item of area) {
        console.log(item);
        let cardId = item.Name.replace(/\s+/g, "-"); // Create a unique card ID
        ihtml += `
      <div class="col-sm-3 my-2">
        <div class="card" id = "main-card-${cardId}">
          <div class="card-body">
            <h5 class="card-title">Name: ${item.Name}</h5>
            <p class="card-text">Branch Type: ${item.BranchType}</p>
            <p class="card-text">Circle: ${item.Circle}</p>

            <div id="card-body-${cardId}" hidden>
              <p class="card-text">DeliveryStatus: ${item.DeliveryStatus}</p>
              <p class="card-text">PINCODE: ${item.Pincode}</p>
              <p class="card-text">Block: ${item.Block}</p>
              <p class="card-text">Division: ${item.Division}</p>
              <p class="card-text">District: ${item.District}</p>
              <p class="card-text">Region: ${item.Region}</p>
              <p class="card-text">State: ${item.State}</p>
              <p class="card-text">Country: ${item.Country}</p>
            </div>
          
          <a data-card-id="${cardId}" class="btn btn-outline-info btn-details">Find Details</a>

          </div>
        </div>
      </div>`;
      }

      document.getElementById("alert").hidden = true;
      pinDetails.innerHTML = ihtml;
    }
  } catch (error) {}
  console.timeEnd("Fetching");
};

async function getValue() {
  const searchInput = document.getElementById("searchInput");

  const searchValue = searchInput.value;

  // You can perform further actions with searchValue here
  await mainFunc(searchValue);
  document.getElementById("typed_pin").textContent = searchValue;
}
function handleEnter(event) {
  if (event.key === "Enter") {
    // If "Enter" key is pressed, call getValue()
    getValue();
  }
}
