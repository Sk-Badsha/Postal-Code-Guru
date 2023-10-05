function moreText() {
  const element = document.getElementById("toggle-p");
  element.classList.toggle("more-p");
}

const pinDetails = document.getElementById("pindetails");

const getArea = async (PIN) => {
  try {
    const response = await fetch("https://api.postalpincode.in/pincode/" + PIN);
    const data = await response.json();

    return data;
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
  if(cardBody.hidden == true){
    cardButtonText.textContent ="Find Details"
  }else{
    cardButtonText.textContent = "Hide Details"
  }
  //   document
  //     .getElementById(`main-card-${cardId}`)
  //     .getElementsByTagName("a")[0].textContent = "Find Details";
};

const mainFunc = async (PIN) => {
  try {
    const area = await getArea(PIN);

    if (area[0].Status == "404") {
      document.getElementById("alert").hidden = false;
      pinDetails.innerHTML = "";
    } else {
      let ihtml = "";

      for (let item of area[0].PostOffice) {
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
              <p class="card-text">Block: ${item.Block}</p>
              <p class="card-text">Division: ${item.Division}</p>
              <p class="card-text">District: ${item.District}</p>
              <p class="card-text">Region: ${item.Region}</p>
              <p class="card-text">State: ${item.State}</p>
              <p class="card-text">Country: ${item.Country}</p>
            </div>
            <a onclick="toggleCardBody('${cardId}');" class="btn btn-outline-info">Find Details</a>
          </div>
        </div>
      </div>`;
      }

      document.getElementById("alert").hidden = true;
      pinDetails.innerHTML = ihtml;
    }
  } catch (error) {}
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
