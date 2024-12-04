window.addEventListener("load", (event) => {    
    loadvars()
    console.log("page is fully loaded")
});

function openMain(){
    document.querySelector("#getQuiz").addEventListener("click", () => {
        getQuiz("10", "21", "medium", "multiple")
    })
}


async function getQuiz(questions, category, difficulty, type) {
    // const url = `https://opentdb.com/api.php
    //             ?amount=${encodeURIComponent(questions)}
    //             &category=${encodeURIComponent(category)}
    //             &difficulty=${encodeURIComponent(difficulty)}
    //             &type=${encodeURIComponent(type)}`

    const url = `https://opentdb.com/api.php?amount=${questions}&category=${category}&difficulty=${difficulty}&type=${type}`

    try {
        const response = await fetch(url);
        const data = await response.json();

        if (data.response_code === 0) {
            console.log(data)
        } else {
            console.log("Error:", data.Error);
            
        }
    } catch (error) {
        console.error("Error fetching quiz:", error);
    }
}

function savevars(){

}

function loadvars(){

}