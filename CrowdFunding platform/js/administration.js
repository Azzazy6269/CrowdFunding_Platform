// Log out ///////////////////////////////////////
const logOut = document.getElementById("logOut");
logOut.addEventListener("click", (e) => {
    e.preventDefault();
    localStorage.clear();
    window.location.href = "./login.html";
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

//Display  campaigns /////////////////////////////////
let allCampaigns = [];
let allWaitingCampaigns = [];
let allApprovedCampaigns = [];
let filteredApprovedCampaigns = [];
let filteredWaitingCampaigns = [];
let currentApprovedIndex = 0;
let currentWaitingIndex = 0;

const WaitingCampaignsContainer = document.getElementById("campaigns_Waiting");
const nextBtn_Waiting = document.getElementById("next_Waiting");
const prevBtn_Waiting = document.getElementById("previous_Waiting");
//Get all campaigns
async function fetchCampaigns() {
    try {
        const response = await fetch("http://localhost:3000/campaigns");
        const data = await response.json();
        console.log("Raw Data from Server:", data);
        allCampaigns = data;
        allApprovedCampaigns = data.filter(c => c.approved === true);
        allWaitingCampaigns = data.filter(c => c.approved === false);
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
        filteredApprovedCampaigns = allApprovedCampaigns;
        filteredWaitingCampaigns = allWaitingCampaigns;
    } else {
        filteredApprovedCampaigns = allApprovedCampaigns.filter(c => c.category === category);
        filteredWaitingCampaigns = allWaitingCampaigns.filter(c => c.category === category);
    }
    currentApprovedIndex = 0;
    currentWaitingIndex = 0;
    DisplayWaitingCampaign();
}
//change the card
function DisplayWaitingCampaign() {
    WaitingCampaignsContainer.innerHTML = "";
    if (filteredWaitingCampaigns.length === 0) {
        WaitingCampaignsContainer.innerHTML = `
            <div class="card">
                <div class="text">
                    <h3 class="title">No campaigns found in this category</h3>
                </div>
            </div>`;
        return;
    }
    var Waitingcampaign = filteredWaitingCampaigns[currentWaitingIndex];
    WaitingCampaignsContainer.innerHTML = `
        <div class="card">
            <div class="image">
                <img src="${Waitingcampaign.imageBased64}">
            </div>
            <div class="text">
                <h3 class="title">${Waitingcampaign.title}</h3>
                <p class="description">${Waitingcampaign.description}</p>
                <p>Goal : ${Waitingcampaign.goal}</p>
                <p>Collected : ${Waitingcampaign.currentAmount}<p>
            </div>
        </div>
    `;
    if (Waitingcampaign.approved === true) {
        Approve.style.backgroundColor = 'red';
        Approve.innerHTML = 'DisApprove';
    } else {
        Approve.style.backgroundColor = '#059669';
        Approve.innerHTML = 'Approve';
    }
}
fetchCampaigns();

// Buttons prev,next /////////////////////////////////
nextBtn_Waiting.addEventListener("click", () => {
    if (currentWaitingIndex < filteredWaitingCampaigns.length - 1) {
        currentWaitingIndex++;
    } else {
        currentWaitingIndex = 0;
    }
    DisplayCampaign();
});

prevBtn_Waiting.addEventListener("click", () => {
    if (currentWaitingIndex > 0) {
        currentWaitingIndex--;
    } else {
        currentWaitingIndex = filteredWaitingCampaigns.length - 1;
    }
    DisplayCampaign();
});

//Approve button //////////////////////////////////
const Approve = document.getElementById("Approve");
Approve.addEventListener("click", async (e) => {
    e.preventDefault();
    try {
        var Waitingcampaign = filteredWaitingCampaigns[currentWaitingIndex];
        const response = await fetch(`http://localhost:3000/campaigns/${Waitingcampaign.id}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                approved : true
            })
        });
        if (!response.ok) {
            alert("failed to approve please try again .");
            return;
        }
        alert("campaign was approved successfully.");
    } catch (error) {
        console.error(error);
    }

})

//Reject button //////////////////////////////////
const Reject = document.getElementById("Reject");
Reject.addEventListener("click", async (e) => {
    e.preventDefault();
    try {
        var DisApprovedcampaign = filteredDisApprovedCampaigns[currentDisApprovedIndex];
        const response = await fetch(`http://localhost:3000/campaigns/${DisApprovedcampaign.id}`, {
            method: "delete",
        });
        if (!response.ok) {
            alert("failed to delete . please try again .");
            return;
        }
        alert("campaign was deleted successfully.");
    } catch (error) {
        console.error(error);
    }

})


////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//Display users /////////////////////////////////
let allUsers = [];
let currentuserIndex = 0;

const usersContainer = document.getElementById("users");
const next_user = document.getElementById("next_user");
const previous_user = document.getElementById("previous_user");
//Get all users
async function fetchUsers() {
    try {
        const response = await fetch("http://localhost:3000/users");
        const data = await response.json();
        console.log("Raw Data from Server:", data);
        allUsers = data;
        DisplayUser() ;
    } catch (error) {
        console.error(error);
    }
}
//change the card
function DisplayUser() {
    usersContainer.innerHTML = "";
    if (allUsers.length === 0) {
        usersContainer.innerHTML = `
            <div class="card">
                <div class="text">
                    <h3 class="title">No users found</h3>
                </div>
            </div>`;
        return;
    }
    var currentUser = allUsers[currentuserIndex];
    usersContainer.innerHTML = `
        <div class="card">
            <div class="text">
                <h3 class="userName">${currentUser.name}</h3>
                <p class="email">${currentUser.email}</p>
                <p>role : ${currentUser.role}</p>
                <p>isActive : ${currentUser.isActive}<p>
            </div>
        </div>
    `;
    if (currentUser.isActive === true) {
        Activate.style.backgroundColor = 'red';
        Activate.innerHTML = 'DeActivate';
    } else {
        Activate.style.backgroundColor = '#059669';
        Activate.innerHTML = 'Activate';
    }
}
fetchUsers();

// Buttons prev,next /////////////////////////////////
next_user.addEventListener("click", () => {
    if (currentuserIndex < allUsers.length - 1) {
        currentuserIndex++;
    } else {
        currentuserIndex = 0;
    }
    DisplayUser();
});

previous_user.addEventListener("click", () => {
    if (currentuserIndex > 0) {
        currentuserIndex--;
    } else {
        currentuserIndex = allUsers.length - 1;
    }
    DisplayUser();
});

//Activate button //////////////////////////////////
const Activate = document.getElementById("Activate");
Activate.addEventListener("click", async (e) => {
    e.preventDefault();
    try {
        var currentUser = allUsers[currentuserIndex];
        const response = await fetch(`http://localhost:3000/users/${currentUser.id}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                isActive : !currentUser.isActive
            })
        });
        if (!response.ok) {
            alert("failed to change activation status.  please try again .");
            return;
        }
        alert("activation status was changed successfully.");
        currentUser.Activate = !currentUser.Activate;
    } catch (error) {
        console.error(error);
    }

})


////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//Display pledges /////////////////////////////////
let allPledges = [];
let currentpledgeIndex = 0;

const pledgesContainer = document.getElementById("pledges");
const next_pledge = document.getElementById("next_pledge");
const previous_pledge = document.getElementById("previous_pledge");
//Get all users
async function fetchPledges() {
    try {
        const response = await fetch("http://localhost:3000/pledges");
        const data = await response.json();
        console.log("Raw Data from Server:", data);
        allPledges = data;
        DisplayPledges() ;
    } catch (error) {
        console.error(error);
    }
}
//change the card
function DisplayPledges() {
    pledgesContainer.innerHTML = "";
    if (allPledges.length === 0) {
        pledgesContainer.innerHTML = `
            <div class="card">
                <div class="text">
                    <h3 class="title">No users found</h3>
                </div>
            </div>`;
        return;
    }
    var currentPledge = allPledges[currentpledgeIndex];
    pledgesContainer.innerHTML = `
        <div class="card">
            <div class="text">
                <h3 class="Id">Id : ${currentPledge.id}</h3>
                <p>userId : ${currentPledge.userId}<p>
                <p class="campaignId">campaignId : ${currentPledge.campaignId}</p>
                <p>campaignTitle : ${currentPledge.campaignTitle}</p>
                <p>amount : ${currentPledge.amount}<p>
            </div>
        </div>
    `;
}
fetchPledges();

// Buttons prev,next /////////////////////////////////
next_pledge.addEventListener("click", () => {
    if (currentpledgeIndex < allPledges.length - 1) {
        currentpledgeIndex++;
    } else {
        currentpledgeIndex = 0;
    }
    DisplayPledges();
});

previous_pledge.addEventListener("click", () => {
    if (currentpledgeIndex > 0) {
        currentpledgeIndex--;
    } else {
        currentpledgeIndex = allPledges.length - 1;
    }
    DisplayPledges();
});