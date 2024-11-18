const BPM = 130;

function setup() {
    createCanvas(windowWidth, windowHeight);
    background(0);
}

function draw() {
    // beat settings
    const beatInfo = calculateBeatInfo(BPM);
    const section = beatInfo["Interpolated Phase Count"];
    const bar = beatInfo["Interpolated Bar Count"];
    const count = beatInfo["Interpolated Count"];

    const params = {
        count: count,
        canvas: {
            blendMode: ADD,
            alpha: map(Easing.easeInSine(fract(bar)), 0, 1, 255, 50),
            angle:
                (TAU * floor(newnoise(floor(bar)) * 2 ** (floor(section) % 6))) /
                2 ** (floor(section) % 6),
            scale: 2 ** floor(newnoise(floor(bar), 8712) * 3),
            aspect:
                noise(floor(bar), 9017) > 0.5 ? map(Easing.easeOutSine(fract(bar)), 0, 1, 0.8, max(1, newnoise(floor(bar)) * 10)) : 1,
        },
        motion: {
            speed: noise(floor(bar), 9017) > 0.5 ? 0 : 20,
            sinAmplitude: max(width, height) / 4,
            noiseAmplitude: 0,
            xArrange: noise(floor(bar), 7261) < (floor(section) % 4) / 10,
            yArrange: noise(floor(bar), 9829) < (floor(section) % 4) / 10,
            noiseSpeed: 0.1,
            sinSpeed: 0.1,
        },
        object: {
            scale: 0.5,
            aspect: 1,
            angle: getPhaseWithEasing(count, {
                cycleLength: 1,
                easeDuration: 1,
                easeFunction: Easing.easeInQuart,
            }),
            radius: 0,
        },
        color: {
            palette: ["#FF9F1C", "#2EC4B6", "#CBF3F0", "#FFBF69"],
            count: 4,
            xArrange: newnoise(floor(bar), 8731) < 0.5,
            yArrange: newnoise(floor(bar), 4527) < 0.5,
            arrange: 0.1,
        },
        style: {
            mode: noise(floor(bar)) < 0.5 ? "fill" : "stroke",
            objectMode: "rect",
        },
    };

    // draw
    generativeVisualMusic(params);

    // blendMode reset
    blendMode(BLEND);

    // UI
    drawBeatUI(beatInfo);
}

// ======== phase easing ========

function getPhaseWithEasing(count, options = {}) {
    const defaults = {
        cycleLength: 64, // カウントの周期
        easeDuration: 8, // イージングの継続時間
        easeFunction: Easing.easeInOutSine, // イージング関数
    };

    const p = { ...defaults, ...options };

    // イージング開始オフセットを周期とイージング継続時間から計算
    const easeStartOffset = p.cycleLength - p.easeDuration;

    const basePhase = floor(count / p.cycleLength);
    const cyclePosition = count % p.cycleLength;
    const easeProgress =
        (max(easeStartOffset, cyclePosition) - easeStartOffset) / p.easeDuration;
    const easeValue = p.easeFunction(fract(easeProgress));

    return basePhase + easeValue;
}

// ======== full screen ========

function keyPressed() {
    if (keyCode === 32) {
        let fs = fullscreen();
        fullscreen(!fs);
        if (fs) {
            cursor();
        } else {
            noCursor();
        }
    }
}

function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
}
