// Log out ///////////////////////////////////////
const logOut = document.getElementById("logOut");
logOut.addEventListener("click", (e) => {
    e.preventDefault();
    localStorage.clear();
    window.location.href = "./login.html";
    return;
})

// return home ///////////////////////////////////
const home = document.getElementById("home");
home.addEventListener("click", (e) => {
    e.preventDefault();
    window.location.href = "./index.html";
    return;
})

// campaign //////////////////////////////////////
const imageContainer = document.getElementById("image");
const title = document.getElementById("title");
const description = document.getElementById("description");
const pledges = document.getElementById("pledges");
let counter=0;
async function fetchCampaign() {
    try {
        const response = await fetch(`http://localhost:3000/campaigns/${localStorage.getItem("campaign_id")}`);
        const campaign = await response.json();
        console.log("Raw Data from Server:", campaign);
        if (!response.ok) {
            alert("couldn't reach the campaign . please try again");
            return;
        }
        imageContainer.innerHTML = `<img src="${campaign.imageBased64}" style="width:100%">`;
        title.innerText = `${campaign.title}`;
        description.innerText = `${campaign.description}`;
        const response_pledges = await fetch("http://localhost:3000/pledges");
        if (!response_pledges.ok) {
            alert("please try again");
        }
        const data = await response_pledges.json();
        for (let i = 0; i < data.length; i++) {
            if (data[i].campaignId == localStorage.getItem("campaign_id")) {
                let pledgeHTML = `
                    <div class="pledge-item" style="margin-bottom:15px; background:#f9f9f9; padding:10px;">
                        <p> User ID: ${data[i].userId}</p><p>Amount: ${data[i].amount} EGP</p>
                    </div>`;
                pledges.insertAdjacentHTML("beforeend", pledgeHTML);
                counter++;
            }
        }
        if(counter ==0){
            let pledgeHTML = `
                    <div class="pledge-item" style="margin-bottom:15px; background:#f9f9f9; padding:10px;">
                        <p> There's no pledges till now</p>
                    </div>`;
                pledges.insertAdjacentHTML("beforeend", pledgeHTML);
        }
    } catch (error) {
        console.error(error);
    }
}
fetchCampaign();

// add Image //////////////////////////////////////
