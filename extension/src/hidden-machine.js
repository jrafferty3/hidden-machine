isActive = false;

function HM_activate() {
    if (isActive) { return; }
    isActive = true;

    run();

    console.log("Machine set!");
}

function HM_deactivate() {
    if (!isActive) { return; }
    isActive = false;

    stop();

    console.log("You monster.");
}

