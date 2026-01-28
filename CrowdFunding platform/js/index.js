const userRole = localStorage.getItem('userRole');

// Log out ///////////////////////////////////////
const logOut = document.getElementById("logOut");
logOut.addEventListener("click", (e) => {
    e.preventDefault();
    localStorage.clear();
    window.location.href = "./login.html";
})

// Start campaign /////////////////////////////////
const start_campaign = document.getElementById("start_campaign");
start_campaign.addEventListener("click", (e) => {
    e.preventDefault();
    if (userRole === 'anonymous') {
        return;
    }
    window.location.href = "./start_campaign.html";
})

// change category ////////////////////////////////
let category = "All";

const All = document.getElementById("All");
All.addEventListener("click", (e) => {
    e.preventDefault();
    category = "All";
    applyFilter(category)
})

const Education = document.getElementById("Education");
Education.addEventListener("click", (e) => {
    e.preventDefault();
    category = "Education";
    applyFilter(category)
})

const Medical = document.getElementById("Medical");
Medical.addEventListener("click", (e) => {
    e.preventDefault();
    category = "Medical";
    applyFilter(category)
})

const Food = document.getElementById("Food");
Food.addEventListener("click", (e) => {
    e.preventDefault();
    category = "Food";
    applyFilter(category)
})

const wars = document.getElementById("wars");
wars.addEventListener("click", (e) => {
    e.preventDefault();
    category = "wars";
    applyFilter(category)
})

const Animal = document.getElementById("Animal");
Animal.addEventListener("click", (e) => {
    e.preventDefault();
    category = "Animal";
    applyFilter(category)
})

const Others = document.getElementById("Others");
Others.addEventListener("click", (e) => {
    e.preventDefault();
    category = "Others";
    applyFilter(category)
})

//Display campaigns /////////////////////////////////
let allCampaigns = [];
let filteredCampaigns = [];
let currentIndex = 0;

const campaignsContainer = document.getElementById("campaigns");
const nextBtn = document.getElementById("next");
const prevBtn = document.getElementById("previous");
//Get all campaigns
async function fetchCampaigns() {
    try {
        const response = await fetch("http://localhost:3000/campaigns");
        const data = await response.json();
        console.log("Raw Data from Server:", data);
         allCampaigns = data.filter(c => c.approved === true);
        //allCampaigns = data;
        applyFilter("All");
    } catch (error) {
        console.error(error);
    }
}
//select campaigns of the category
function applyFilter(category) {
    if (category == "All") {
        console.log("Filtering by:", category);
        console.log("All Approved Campaigns:", allCampaigns);
        filteredCampaigns = allCampaigns;
    } else {
        filteredCampaigns = allCampaigns.filter(c => c.category === category);
    }
    console.log("Result after filter:", filteredCampaigns);
    currentIndex = 0;
    DisplayCampaign();
}
//change the card
function DisplayCampaign() {
    campaignsContainer.innerHTML = "";
    if (filteredCampaigns.length === 0) {
        campaignsContainer.innerHTML = `
            <div class="card">
                <div class="text">
                    <h3 class="title">No campaigns found in this category</h3>
                </div>
            </div>`;
        return;
    }
    const campaign = filteredCampaigns[currentIndex];
    campaignsContainer.innerHTML = `
        <div class="card">
            <div class="image">
                <img src="${campaign.imageBased64}">
            </div>
            <div class="text">
                <h3 class="title">${campaign.title}</h3>
                <p class="description">${campaign.description}</p>
                <p>Goal : ${campaign.goal}</p>
                <p>Collected : ${campaign.currentAmount}<p>
            </div>
        </div>
    `;
}

fetchCampaigns();

// Buttons prev,next /////////////////////////////////
nextBtn.addEventListener("click", () => {
    if (currentIndex < filteredCampaigns.length - 1) {
        currentIndex++;
    } else {
        currentIndex = 0;
    }
    DisplayCampaign();
});

prevBtn.addEventListener("click", () => {
    if (currentIndex > 0) {
        currentIndex--;
    } else {
        currentIndex = filteredCampaigns.length - 1;
    }
    DisplayCampaign();
});


// Donate button /////////////////////////////////////
const donationForm = document.getElementById("donation");
donationForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const campaign = filteredCampaigns[currentIndex];
    if (!campaign) {
        alert("No campaign selected!");
        return;
    }
    const donationValue = Number(document.getElementById("donate").value);
    if (isNaN(donationValue) || donationValue <= 0) {
        alert("Please enter a valid donation amount.");
        return;
    }
    const newAmount = Number(campaign.currentAmount) + donationValue;
    const pledgeData = {
        userId: localStorage.getItem('userId'),
        campaignId: campaign.id,
        campaignTitle: campaign.title,
        amount: donationValue
    };
    try {
        const campaignResponse = await fetch(`http://localhost:3000/campaigns/${campaign.id}`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                currentAmount: newAmount
            })
        });
        if (!campaignResponse.ok) {
            alert("failed to Donate . please try again");
            return;
        } else {
            const pledgeResponse = await fetch(`http://localhost:3000/pledges`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(pledgeData)

            });
            if (!pledgeResponse.ok) {
                alert("successfull donation but couldn't upload pledges .");
                return;
            }
        }
        alert(`Donated successfully for : ${campaign.title}`);
        campaign.currentAmount = newAmount;
        DisplayCampaign();
        donationForm.reset();
        return;
    } catch (error) {
        console.error(error);
    }
})


//check if it's anynomous user ///////////////////
if (userRole === "anonymous") {
    const donation_button = document.getElementById("donation_button");
    donation_button.disabled = true;
    donation_button.style.opacity = '0.3';
    start_campaign.style.opacity = '0.3';

}

const details=document.getElementById("details");
details.addEventListener("click",(e)=>{
    const campaign = filteredCampaigns[currentIndex];
    localStorage.setItem("campaign_id",campaign.id);
    window.location.href ="./campain_details.html";
})