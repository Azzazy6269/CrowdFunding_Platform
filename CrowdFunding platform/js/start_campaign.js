// Log out ///////////////////////////////////////
const logOut = document.getElementById("logOut");
logOut.addEventListener("click",(e)=>{
    e.preventDefault();
    localStorage.clear();
    window.location.href ="./login.html";
    return;
})

// return home ///////////////////////////////////
const home = document.getElementById("home");
home.addEventListener("click",(e)=>{
    e.preventDefault();
    window.location.href = "./index.html";
    return;
})

// Submit the form ///////////////////////////////
const Form = document.getElementById("campaign_form");
campaign_form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const title = Form.querySelector('input[name="title"]').value;
    const description = Form.querySelector('input[name="description"]').value;
    const goal = Form.querySelector('input[name="goal"]').value;
    const deadline = Form.querySelector('input[name="deadline"]').value;
    const imageInput = Form.querySelector('input[name="image"]');
    const category = Form.querySelector('select[name="category"]').value;
    const image = imageInput.files[0];


    if(!validateTitle(title)){
        alert("maximum characters of title is 50");
        return;
    }
    if(!validateDescription(description)){
        alert("maximum characters of description is 500");
        return;
    }
    if(!validateGoal(goal)){
        alert("goal must be the amount of needed money without a sign of any currency");
        return;
    }
    if(!validateDeadline(deadline)){
        alert("daedline must be a valid date in format 2028-01-09");
        return;
    }
    const imageBased64 = await validateImageAndConversion(image);
    if(!imageBased64){
        alert("couldn't upload the image . please try another one.....");
        return;
    }
    const campaignData = {
        title,
        description,
        goal,
        deadline,
        imageBased64,
        approved : false,
        ownerId: localStorage.getItem('userId'),
        currentAmount: 0,
        category
    };
    try {
        const response = await fetch("http://localhost:3000/campaigns", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(campaignData)
        });
        if (!response.ok) {
            alert("failed to upload the data . please try again");
            return;
        }
        alert("New campaign was created successfully.\nWaiting for admin approval .");
        window.location.href="./index.html";
        return;
    } catch (error) {
        console.error(error);
    }
});


function validateTitle(title){
    return (title.length <= 50);
}
function validateDescription(description){
    return (description.length <= 500);
}
function validateGoal(goal){
    return (isFinite(goal));
}
function validateDeadline(deadline) {
    const date = new Date(deadline);
    return !isNaN(date.getTime()) && date.getTime() > Date.now();
}
function validateImageAndConversion(image){
    if (!image.type.startsWith("image/")) { 
        alert("Please upload an image file only.");
        return false;
    }
    if (image.size > 2 * 1024 * 1024) { 
        alert("Image size is too large! Max 2MB.");
        return false; 
    }
    
    return new Promise((resolve)=>{
        const reader = new FileReader();
        reader.readAsDataURL(image);
        reader.onload = ()=> (resolve(reader.result));
        reader.onerror = ()=> (resolve(false));
    })
    
}