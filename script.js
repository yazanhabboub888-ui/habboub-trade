function startTrading() {

    document
        .getElementById("analysis")
        .scrollIntoView({
            behavior: "smooth"
        });

}


function scrollToAnalysis() {

    document
        .getElementById("analysis")
        .scrollIntoView({
            behavior: "smooth"
        });

}


/* TIMEFRAME */

function selectTimeframe(button) {

    const buttons =
        document.querySelectorAll(
            ".timeframes button"
        );

    buttons.forEach(btn => {

        btn.classList.remove("active");

    });

    button.classList.add("active");

}


/* MARKET ANALYSIS */

function analyzeMarket() {

    const signal =
        document.getElementById("signal");

    const description =
        document.getElementById(
            "signal-description"
        );

    const asset =
        document.getElementById("asset").value;


    const signals = [
        "BUY",
        "SELL",
        "WAIT"
    ];

    const randomSignal =
        signals[
            Math.floor(
                Math.random() * signals.length
            )
        ];


    signal.className = "";

    if (randomSignal === "BUY") {

        signal.classList.add("signal-buy");

        signal.innerText = "BUY";

        description.innerText =
            asset +
            " is showing bullish conditions. Look for confirmation before entering.";

    }

    else if (randomSignal === "SELL") {

        signal.classList.add("signal-sell");

        signal.innerText = "SELL";

        description.innerText =
            asset +
            " is showing bearish conditions. Wait for confirmation before entering.";

    }

    else {

        signal.classList.add("signal-neutral");

        signal.innerText = "WAIT";

        description.innerText =
            "Market conditions are unclear. Wait for a stronger setup.";

    }

}


/* RISK CALCULATOR */

function calculateRisk() {

    const balance =
        parseFloat(
            document.getElementById("balance").value
        );

    const risk =
        parseFloat(
            document.getElementById("risk").value
        );


    if (
        isNaN(balance) ||
        isNaN(risk)
    ) {

        alert(
            "Please enter your balance and risk percentage."
        );

        return;

    }


    const result =
        balance * (risk / 100);


    document.getElementById(
        "risk-result"
    ).innerText =
        "$" + result.toFixed(2);

}


/* JOURNAL */

function saveJournal() {

    const text =
        document.getElementById(
            "journalText"
        ).value;


    if (text.trim() === "") {

        alert(
            "Write something before saving."
        );

        return;

    }


    localStorage.setItem(
        "habboubJournal",
        text
    );


    document.getElementById(
        "saveMessage"
    ).innerText =
        "✓ Journal saved successfully.";

}


/* LOAD JOURNAL */

window.addEventListener(
    "load",
    function () {

        const saved =
            localStorage.getItem(
                "habboubJournal"
            );


        if (saved) {

            document.getElementById(
                "journalText"
            ).value = saved;

        }

    }
);
