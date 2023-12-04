function createListEntry() {
    const currentEntry = {
        pic_medium:"https://image.spreadshirtmedia.com/image-server/v1/compositions/T210A1PA4301PT17X66Y35D1014313858W19902H26110/views/1,width=550,height=550,appearanceId=1,backgroundColor=FFFFFF,noPt=true/ness-earthbound-8bit-mens-t-shirt.jpg",
        title: "Earthbound"
    }
    const entry = `
        <div class="anime">
            <div class="poster">
                <img src=${currentEntry.pic_medium}>
            </div>
            <div class="info">
                <p id="title">${currentEntry.title}</p>
                <div class="entry-buttons">
                    <button class="selectAnime" value="id">Select</button>
                    <button class="moreInfo" value="id">More Info</button>
                </div>
            </div>
        </div>
    `;

    document.body.querySelector("#MALResults").insertAdjacentHTML("beforeend", entry);
}


function echo() {
    console.log("hello!?");
}
